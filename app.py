import os, time, random, threading, re, sqlite3
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session
import requests
from contextlib import contextmanager
from threading import Lock

# ---------- Setup ----------
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

CLIENT_ID = os.environ["REDDIT_CLIENT_ID"]
CLIENT_SECRET = os.environ["REDDIT_CLIENT_SECRET"]
USER_AGENT = os.environ.get("USER_AGENT", "web:aita-random:0.1 (by /u/unknown)")
PORT = int(os.environ.get("PORT", "8080"))

TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
API_BASE = "https://oauth.reddit.com"
SUBREDDIT = "AmItheAsshole"

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = os.environ.get("SESSION_SECRET", os.urandom(24))  # for per-session vote dedupe

# ---------- Verdict flair detection ----------
# Normalize flair (letters only, uppercase) and match a known verdict set.
_VERDICT_KEYS = {
    "YTA", "NTA", "ESH", "NAH",
    "NOTTHEAHOLE", "EVERYONESUCKSHERE", "NOAHOLESHERE", "ASSHOLE"
}
def is_verdict_flair(flair: str | None) -> bool:
    if not flair:
        return False
    s = re.sub(r"[^A-Za-z]", "", flair).upper()  # strip spaces, hyphens, punctuation
    return s in _VERDICT_KEYS

