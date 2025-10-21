import os, time, random, threading, sqlite3, tempfile
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify, request, session, send_from_directory
import requests
from contextlib import contextmanager
from threading import Lock

# ---------- Setup ----------
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR   = os.path.join(BASE_DIR, "static")

CLIENT_ID     = os.environ["REDDIT_CLIENT_ID"]
CLIENT_SECRET = os.environ["REDDIT_CLIENT_SECRET"]
USER_AGENT    = os.environ.get("USER_AGENT", "web:aita-random:0.1 (by /u/unknown)")
PORT          = int(os.environ.get("PORT", "8080"))

TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
API_BASE  = "https://oauth.reddit.com"

# Allowed subreddits (add more safely here)
ALLOWED_SUBS = {
    "AmItheAsshole": "AmItheAsshole",
    "twohottakes": "twohottakes",
    "AmIOverreacting": "AmIOverreacting",
}
DEFAULT_SUB = "AmItheAsshole"
ALL_TOKEN   = "ALL"

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = os.environ.get("SESSION_SECRET", os.urandom(24))

# ---------- SQLite (votes) ----------
DB_PATH  = os.environ.get("VOTES_DB_PATH", os.path.join(tempfile.gettempdir(), "votes.db"))
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

def db_apply_vote_once(post_id, to_vote):
    with db() as conn:
        conn.execute("INSERT OR IGNORE INTO votes (post_id, yta, nta, esh) VALUES (?, 0, 0, 0)", (post_id,))
        if to_vote == "YTA":
            conn.execute("UPDATE votes SET yta = yta + 1 WHERE post_id = ?", (post_id,))
        elif to_vote == "NTA":
            conn.execute("UPDATE votes SET nta = nta + 1 WHERE post_id = ?", (post_id,))
        elif to_vote == "ESH":
            conn.execute("UPDATE votes SET esh = esh + 1 WHERE post_id = ?", (post_id,))
        conn.commit()
    return db_get_counts(post_id)

# ---------- Reddit auth & fetch ----------
POST_CACHE = {}
CACHE_TTL  = 600  # 10 min

def get_access_token():
    tok = POST_CACHE.get("_token")
    if tok and time.time() < tok["exp"] - 15:
        return tok["value"]
    data = {"grant_type": "client_credentials", "scope": "read"}
    auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    headers = {"User-Agent": USER_AGENT}
    r = requests.post(TOKEN_URL, data=data, auth=auth, headers=headers, timeout=30)
    r.raise_for_status()
    j = r.json()
    POST_CACHE["_token"] = {"value": j["access_token"], "exp": time.time() + j.get("expires_in", 3600)}
    return POST_CACHE["_token"]["value"]

def api_get(path, params=None):
    token   = get_access_token()
    headers = {"Authorization": f"bearer {token}", "User-Agent": USER_AGENT}
    r = requests.get(API_BASE + path, headers=headers, params=params or {}, timeout=30)
    r.raise_for_status()
    return r.json()

def normalize(item):
    d = item.get("data", {})
    if not d.get("is_self"):
        return None
    title = (d.get("title") or "").strip()
    text  = (d.get("selftext") or "").strip()
    flair = (d.get("link_flair_text") or "").strip() or None
    if not title or len(text) < 80:
        return None
    return {
        "id": d.get("id"),
        "title": title,
        "text": text,
        "permalink": "https://www.reddit.com" + (d.get("permalink") or ""),
        "subreddit": d.get("subreddit"),
        "flair": flair,
        "over_18": bool(d.get("over_18")),
        "created_utc": d.get("created_utc"),
    }

def fetch_posts(subreddit, sort="hot", t=None):
    key = (subreddit, sort, t or "")
    now = time.time()
    cached = POST_CACHE.get(key)
    if cached and now - cached["ts"] < CACHE_TTL:
        return cached["posts"]
    params = {"limit": 100}
    if sort == "top" and t:
        params["t"] = t
    j = api_get(f"/r/{subreddit}/{sort}", params=params)
    posts = [normalize(c) for c in j.get("data", {}).get("children", []) if normalize(c)]
    random.shuffle(posts)
    POST_CACHE[key] = {"posts": posts, "ts": now}
    return posts

