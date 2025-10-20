// ----- element refs -----
const titleEl = document.getElementById("title");
const textEl  = document.getElementById("text");
const metaEl  = document.getElementById("meta");
const errorEl = document.getElementById("error");
const openEl  = document.getElementById("openLink");
const spinner = document.getElementById("spinner");

const subSel    = document.getElementById("subreddit");
const sortSel   = document.getElementById("sort");
const rangeSel  = document.getElementById("topRange");
const nsfwChk   = document.getElementById("nsfw");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

const randomBtn = document.getElementById("randomBtn");
const speakBtn  = document.getElementById("speak");
const pauseBtn  = document.getElementById("pause");

const voteBlock = document.getElementById("voteBlock");
const voteYTA = document.getElementById("voteYTA");
const voteNTA = document.getElementById("voteNTA");
const voteESH = document.getElementById("voteESH");
const tallyEl = document.getElementById("tally");

// Share + Filters + FAB
const shareToggle = document.getElementById("shareToggle");
const shareMenu   = document.getElementById("shareMenu");
const filterToggle = document.getElementById("filterToggle");
const filtersPanel = document.getElementById("filters");
const fabBtn = document.getElementById("fabRandomBtn");

const synth = window.speechSynthesis;
let currentPost = null;

// subs where we disable votes and suppress flair display
const NO_VOTE_NO_FLAIR_SUBS = new Set(["twohottakes", "AmIOverreacting"]);

// --------- helpers ----------
function setLoading(isLoading) {
  if (spinner) spinner.style.display = isLoading ? "inline-block" : "none";
  if (randomBtn) randomBtn.disabled = isLoading;
  if (errorEl) errorEl.textContent = "";
}
function setError(msg) { if (errorEl) errorEl.textContent = msg || ""; }

function qs() {
  const p = new URLSearchParams();
  if (subSel?.value) p.set("sub", subSel.value);
  if (sortSel?.value && sortSel.value !== "all") p.set("sort", sortSel.value);
  if (sortSel?.value === "top" && rangeSel?.value) p.set("t", rangeSel.value);
  if (nsfwChk?.checked) p.set("nsfw", "1");
  if (searchBox?.value?.trim()) p.set("q", searchBox.value.trim());
  return p.toString();
}

function shouldHideVotesAndFlair(post) {
  if (!post?.subreddit) return false;
  return Array.from(NO_VOTE_NO_FLAIR_SUBS).some(
    s => s.toLowerCase() === post.subreddit.toLowerCase()
  );
}

function setMetaPreVote(post) {
  if (!metaEl) return;
  if (shouldHideVotesAndFlair(post)) {
    metaEl.textContent = post.over_18 ? "NSFW" : "";
    return;
  }
  metaEl.textContent = post.over_18 ? "NSFW" : "";
}

function setMetaPostVote(post) {
  if (!metaEl) return;
  if (shouldHideVotesAndFlair(post)) {
    metaEl.textContent = post.over_18 ? "NSFW" : "";
    return;
  }
  const verdictText = post.flair ? post.flair : "No verdict yet";
  const nsfw = post.over_18 ? " • NSFW" : "";
  metaEl.textContent = `Verdict: ${verdictText}${nsfw}`;
}

function toggleVotesVisibility(post) {
  if (!voteBlock) return;
  const hide = shouldHideVotesAndFlair(post);
  voteBlock.style.display = hide ? "none" : "flex";
  if (hide && tallyEl) tallyEl.textContent = "";
}