# ---------- SQLite (persistent votes) ----------
# NOTE: allows mounting a disk in production by setting VOTES_DB_PATH env var
DB_PATH = os.environ.get("VOTES_DB_PATH", os.path.join(BASE_DIR, "votes.db"))
_db_lock = Lock()

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS votes (
                post_id TEXT PRIMARY KEY,
                yta INTEGER NOT NULL DEFAULT 0,
                nta INTEGER NOT NULL DEFAULT 0,
                esh INTEGER NOT NULL DEFAULT 0
            )
        """)
        # Migrate old DBs that might be missing 'esh'
        cols = {row[1] for row in conn.execute("PRAGMA table_info(votes)").fetchall()}
        if "esh" not in cols:
            conn.execute("ALTER TABLE votes ADD COLUMN esh INTEGER NOT NULL DEFAULT 0")
        conn.commit()

@contextmanager
def db():
    with _db_lock:
        conn = sqlite3.connect(DB_PATH, timeout=10, check_same_thread=False)
        try:
            yield conn
        finally:
            conn.close()

def db_get_counts(post_id):
    with db() as conn:
        cur = conn.execute("SELECT yta, nta, esh FROM votes WHERE post_id = ?", (post_id,))
        row = cur.fetchone()
        if not row:
            return {"YTA": 0, "NTA": 0, "ESH": 0}
        return {"YTA": int(row[0]), "NTA": int(row[1]), "ESH": int(row[2])}

def db_apply_vote(post_id, from_vote, to_vote):
    """Increment/decrement tallies safely; create row if missing. to_vote in {YTA,NTA,ESH}"""
    if to_vote not in ("YTA", "NTA", "ESH"):
        return db_get_counts(post_id)
    with db() as conn:
        conn.execute("INSERT OR IGNORE INTO votes (post_id, yta, nta, esh) VALUES (?, 0, 0, 0)", (post_id,))
        def dec(v):
            if v == "YTA": conn.execute("UPDATE votes SET yta = CASE WHEN yta > 0 THEN yta - 1 ELSE 0 END WHERE post_id = ?", (post_id,))
            if v == "NTA": conn.execute("UPDATE votes SET nta = CASE WHEN nta > 0 THEN nta - 1 ELSE 0 END WHERE post_id = ?", (post_id,))
            if v == "ESH": conn.execute("UPDATE votes SET esh = CASE WHEN esh > 0 THEN esh - 1 ELSE 0 END WHERE post_id = ?", (post_id,))
        def inc(v):
            if v == "YTA": conn.execute("UPDATE votes SET yta = yta + 1 WHERE post_id = ?", (post_id,))
            if v == "NTA": conn.execute("UPDATE votes SET nta = nta + 1 WHERE post_id = ?", (post_id,))
            if v == "ESH": conn.execute("UPDATE votes SET esh = esh + 1 WHERE post_id = ?", (post_id,))
        if from_vote and from_vote != to_vote:
            dec(from_vote)
            inc(to_vote)
        elif not from_vote:
            inc(to_vote)
        # if from_vote == to_vote: no change
        conn.commit()
    return db_get_counts(post_id)

# ---------- Caches & Reddit auth ----------
POST_CACHE = {}
CACHE_TTL = 600  # 10 minutes

def get_access_token():
    """Get (or refresh) a userless token with the 'read' scope."""
    tok = POST_CACHE.get("_token")
    if tok and time.time() < tok["exp"] - 15:
        return tok["value"]

    data = {"grant_type": "client_credentials", "scope": "read"}
    auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    headers = {"User-Agent": USER_AGENT}
    r = requests.post(TOKEN_URL, data=data, auth=auth, headers=headers, timeout=30)
    try:
        r.raise_for_status()
    except requests.HTTPError:
        print("TOKEN DEBUG:", r.status_code, r.text)
        raise
    j = r.json()
    token_val = j["access_token"]
    POST_CACHE["_token"] = {"value": token_val, "exp": time.time() + j.get("expires_in", 3600)}
    return token_val

def api_get(path, params=None):
    token = get_access_token()
    headers = {"Authorization": f"bearer {token}", "User-Agent": USER_AGENT}
    r = requests.get(API_BASE + path, headers=headers, params=params or {}, timeout=30)
    try:
        r.raise_for_status()
    except requests.HTTPError:
        print("API DEBUG:", r.status_code, r.text)
        raise
    return r.json()

# ---------- Data shaping & filters ----------
def normalize(item):
    d = item.get("data", {})
    title = (d.get("title") or "").strip()
    text = (d.get("selftext") or "").strip()
    flair_raw = (d.get("link_flair_text") or "").strip()
    if not d.get("is_self"):
        return None
    if not title or len(text) < 80:
        return None

    # Separate verdict flair from general flair: hide verdict until vote
    verdict_flair = flair_raw if is_verdict_flair(flair_raw) else None
    display_flair = None if verdict_flair else (flair_raw or None)

    return {
        "id": d.get("id"),
        "title": title,
        "text": text,
        "permalink": "https://www.reddit.com" + (d.get("permalink") or ""),
        "subreddit": d.get("subreddit") or SUBREDDIT,
        "flair": flair_raw,                   # raw (for filtering)
        "display_flair": display_flair,       # show immediately (non-verdict only)
        "verdict_flair": verdict_flair,       # reveal after vote
        "over_18": bool(d.get("over_18")),
        "created_utc": d.get("created_utc"),
    }

def fetch_posts(sort="hot", t=None):
    key = (sort, t or "")
    now = time.time()
    cached = POST_CACHE.get(key)
    if cached and now - cached["ts"] < CACHE_TTL:
        return cached["posts"]

    collected = []
    params = {"limit": 100}
    if sort == "top" and t:
        params["t"] = t

    j = api_get(f"/r/{SUBREDDIT}/{sort}", params=params)
    for c in j.get("data", {}).get("children", []):
        norm = normalize(c)
        if norm:
            collected.append(norm)

    random.shuffle(collected)
    POST_CACHE[key] = {"posts": collected, "ts": now}
    return collected

def apply_filters(posts, include_nsfw=False, flair_mode=None, flair_terms=None):
    results = []
    terms = [t.strip().lower() for t in (flair_terms or []) if t.strip()]
    for p in posts:
        if not include_nsfw and p.get("over_18"):
            continue
        flair_lower = (p.get("flair") or "").lower()
        if terms:
            if flair_mode == "include":
                if not any(term in flair_lower for term in terms):
                    continue
            elif flair_mode == "exclude":
                if any(term in flair_lower for term in terms):
                    continue
        results.append(p)
    return results

# ---------- Routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/random")
def api_random():
    try:
        sort = request.args.get("sort", "hot")
        t = request.args.get("t") if sort == "top" else None
        include_nsfw = request.args.get("nsfw", "0") in ("1", "true", "True")
        flair_mode = request.args.get("flair_mode")  # "include" | "exclude" | None
        flairs = request.args.get("flairs", "")
        flair_terms = [s for s in flairs.split(",")] if flairs else []

        posts = fetch_posts(sort=sort, t=t)
        posts = apply_filters(posts, include_nsfw=include_nsfw, flair_mode=flair_mode, flair_terms=flair_terms)

        if not posts:
            return jsonify({"error": "no_posts", "message": "No posts matched your filters. Try relaxing them."}), 404

        post = random.choice(posts)
        return jsonify({"post": post})
    except Exception as e:
        return jsonify({"error": "server_error", "detail": str(e)}), 500

@app.route("/api/vote", methods=["POST"])
def api_vote():
    try:
        data = request.get_json(force=True, silent=False)
        post_id = data.get("post_id")
        vote = data.get("vote")  # "YTA" | "NTA" | "ESH"
        if vote not in ("YTA", "NTA", "ESH") or not post_id:
            return jsonify({"ok": False, "error": "invalid_vote"}), 400

        session.setdefault("voted", {})
        prev = session["voted"].get(post_id)

        counts = db_apply_vote(post_id, prev, vote)
        session["voted"][post_id] = vote

        return jsonify({"ok": True, "counts": counts, "your_vote": vote})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/results")
def api_results():
    post_id = request.args.get("post_id")
    if not post_id:
        return jsonify({"ok": False, "error": "missing_post_id"}), 400
    counts = db_get_counts(post_id)
    your_vote = session.get("voted", {}).get(post_id)
    return jsonify({"ok": True, "counts": counts, "your_vote": your_vote})

# ---------- Warm cache on boot ----------
def warm_start():
    try:
        for sort, t in [("hot", None), ("new", None), ("top", "week"), ("top", "month")]:
            fetch_posts(sort=sort, t=t)
    except Exception as e:
        print("Warm start warning:", e)

if __name__ == "__main__":
    init_db()
    threading.Thread(target=warm_start, daemon=True).start()
    app.run(host="127.0.0.1", port=PORT, debug=True)  # local dev; use gunicorn in prod
