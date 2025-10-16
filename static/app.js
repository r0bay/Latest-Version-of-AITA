// ---------- Elements ----------
const titleEl = document.getElementById("title");
const textEl  = document.getElementById("text");
const metaEl  = document.getElementById("meta");
const errorEl = document.getElementById("error");
const openEl  = document.getElementById("openLink");
const spinner = document.getElementById("spinner");

const sortSel   = document.getElementById("sort");
const rangeSel  = document.getElementById("topRange");
const nsfwChk   = document.getElementById("nsfw");
const searchBox = document.getElementById("searchBox");

const randomBtn = document.getElementById("randomBtn");

const speakBtn = document.getElementById("speak");
const pauseBtn = document.getElementById("pause");

const voteYTA = document.getElementById("voteYTA");
const voteNTA = document.getElementById("voteNTA");
const voteESH = document.getElementById("voteESH");
const tallyEl = document.getElementById("tally");

// Share dropdown
const shareToggle = document.getElementById("shareToggle");
const shareMenu   = document.getElementById("shareMenu");

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
  if (searchBox.value.trim()) p.set("q", searchBox.value.trim());
  return p.toString();
}

// Before voting: show nothing (except NSFW marker)
function setMetaPreVote(post) {
  const nsfw = post.over_18 ? "NSFW" : "";
  metaEl.textContent = nsfw;
}

// After voting: show "Verdict: <flair or No verdict yet>"
function setMetaPostVote(post) {
  const verdictText = post.flair ? post.flair : "No verdict yet";
  const nsfw = post.over_18 ? " • NSFW" : "";
  metaEl.textContent = `Verdict: ${verdictText}${nsfw}`;
}

function updateView(post, yourVote=null) {
  currentPost = post;
  titleEl.textContent = post.title || "(no title)";
  textEl.textContent  = post.text || "";
  openEl.href = post.permalink || "#";
  tallyEl.textContent = "(no votes yet)";
  if (yourVote) setMetaPostVote(post); else setMetaPreVote(post);
  fetchResults();
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
    const { post, your_vote } = await res.json();
    updateView(post, your_vote);
  } catch (e) {
    setError(String(e));
  } finally {
    setLoading(false);
  }
}

// ---------- Voting (one vote per story) ----------
async function vote(which) {
  if (!currentPost?.id) return;
  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ post_id: currentPost.id, vote: which })
    });
    const data = await res.json();

    if (!data.ok && data.error === "already_voted") {
      const y = data.counts?.YTA || 0;
      const n = data.counts?.NTA || 0;
      const e = data.counts?.ESH || 0;
      // No "you voted" text anymore:
      tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}`;
      setMetaPostVote(currentPost);
      setError("You can only vote once for this story.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (!res.ok || !data.ok) {
      setError(data.error || `Vote failed (HTTP ${res.status})`);
      return;
    }

    const y = data.counts?.YTA || 0;
    const n = data.counts?.NTA || 0;
    const e = data.counts?.ESH || 0;
    tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}`;
    setMetaPostVote(currentPost);
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
    // No "you voted" text here either:
    if (y + n + e > 0) tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}`;
    if (data.your_vote) setMetaPostVote(currentPost);
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
  stopSpeech();
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

// ---------- Share dropdown ----------
function shareTextAndUrl() {
  const url = currentPost?.permalink || window.location.href;
  const text = currentPost?.title ? `AITA: ${currentPost.title}` : `Check this AITA story`;
  return { text, url };
}

function openShare(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function handleShare(action) {
  const { text, url } = shareTextAndUrl();
  if (!action) return;

  switch (action) {
    case "whatsapp":
      openShare(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
      break;
    case "facebook":
      openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
      break;
    case "twitter":
      openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
      break;
    case "reddit":
      openShare(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
      break;
    case "sms":
      window.location.href = `sms:?&body=${encodeURIComponent(text + " " + url)}`;
      break;
  }
}

function toggleShareMenu(show) {
  shareMenu.style.display = show ? "block" : (shareMenu.style.display === "block" ? "none" : "block");
}

// ---------- Events ----------
randomBtn.addEventListener("click", fetchRandom);

speakBtn.addEventListener("click", readAloud);
pauseBtn.addEventListener("click", pauseOrResume);

sortSel.addEventListener("change", () => {
  const isTop = sortSel.value === "top";
  rangeSel.style.display = isTop ? "inline-block" : "none";
});

// Press Enter in search to fetch with that query
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchRandom();
});

voteYTA.addEventListener("click", () => vote("YTA"));
voteNTA.addEventListener("click", () => vote("NTA"));
voteESH.addEventListener("click", () => vote("ESH"));

// Share dropdown interactions
shareToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleShareMenu();
});
shareMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  handleShare(btn.dataset.share);
  toggleShareMenu(false);
});
document.addEventListener("click", () => {
  shareMenu.style.display = "none";
});

// ---------- Auto-load first story ----------
window.addEventListener("DOMContentLoaded", () => {
  fetchRandom();
});

// Initial UI state
rangeSel.style.display = "none";
setError("");