def apply_filters(posts, include_nsfw=False, search_q=None):
    q = (search_q or "").strip().lower()
    results = []
    for p in posts:
        if not include_nsfw and p.get("over_18"):
            continue
        if q and q not in f"{p['title']} {p['text']}".lower():
            continue
        results.append(p)
    return results

def resolve_sub(value):
    if not value:
        return DEFAULT_SUB
    v = value.strip()
    if v.lower() in ("all", ALL_TOKEN.lower()):
        return ALL_TOKEN
    for k in ALLOWED_SUBS:
        if k.lower() == v.lower():
            return ALLOWED_SUBS[k]
    return DEFAULT_SUB

# ---------- Routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/health")
def health():
    return "ok", 200

@app.route("/privacy")
@app.route("/privacy/")
def privacy():
    return render_template("privacy.html")

@app.route("/api/random")
def api_random():
    sub_token = resolve_sub(request.args.get("sub"))
    sort = request.args.get("sort", "hot")
    t = request.args.get("t") if sort == "top" else None
    include_nsfw = request.args.get("nsfw", "0") in ("1", "true", "True")
    search_q = request.args.get("q", "").strip()

    if sort == "all":
        sort = "hot"

    if sub_token == ALL_TOKEN:
        posts = []
        for s in ALLOWED_SUBS.values():
            posts.extend(fetch_posts(subreddit=s, sort=sort, t=t))
    else:
        posts = fetch_posts(subreddit=sub_token, sort=sort, t=t)

    posts = apply_filters(posts, include_nsfw=include_nsfw, search_q=search_q)
    if not posts:
        return jsonify({"error": "no_posts"}), 404
    post = random.choice(posts)
    your_vote = session.get("voted", {}).get(post["id"])
    return jsonify({"post": post, "your_vote": your_vote})

@app.route("/api/post")
def api_post_by_id():
    pid = request.args.get("id", "").strip()
    if not pid:
        return jsonify({"ok": False, "error": "missing_id"}), 400
    try:
        j = api_get("/api/info", params={"id": f"t3_{pid}"})
        children = j.get("data", {}).get("children", [])
        if not children:
            return jsonify({"ok": False, "error": "not_found"}), 404
        post = normalize(children[0])
        if not post:
            return jsonify({"ok": False, "error": "not_found"}), 404
        your_vote = session.get("voted", {}).get(post["id"])
        return jsonify({"ok": True, "post": post, "your_vote": your_vote})
    except requests.HTTPError as e:
        return jsonify({"ok": False, "error": "fetch_failed", "detail": str(e)}), 502

@app.route("/api/vote", methods=["POST"])
def api_vote():
    data = request.get_json(force=True)
    post_id = data.get("post_id")
    vote = data.get("vote")
    if vote not in ("YTA", "NTA", "ESH") or not post_id:
        return jsonify({"ok": False, "error": "invalid_vote"}), 400
    voted = dict(session.get("voted", {}))
    if voted.get(post_id):
        counts = db_get_counts(post_id)
        return jsonify({"ok": False, "error": "already_voted", "counts": counts})
    counts = db_apply_vote_once(post_id, vote)
    voted[post_id] = vote
    session["voted"] = voted
    session.modified = True
    return jsonify({"ok": True, "counts": counts})

@app.route("/api/results")
def api_results():
    post_id = request.args.get("post_id")
    if not post_id:
        return jsonify({"ok": False, "error": "missing_post_id"}), 400
    counts = db_get_counts(post_id)
    your_vote = session.get("voted", {}).get(post_id)
    return jsonify({"ok": True, "counts": counts, "your_vote": your_vote})

# ---------- Startup ----------
def warm_start():
    try:
        for sub in ALLOWED_SUBS.values():
            for sort, t in [("hot", None), ("new", None), ("top", "week")]:
                fetch_posts(sub, sort, t)
    except Exception as e:
        print("Warm start warning:", e)

init_db()
threading.Thread(target=warm_start, daemon=True).start()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=PORT, debug=True)
