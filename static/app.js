/* Random AITA — app.js (drop-in)
   - Mobile-first UI wiring for index.html provided earlier
   - Reddit fetch, filters, TTS, Share, GA4 events, scroll-depth
*/

/* ------------------------ Utilities ------------------------ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// GA4 safe sender
function gtagSafe(name, params) {
  try {
    if (typeof gtag === "function") {
      gtag("event", name, params || {});
      console.log("[GA] sent:", name, params || {});
    }
  } catch (e) {
    // no-op
  }
}

/* ------------------------ Elements ------------------------ */
const els = {
  title: $("#postTitle"),
  body: $("#postBody"),
  random: $("#randomBtn"),
  openReddit: $("#openReddit"),
  share: $("#shareToggle"),
  yta: $("#btnYTA"),
  nta: $("#btnNTA"),
  esh: $("#btnESH"),
  ttsRead: $("#ttsRead"),
  ttsPause: $("#ttsPause"),
  subSelect: $("#subSelect"),
  sortSelect: $("#sortSelect"),
  kw: $("#kw"),
  nsfw: $("#nsfw"),
  searchBtn: $("#searchBtn"),
  filters: $("#filters"),
};

let currentPost = null; // {title, selftext, url, permalink, over_18}

/* ------------------------ Reddit Fetch ------------------------ */
/**
 * Fetch posts from Reddit JSON. Tries your backend first (if you have /api/random),
 * otherwise falls back to Reddit's public JSON endpoints.
 */
async function fetchCandidatePosts({ subreddit, sort }) {
  // 1) Optional: your backend route (comment out if not used)
  // try {
  //   const r = await fetch(`/api/random?sub=${encodeURIComponent(subreddit)}&sort=${encodeURIComponent(sort)}`);
  //   if (r.ok) {
  //     const data = await r.json();
  //     if (Array.isArray(data?.posts) && data.posts.length) return data.posts;
  //   }
  // } catch {}

  // 2) Public Reddit JSON (CORS-friendly)
  const base = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}`;
  let path = "hot.json?limit=50";
  if (sort === "new") path = "new.json?limit=50";
  if (sort === "top") path = "top.json?t=day&limit=50";

  const url = `${base}/${path}`;
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error(`Reddit fetch failed: ${res.status}`);
  const json = await res.json();
  const children = json?.data?.children || [];
  return children.map(c => c.data);
}

function pickPost(posts, { allowNSFW, keyword }) {
  // filter by NSFW + keyword if provided
  let list = posts.filter(p => p && p.title && typeof p.title === "string");

  if (!allowNSFW) list = list.filter(p => !p.over_18);

  if (keyword && keyword.trim().length) {
    const kw = keyword.trim().toLowerCase();
    list = list.filter(p =>
      (p.title || "").toLowerCase().includes(kw) ||
      (p.selftext || "").toLowerCase().includes(kw)
    );
  }

  if (!list.length) return null;
  const idx = Math.floor(Math.random() * list.length);
  const p = list[idx];

  return {
    title: p.title || "(no title)",
    selftext: p.selftext || "",
    url: p.url || "",
    permalink: p.permalink ? `https://reddit.com${p.permalink}` : p.url || "",
    over_18: !!p.over_18,
  };
}

