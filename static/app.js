// ---------- Elements ----------
const titleEl = document.getElementById("title");
const textEl  = document.getElementById("text");
const metaEl  = document.getElementById("meta");
const errorEl = document.getElementById("error");
const openEl  = document.getElementById("openLink");
const spinner = document.getElementById("spinner");

const sortSel = document.getElementById("sort");
const rangeSel = document.getElementById("topRange");
const flairModeSel = document.getElementById("flairMode");
const flairTermsInput = document.getElementById("flairTerms");
const nsfwChk = document.getElementById("nsfw");

const randomBtn = document.getElementById("randomBtn");
const shareBtn  = document.getElementById("share");

const speakBtn = document.getElementById("speak");
const pauseBtn = document.getElementById("pause");

const voteYTA = document.getElementById("voteYTA");
const voteNTA = document.getElementById("voteNTA");
const voteESH = document.getElementById("voteESH");
const tallyEl = document.getElementById("tally");

const synth = window.speechSynthesis;

// ---------- State ----------
let currentPost = null;
let paused = false;

// ---------- Helpers ----------
function setLoading(isLoading) {
  spinner.style.display = isLoading ? "inline-block" : "none";
  randomBtn.disabled = isLoading;
  errorEl.textContent = "";
}

function setError(msg) {
  errorEl.textContent = msg || "";
}

function qs() {
  const p = new URLSearchParams();
  if (sortSel.value) p.set("sort", sortSel.value);
  if (sortSel.value === "top" && rangeSel.value) p.set("t", rangeSel.value);
  if (nsfwChk.checked) p.set("nsfw", "1");
  if (flairModeSel.value) p.set("flair_mode", flairModeSel.value);
  if (flairTermsInput.value.trim()) p.set("flairs", flairTermsInput.value.trim());
  return p.toString();
}

function updateMeta(post, revealVerdict = false) {
  const base = `r/${post.subreddit}`;
  const flair = post.display_flair && !revealVerdict ? ` • flair: ${post.display_flair}` : "";
  const verdict = revealVerdict && post.verdict_flair ? ` • verdict: ${post.verdict_flair}` : "";
  const nsfw = post.over_18 ? " • NSFW" : "";
  metaEl.textContent = `${base}${flair}${verdict}${nsfw}`;
}

function updateView(post) {
  currentPost = post;
  titleEl.textContent = post.title || "(no title)";
  textEl.textContent  = post.text || "";
  updateMeta(post, /*revealVerdict*/ false);
  openEl.href = post.permalink || "#";
  tallyEl.textContent = "(no votes yet)";
  fetchResults(); // pull current tally if any
}

// ---------- Fetch ----------
async function fetchRandom() {
  setLoading(true);
  stopSpeech();
  try {
    const res = await fetch(`/api/random?${qs()}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 404 && data.message) setError(data.message);
      else setError(data.error || `HTTP ${res.status}`);
      return;
    }
    const { post } = await res.json();
    updateView(post);
  } catch (e) {
    setError(String(e));
  } finally {
    setLoading(false);
  }
}

// ---------- Voting ----------
async function vote(which) {
  if (!currentPost?.id) return;
  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ post_id: currentPost.id, vote: which })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || `Vote failed (HTTP ${res.status})`);
      return;
    }
    const y = data.counts?.YTA || 0;
    const n = data.counts?.NTA || 0;
    const e = data.counts?.ESH || 0;
    const yours = data.your_vote ? ` • you voted: ${data.your_vote}` : "";
    tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}${yours}`;

    // Reveal verdict flair (if any) after user votes
    updateMeta(currentPost, /*revealVerdict*/ true);
  } catch (err) {
    setError(String(err));
  }
}

async function fetchResults() {
  if (!currentPost?.id) return;
  try {
    const res = await fetch(`/api/results?post_id=${encodeURIComponent(currentPost.id)}`);
    const data = await res.json();
    if (!res.ok || !data.ok) return;
    const y = data.counts?.YTA || 0;
    const n = data.counts?.NTA || 0;
    const e = data.counts?.ESH || 0;
    const yours = data.your_vote ? ` • you voted: ${data.your_vote}` : "";
    if (y + n + e > 0) tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}${yours}`;
    if (data.your_vote) updateMeta(currentPost, /*revealVerdict*/ true); // reveal if already voted
  } catch {}
}

// ---------- Speech ----------
function stopSpeech() {
  synth.cancel();
  paused = false;
  pauseBtn.textContent = "⏸️ Pause";
}

function readAloud() {
  if (!currentPost) return;
  stopSpeech(); // cancel anything in progress
  const u = new SpeechSynthesisUtterance(`${currentPost.title}. ${currentPost.text}`);
  synth.speak(u);
  paused = false;
  pauseBtn.textContent = "⏸️ Pause";
}

function pauseOrResume() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    paused = true;
    pauseBtn.textContent = "▶️ Resume";
  } else if (synth.paused) {
    synth.resume();
    paused = false;
    pauseBtn.textContent = "⏸️ Pause";
  }
}

// ---------- Events ----------
randomBtn.addEventListener("click", fetchRandom);
shareBtn.addEventListener("click", async () => {
  if (!currentPost?.permalink) return;
  try {
    await navigator.clipboard.writeText(currentPost.permalink);
    setError("Link copied to clipboard!");
    setTimeout(() => setError(""), 1500);
  } catch {
    setError("Could not copy link.");
  }
});

speakBtn.addEventListener("click", readAloud);
pauseBtn.addEventListener("click", pauseOrResume);

sortSel.addEventListener("change", () => {
  const isTop = sortSel.value === "top";
  rangeSel.style.display = isTop ? "inline-block" : "none";
});

voteYTA.addEventListener("click", () => vote("YTA"));
voteNTA.addEventListener("click", () => vote("NTA"));
voteESH.addEventListener("click", () => vote("ESH"));

// Initial UI state
rangeSel.style.display = "none";
setError("");