function scrollToTop() {
  const card = document.getElementById("postCard") || document.body;
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateView(post, yourVote=null) {
  currentPost = post;
  if (titleEl) titleEl.textContent = post.title || "(no title)";
  if (textEl)  textEl.textContent  = post.text || "";
  if (openEl)  openEl.href = post.permalink || "#";

  toggleVotesVisibility(post);
  if (tallyEl) tallyEl.textContent = "";

  if (yourVote) setMetaPostVote(post); else setMetaPreVote(post);
  if (!shouldHideVotesAndFlair(post)) fetchResults();

  if (post?.id) {
    const url = new URL(window.location.href);
    url.searchParams.set("id", post.id);
    if (subSel?.value) url.searchParams.set("sub", subSel.value);
    history.replaceState({}, "", url.toString());
  }

  scrollToTop();
}

// --------- Fetchers ----------
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

async function fetchById(pid) {
  if (!pid) return fetchRandom();
  setLoading(true);
  stopSpeech();
  try {
    const res = await fetch(`/api/post?id=${encodeURIComponent(pid)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return fetchRandom();
    }
    const { post, your_vote } = data;
    updateView(post, your_vote);
  } catch (e) {
    fetchRandom();
  } finally {
    setLoading(false);
  }
}

// --------- Voting ----------
async function vote(which) {
  if (!currentPost?.id) return;
  if (shouldHideVotesAndFlair(currentPost)) return;

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
      const total = y + n + e;
      if (tallyEl) tallyEl.textContent = total > 0 ? `YTA: ${y} • NTA: ${n} • ESH: ${e}` : "";
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
    const total = y + n + e;
    if (tallyEl) tallyEl.textContent = total > 0 ? `YTA: ${y} • NTA: ${n} • ESH: ${e}` : "";
    setMetaPostVote(currentPost);
  } catch (err) {
    setError(String(err));
  }
}

async function fetchResults() {
  if (!currentPost?.id) return;
  if (shouldHideVotesAndFlair(currentPost)) return;
  try {
    const res = await fetch(`/api/results?post_id=${encodeURIComponent(currentPost.id)}`);
    const data = await res.json();
    if (!res.ok || !data.ok) return;
    const y = data.counts?.YTA || 0;
    const n = data.counts?.NTA || 0;
    const e = data.counts?.ESH || 0;
    const total = y + n + e;
    if (tallyEl) tallyEl.textContent = total > 0 ? `YTA: ${y} • NTA: ${n} • ESH: ${e}` : "";
    if (data.your_vote) setMetaPostVote(currentPost);
  } catch {}
}

// --------- Speech ----------
function stopSpeech() { synth.cancel(); if (pauseBtn) pauseBtn.textContent = "⏸️ Pause"; }
function readAloud() {
  if (!currentPost) return;
  stopSpeech();
  const u = new SpeechSynthesisUtterance(`${currentPost.title}. ${currentPost.text}`);
  synth.speak(u);
  if (pauseBtn) pauseBtn.textContent = "⏸️ Pause";
}
function pauseOrResume() {
  if (synth.speaking && !synth.paused) {
    synth.pause(); if (pauseBtn) pauseBtn.textContent = "▶️ Resume";
  } else if (synth.paused) {
    synth.resume(); if (pauseBtn) pauseBtn.textContent = "⏸️ Pause";
  }
}

// --------- Share ----------
function yourPostUrl() {
  const url = new URL(window.location.origin);
  if (currentPost?.id) url.searchParams.set("id", currentPost.id);
  if (subSel?.value) url.searchParams.set("sub", subSel.value);
  return url.toString();
}
function shareTextAndUrl() {
  const url = yourPostUrl();
  const text = currentPost?.title ? `AITA: ${currentPost.title}` : `Check this story`;
  return { text, url };
}
function openShare(url) { window.open(url, "_blank", "noopener,noreferrer"); }
function handleShare(action) {
  const { text, url } = shareTextAndUrl();
  if (!action) return;
  switch (action) {
    case "whatsapp": openShare(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`); break;
    case "facebook": openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`); break;
    case "twitter":  openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`); break;
    case "reddit":   openShare(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`); break;
    case "sms":      window.location.href = `sms:?&body=${encodeURIComponent(text + " " + url)}`; break;
  }
}

// Share dropdown wiring (guarded; no redeclarations)
if (shareToggle && shareMenu) {
  shareToggle.addEventListener("click", e => {
    e.stopPropagation();
    shareMenu.style.display = shareMenu.style.display === "block" ? "none" : "block";
  });
  shareMenu.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    handleShare(btn.dataset.share);
    shareMenu.style.display = "none";
  });
  document.addEventListener("click", () => (shareMenu.style.display = "none"));
}

// Filters panel toggle (restores your dropdown)
if (filterToggle && filtersPanel) {
  filterToggle.addEventListener("click", () => {
    filtersPanel.classList.toggle("open");
  });
}

// FAB dice triggers same as Random button
if (fabBtn && randomBtn) {
  fabBtn.addEventListener("click", () => { scrollToTop(); fetchRandom(); });
}

// --------- Events ----------
if (randomBtn) randomBtn.addEventListener("click", () => { scrollToTop(); fetchRandom(); });
if (searchBtn) searchBtn.addEventListener("click", fetchRandom);
if (searchBox) searchBox.addEventListener("keydown", e => { if (e.key === "Enter") fetchRandom(); });

if (speakBtn) speakBtn.addEventListener("click", readAloud);
if (pauseBtn) pauseBtn.addEventListener("click", pauseOrResume);

if (sortSel) sortSel.addEventListener("change", () => {
  if (rangeSel) rangeSel.style.display = sortSel.value === "top" ? "inline-block" : "none";
});

if (subSel) subSel.addEventListener("change", () => {
  const url = new URL(window.location.href);
  url.searchParams.set("sub", subSel.value);
  url.searchParams.delete("id");
  history.replaceState({}, "", url.toString());
  fetchRandom();
});

if (voteYTA) voteYTA.addEventListener("click", () => vote("YTA"));
if (voteNTA) voteNTA.addEventListener("click", () => vote("NTA"));
if (voteESH) voteESH.addEventListener("click", () => vote("ESH"));

// --------- Initial load ----------
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sub = urlParams.get("sub");
  if (sub && subSel && Array.from(subSel.options).some(o => o.value.toLowerCase() === sub.toLowerCase())) {
    subSel.value = Array.from(subSel.options).find(o => o.value.toLowerCase() === sub.toLowerCase()).value;
  }

  const pid = urlParams.get("id");

  setTimeout(() => {
    if (pid) {
      fetchById(pid);
    } else {
      fetchRandom().catch(() => {
        setTimeout(fetchRandom, 1500);
      });
    }
  }, 400);
});

// Keep topRange hidden initially
if (rangeSel) rangeSel.style.display = "none";
setError("");