/* ------------------------ Render Post ------------------------ */
function renderPost(post) {
  currentPost = post;

  // Title
  els.title.textContent = post.title;

  // Body: split paragraphs nicely
  const paragraphs = (post.selftext || "")
    .trim()
    .split(/\n{2,}/)
    .map(s => s.trim())
    .filter(Boolean);

  els.body.innerHTML = paragraphs.length
    ? paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join("")
    : `<p class="muted">(No body text)</p>`;

  // Open on Reddit link
  els.openReddit.href = post.permalink || post.url || "#";

  // Scroll to top (below sticky header)
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Stop any ongoing TTS
  stopTTS();

  // GA: post_loaded
  gtagSafe("post_loaded", { event_category: "content" });

  // Reset scroll-depth tracking for this post
  window._scrollDepthSent = false;
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

/* ------------------------ Actions ------------------------ */
async function loadRandom() {
  const subreddit = els.subSelect?.value || "AmItheAsshole";
  const sort = els.sortSelect?.value || "all";
  const keyword = els.kw?.value || "";
  const allowNSFW = !!els.nsfw?.checked;

  try {
    disableButtons(true);
    gtagSafe("random_post_click", { event_category: "engagement" });

    const posts = await fetchCandidatePosts({ subreddit, sort });
    const picked = pickPost(posts, { allowNSFW, keyword });

    if (!picked) {
      els.title.textContent = "No matching posts found.";
      els.body.innerHTML = `<p class="muted">Try changing filters or keywords.</p>`;
      return;
    }

    renderPost(picked);
  } catch (e) {
    console.error(e);
    els.title.textContent = "Error loading post";
    els.body.innerHTML = `<p class="muted">${escapeHTML(String(e.message || e))}</p>`;
  } finally {
    disableButtons(false);
  }
}

function disableButtons(disabled) {
  [els.random, els.yta, els.nta, els.esh, els.searchBtn].forEach(b => { if (b) b.disabled = disabled; });
}

/* Verdicts (no backend store; GA only) */
function onVerdict(name) {
  if (!currentPost) return;
  gtagSafe("verdict_clicked", {
    event_category: "engagement",
    verdict: name,
    post_title: truncate(currentPost.title, 96),
    permalink: currentPost.permalink || ""
  });
}

function truncate(s, n) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/* Share button (also tracked) */
async function onShare() {
  try {
    const url = currentPost?.permalink || location.href;
    const title = currentPost?.title || document.title;
    if (navigator.share) {
      await navigator.share({ title, url });
      gtagSafe("share_clicked", { event_category: "engagement", platform: "web_share" });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      gtagSafe("share_clicked", { event_category: "engagement", platform: "clipboard" });
      flashShareCopied();
    }
  } catch (e) {
    // user cancelled — ignore
  }
}

function flashShareCopied() {
  const btn = els.share;
  if (!btn) return;
  const old = btn.textContent;
  btn.textContent = "Copied!";
  setTimeout(() => btn.textContent = old, 1200);
}

/* ------------------------ Text-to-Speech ------------------------ */
let speaking = false;
function speakText(text) {
  try {
    stopTTS(); // reset first
    if (!text || !window.speechSynthesis) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => { speaking = false; };
    speaking = true;
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore
  }
}

function pauseTTS() {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // use cancel() as "pause/stop" for reliability on iOS
    speaking = false;
  } catch {}
}

function stopTTS() {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    speaking = false;
  } catch {}
}

/* ------------------------ Scroll-depth (75%) ------------------------ */
function onScrollDepth() {
  try {
    const doc = document.documentElement;
    const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
    if (scrolled > 0.75 && !window._scrollDepthSent) {
      window._scrollDepthSent = true;
      gtagSafe("scroll_depth", { event_category: "engagement", value: 75 });
    }
  } catch {}
}

/* ------------------------ Wiring ------------------------ */
function bindEvents() {
  els.random?.addEventListener("click", loadRandom);
  els.searchBtn?.addEventListener("click", loadRandom);

  els.yta?.addEventListener("click", () => onVerdict("YTA"));
  els.nta?.addEventListener("click", () => onVerdict("NTA"));
  els.esh?.addEventListener("click", () => onVerdict("ESH"));

  els.share?.addEventListener("click", onShare);

  els.ttsRead?.addEventListener("click", () => {
    const text = `${currentPost?.title || ""}\n\n${els.body?.innerText || ""}`;
    speakText(text);
  });
  els.ttsPause?.addEventListener("click", pauseTTS);

  // Change of subreddit/sort should refresh when user taps Search/Random
  els.subSelect?.addEventListener("change", () => {/* no auto load to avoid surprises */});
  els.sortSelect?.addEventListener("change", () => {/* same */});

  window.addEventListener("scroll", onScrollDepth, { passive: true });
}

/* ------------------------ Init ------------------------ */
async function init() {
  bindEvents();
  // Load the first post on initial visit
  await loadRandom();
}

document.addEventListener("DOMContentLoaded", init);

/* ------------------------ Expose for debugging ------------------------ */
window.randomAITA = {
  loadRandom, onShare, onVerdict, speakText, pauseTTS, stopTTS
};
