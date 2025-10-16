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

const speakBtn = document.getElementById("speak");
const pauseBtn = document.getElementById("pause");

const voteYTA = document.getElementById("voteYTA");
const voteNTA = document.getElementById("voteNTA");
const voteESH = document.getElementById("voteESH");
const tallyEl = document.getElementById("tally");

// Share buttons
const shareNativeBtn  = document.getElementById("shareNative");
const shareCopyBtn    = document.getElementById("shareCopy");
const shareWhatsBtn   = document.getElementById("shareWhatsApp");
const shareFbBtn      = document.getElementById("shareFacebook");
const shareXBtn       = document.getElementById("shareX");
const shareRedditBtn  = document.getElementById("shareReddit");
const shareSMSBtn     = document.getElementById("shareSMS");

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

// Before voting: show nothing but subreddit (+ NSFW marker)
// After voting: show verdict flair or "No verdict yet"
function setMetaPreVote(post) {
  const nsfw = post.over_18 ? " • NSFW" : "";
  metaEl.textContent = `r/${post.subreddit}${nsfw}`;
}

function setMetaPostVote(post) {
  const verdictText = post.flair ? post.flair : "No verdict yet";
  const nsfw = post.over_18 ? " • NSFW" : "";
  metaEl.textContent = `r/${post.subreddit} • verdict: ${verdictText}${nsfw}`;
}

function updateView(post, yourVote=null) {
  currentPost = post;
  titleEl.textContent = post.title || "(no title)";
  textEl.textContent  = post.text || "";
  openEl.href = post.permalink || "#";
  tallyEl.textContent = "(no votes yet)";

  if (yourVote) {
    setMetaPostVote(post);
  } else {
    setMetaPreVote(post);
  }

  fetchResults(); // get tallies & reveal if already voted this session
}

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

    // Handle "already voted" gracefully (HTTP 200 with ok:false)
    if (!data.ok && data.error === "already_voted") {
      const y = data.counts?.YTA || 0;
      const n = data.counts?.NTA || 0;
      const e = data.counts?.ESH || 0;
      const yours = data.your_vote ? ` • you already voted: ${data.your_vote}` : "";
      tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}${yours}`;
      setMetaPostVote(currentPost); // reveal verdict or "No verdict yet"
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
    const yours = data.your_vote ? ` • you voted: ${data.your_vote}` : "";
    tallyEl.textContent = `YTA: ${y} • NTA: ${n} • ESH: ${e}${yours}`;
    setMetaPostVote(currentPost); // reveal verdict or "No verdict yet"
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

// ---------- Sharing ----------
function shareTextAndUrl() {
  const url = currentPost?.permalink || window.location.href;
  const text = currentPost?.title ? `AITA: ${currentPost.title}` : `Check this AITA story`;
  return { text, url };
}

async function nativeShare() {
  const { text, url } = shareTextAndUrl();
  if (navigator.share) {
    try {
      await navigator.share({ title: text, text, url });
      setError("Shared!");
      setTimeout(() => setError(""), 1500);
      return;
    } catch {}
  }
  await copyLink();
}

async function copyLink() {
  const { url } = shareTextAndUrl();
  try {
    await navigator.clipboard.writeText(url);
    setError("Link copied to clipboard!");
    setTimeout(() => setError(""), 1500);
  } catch {
    setError("Could not copy link.");
  }
}

function openShare(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
function shareWhatsApp() {
  const { text, url } = shareTextAndUrl();
  openShare(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
}
function shareFacebook() {
  const { url } = shareTextAndUrl();
  openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
}
function shareX() {
  const { text, url } = shareTextAndUrl();
  openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
}
function shareReddit() {
  const { text, url } = shareTextAndUrl();
  openShare(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
}
function shareSMS() {
  const { text, url } = shareTextAndUrl();
  window.location.href = `sms:?&body=${encodeURIComponent(text + " " + url)}`;
}

// ---------- Events ----------
randomBtn.addEventListener("click", fetchRandom);

speakBtn.addEventListener("click", readAloud);
pauseBtn.addEventListener("click", pauseOrResume);

sortSel.addEventListener("change", () => {
  const isTop = sortSel.value === "top";
  rangeSel.style.display = isTop ? "inline-block" : "none";
});

voteYTA.addEventListener("click", () => vote("YTA"));
voteNTA.addEventListener("click", () => vote("NTA"));
voteESH.addEventListener("click", () => vote("ESH"));

shareNativeBtn.addEventListener("click", nativeShare);
shareCopyBtn.addEventListener("click", copyLink);
shareWhatsBtn.addEventListener("click", shareWhatsApp);
shareFbBtn.addEventListener("click", shareFacebook);
shareXBtn.addEventListener("click", shareX);
shareRedditBtn.addEventListener("click", shareReddit);
shareSMSBtn.addEventListener("click", shareSMS);

// Initial UI state
rangeSel.style.display = "none";
setError("");
