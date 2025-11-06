// ----- element refs -----
const titleEl   = document.getElementById("title");
const textEl    = document.getElementById("text");
const metaEl    = document.getElementById("meta");
const verdictEl = document.getElementById("verdict");
const errorEl   = document.getElementById("error");
const openEl    = document.getElementById("openLink");

const subSelSettings = document.getElementById("subredditSettings");
const sortSel   = document.getElementById("sort");
const rangeSel  = document.getElementById("topRange");
const topRangeRow = document.getElementById("topRangeRow");
const nsfwChk   = document.getElementById("nsfw");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

const randomBtn = document.getElementById("randomBtn"); // may not exist
const voteBlock = document.getElementById("voteBlock");
const voteYTA   = document.getElementById("voteYTA");
const voteNTA   = document.getElementById("voteNTA");
const voteESH   = document.getElementById("voteESH");
const tallyEl   = document.getElementById("tally");

// Filters + FAB
const fabBtn       = document.getElementById("fabRandomBtn");

// New UI - Note button removed
const btnFavorite  = null; // Removed - now using tabSave
const btnNote      = null; // Removed
const noteModal    = document.getElementById("noteModal");
const noteText     = document.getElementById("noteText");
const noteSave     = document.getElementById("noteSave");
const noteCancel   = document.getElementById("noteCancel");

// Tabs and panels
const tabSave = document.getElementById("tabSave");
const tabFav  = document.getElementById("tabFav");
const tabShare = document.getElementById("tabShare");
const tabSet  = document.getElementById("tabSet");
const panelFav = document.getElementById("panelFavorites");
const panelShare = document.getElementById("panelShare");
const panelSet = document.getElementById("panelSettings");
const favoritesList = document.getElementById("favoritesList");
const historyList   = document.getElementById("historyList");

// Settings controls
const setDefaultNSFW = document.getElementById("setDefaultNSFW");
const setTextSize    = document.getElementById("setTextSize");
const setDefaultSub  = document.getElementById("setDefaultSub");
const textSizeVal    = document.getElementById("textSizeVal");
const btnClearData   = document.getElementById("btnClearData");

let currentPost = null;

// same-origin API
const API = {
  random: (qs) => `/api/random?${qs}`,
  post:   (pid) => `/api/post?id=${encodeURIComponent(pid)}`,
  results:(pid) => `/api/results?post_id=${encodeURIComponent(pid)}`
};

// subs where we disable votes/flair
const NO_VOTE_NO_FLAIR_SUBS = new Set(["twohottakes", "AmIOverreacting"]);

// ---------- helpers ----------
const STORAGE_KEYS = {
  favorites: "aita.favorites.v1",
  diceClickCount: "aita.diceClickCount.v1",
  history:   "aita.history.v1",
  notes:     "aita.notes.v1",
  settings:  "aita.settings.v1"
};

function loadJSON(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; }
}
function saveJSON(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch{}
}

function getSettings(){
  return loadJSON(STORAGE_KEYS.settings, { defaultNSFW:false, textSize:16, defaultSub:"AmItheAsshole" });
}
function applySettings(){
  const s = getSettings();
  if (typeof s.textSize === "number") {
    document.documentElement.style.setProperty('--body-text-size', `${s.textSize}px`);
    if (textSizeVal) textSizeVal.textContent = `${s.textSize}px`;
    if (setTextSize) setTextSize.value = String(s.textSize);
  }
  if (setDefaultNSFW) setDefaultNSFW.checked = !!s.defaultNSFW;
  if (setDefaultSub && Array.from(setDefaultSub.options).some(o=>o.value===s.defaultSub)) setDefaultSub.value = s.defaultSub;
  if (nsfwChk) nsfwChk.checked = !!s.defaultNSFW;
  if (subSelSettings && s.defaultSub) subSelSettings.value = s.defaultSub;
}

function getFavorites(){ return loadJSON(STORAGE_KEYS.favorites, []); }
function setFavorites(list){ saveJSON(STORAGE_KEYS.favorites, list); }
function getHistory(){ return loadJSON(STORAGE_KEYS.history, []); }
function setHistory(list){ saveJSON(STORAGE_KEYS.history, list.slice(-200)); }
function getNotes(){ return loadJSON(STORAGE_KEYS.notes, {}); }
function setNotes(map){ saveJSON(STORAGE_KEYS.notes, map); }

function isFavorite(id){ return getFavorites().some(p=>p.id===id); }
function toggleFavorite(post){
  if (!post?.id) return;
  const favs = getFavorites();
  const idx = favs.findIndex(p=>p.id===post.id);
  if (idx>=0) favs.splice(idx,1); else favs.push({ id:post.id, title:post.title||"(no title)" });
  setFavorites(favs);
  renderFavorites();
  updateFavoriteButton();
}

function pushHistory(post){
  if (!post?.id) return;
  const hist = getHistory().filter(p=>p.id!==post.id);
  hist.push({ id:post.id, title:post.title||"(no title)" });
  setHistory(hist);
  renderHistory();
}

function updateFavoriteButton(){
  if (!tabSave || !currentPost?.id) return;
  const fav = isFavorite(currentPost.id);
  // Update tab icon to show saved state
  const icon = tabSave.querySelector('.tab-icon');
  if (icon) icon.textContent = fav ? '★' : '☆';
}

function renderList(listEl, items){
  if (!listEl) return;
  listEl.innerHTML = "";
  if (!items.length){ listEl.innerHTML = '<li>No items yet</li>'; return; }
  for (const item of items.slice().reverse()){
    const li = document.createElement('li');
    
    // Make the title clickable
    const title = document.createElement('div');
    title.textContent = item.title;
    title.style.flex = '1 1 auto';
    title.style.cursor = 'pointer';
    title.style.padding = '8px';
    title.style.borderRadius = '4px';
    title.addEventListener('click', async () => {
      // Hide all panels first to show main content immediately
      if (tabSave) {
        setActiveTab(tabSave);
        // Ensure all panels are hidden
        if (panelFav) panelFav.setAttribute('aria-hidden', 'true');
        if (panelShare) panelShare.setAttribute('aria-hidden', 'true');
        if (panelSet) panelSet.setAttribute('aria-hidden', 'true');
      }
      // Scroll to top to show the story
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Load the story
      await fetchById(item.id);
    });
    
    const btnOpen = document.createElement('button');
    btnOpen.type = 'button';
    btnOpen.textContent = 'Open';
    btnOpen.className = 'list-button-open'; // Add class for styling if needed
    btnOpen.addEventListener('click', async function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Open button clicked for story:', item.id, item.title);
      
      // Hide all panels first
      if (panelFav) panelFav.setAttribute('aria-hidden', 'true');
      if (panelShare) panelShare.setAttribute('aria-hidden', 'true');
      if (panelSet) panelSet.setAttribute('aria-hidden', 'true');
      
      // Switch to Save tab (main view)
      if (tabSave) {
        setActiveTab(tabSave);
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Load the story
      if (!item.id) {
        console.error('No ID found for item:', item);
        alert('Error: Story ID not found');
        return;
      }
      
      console.log('Calling fetchById with:', item.id);
      try {
        await fetchById(item.id);
        console.log('fetchById completed successfully');
      } catch (error) {
        console.error('Error calling fetchById:', error);
        alert('Error loading story. Please try again.');
      }
    });
    
    li.appendChild(title);
    li.appendChild(btnOpen);
    if (listEl === favoritesList){
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Remove';
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent title click
        setFavorites(getFavorites().filter(p=>p.id!==item.id)); 
        renderFavorites(); 
        updateFavoriteButton();
      });
      li.appendChild(btnDel);
    }
    listEl.appendChild(li);
  }
}
function renderFavorites(){ renderList(favoritesList, getFavorites()); }
function renderHistory(){ renderList(historyList, getHistory()); }
function setLoading(isLoading) {
  if (randomBtn) randomBtn.disabled = isLoading;
  if (errorEl) { errorEl.textContent = ""; errorEl.style.display = "none"; }
}
function setError(msg) {
  if (!errorEl) return;
  errorEl.textContent = String(msg || "Unknown error");
  errorEl.style.display = "block";
}

function qs() {
  const p = new URLSearchParams();
  if (subSelSettings?.value) p.set("sub", subSelSettings.value);
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

// ---------- verdict helpers ----------
function normalizeVerdict(raw) {
  if (!raw) return "";
  const t = String(raw).toLowerCase().trim();

  if (/\bnta\b|not the/.test(t)) return "NTA";
  if (/\byta\b|asshole|a-hole/.test(t)) return "YTA";
  if (/\besh\b|everyone/.test(t)) return "ESH";
  if (/\bnah\b|no assholes here/.test(t)) return "NAH";
  if (/\binfo\b|more info/.test(t)) return "INFO";
  return "";
}

function showVerdict(text) {
  if (!verdictEl) return;

  verdictEl.style.display = "block"; // force visible
  verdictEl.className = "verdict";   // reset classes

  if (!text) {
    verdictEl.textContent = "No verdict yet";
    verdictEl.classList.add("v-none");
    return;
  }

  const v = normalizeVerdict(text);

  if (v === "NTA") {
    verdictEl.textContent = "Not the A-hole";
    verdictEl.classList.add("v-nta");
  } else if (v === "YTA") {
    verdictEl.textContent = "They’re the A-hole";
    verdictEl.classList.add("v-yta");
  } else if (v === "ESH") {
    verdictEl.textContent = "Everyone Sucks Here";
    verdictEl.classList.add("v-esh");
  } else if (v === "NAH") {
    verdictEl.textContent = "No A-holes Here";
    verdictEl.classList.add("v-none");
  } else if (v === "INFO") {
    verdictEl.textContent = "More Info Needed";
    verdictEl.classList.add("v-none");
  } else {
    verdictEl.textContent = "No verdict yet";
    verdictEl.classList.add("v-none");
  }
}

function hideVerdict() {
  if (!verdictEl) return;
  verdictEl.className = "verdict";
  verdictEl.textContent = "";
  verdictEl.style.display = "none";
}

// Try to pull the official verdict (results endpoint first, then flair on the post)
async function getOfficialVerdict(post) {
  if (!post?.id) return "";

  try {
    const res = await fetch(API.results(post.id), { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data) {
      const v = data.verdict
        || data.result?.verdict
        || data.results?.verdict
        || data.results?.top_flair
        || data.top_flair
        || data.verdict_label
        || "";
      const norm = normalizeVerdict(v);
      if (norm) return norm;
    }
  } catch { /* ignore */ }

  const flair =
    post.verdict ||
    post.flair ||
    post.link_flair_text ||
    post.author_flair_text ||
    post.flair_text ||
    "";
  return normalizeVerdict(flair);
}

function toggleVotesVisibility(post) {
  if (!voteBlock) return;
  const hide = shouldHideVotesAndFlair(post);
  voteBlock.style.display = hide ? "none" : "flex";
  if (tallyEl) tallyEl.textContent = "";
}

function updateView(post, yourVote=null) {
  currentPost = post;
  if (titleEl) titleEl.textContent = post.title || "(no title)";
  if (textEl)  textEl.textContent  = post.text || "";
  if (openEl)  openEl.href = post.permalink || "#";

  toggleVotesVisibility(post);
  hideVerdict(); // never auto-show

  if (post?.id) {
    const url = new URL(window.location.href);
    url.searchParams.set("id", post.id);
    if (subSelSettings?.value) url.searchParams.set("sub", subSelSettings.value);
    history.replaceState({}, "", url.toString());
  }
  pushHistory(post);
  updateFavoriteButton();
}

// --------- Fetchers ----------
async function fetchRandom() {
  setLoading(true);
  try {
    const url = API.random(qs());
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) { setError(`Random failed: HTTP ${res.status}`); return; }
    const { post } = await res.json();
    if (!post) { setError("No post received from server."); return; }
    updateView(post, null);
  } catch (e) {
    setError(e?.message || String(e));
  } finally {
    setLoading(false);
  }
}

async function fetchById(pid) {
  console.log('fetchById called with pid:', pid);
  if (!pid) {
    console.log('No pid provided, calling fetchRandom');
    return fetchRandom();
  }
  setLoading(true);
  try {
    const url = API.post(pid);
    console.log('Fetching from URL:', url);
    const res = await fetch(url, { cache: "no-store" });
    console.log('Response status:', res.status, res.ok);
    const data = await res.json().catch(() => ({}));
    console.log('Response data:', data);
    if (!res.ok || !data.ok) {
      console.log('Response not ok, calling fetchRandom');
      return fetchRandom();
    }
    const { post, your_vote } = data;
    console.log('Updating view with post:', post?.id, post?.title);
    updateView(post, your_vote || null);
  } catch (error) {
    console.error('Error in fetchById:', error);
    fetchRandom();
  } finally {
    setLoading(false);
  }
}

// --------- Voting (show OFFICIAL verdict on click) ----------
async function vote(which) {
  if (!currentPost?.id) return;
  if (shouldHideVotesAndFlair(currentPost)) return;

  // fire-and-forget the user's vote; UI shows official verdict only
  try {
    fetch("/api/vote", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ post_id: currentPost.id, vote: which })
    }).catch(()=>{});
  } catch {}

  try {
    const official = await getOfficialVerdict(currentPost);
    if (official) showVerdict(official);
    else showVerdict("No verdict yet");
  } catch {
    showVerdict("No verdict yet");
  }
  
  // Scroll to verdict after showing it
  if (verdictEl) {
    setTimeout(() => {
      verdictEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Small delay to ensure verdict is rendered
  }
}

// --------- TOP range visibility + wiring ----------
function toggleTopRangeVisibility() {
  if (!topRangeRow || !sortSel) return;
  const show = sortSel.value === "top";
  topRangeRow.style.display = show ? "flex" : "none";
  if (!show) {
    const url = new URL(window.location.href);
    url.searchParams.delete("t");
    history.replaceState({}, "", url.toString());
  }
}

// --------- Ad Management ----------
const ADS_EVERY_N_CLICKS = 5;

function getDiceClickCount() {
  return parseInt(loadJSON(STORAGE_KEYS.diceClickCount, 0), 10) || 0;
}

function incrementDiceClickCount() {
  const count = getDiceClickCount() + 1;
  saveJSON(STORAGE_KEYS.diceClickCount, count);
  return count;
}

function resetDiceClickCount() {
  saveJSON(STORAGE_KEYS.diceClickCount, 0);
}

// AdMob configuration
const ADMOB_CONFIG = {
  appId: 'ca-app-pub-1896036129809749', // Your App ID
  interstitialId: 'ca-app-pub-1896036129809749/8570376345', // Your Interstitial Ad Unit ID
  isTesting: false // Set to false for production
};

let adMobInitialized = false;
let interstitialReady = false;

// Initialize AdMob (call once on app start)
async function initializeAdMob() {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) {
    return; // Web version uses AdSense
  }
  
  try {
    const { AdMob } = window.Capacitor.Plugins;
    if (!AdMob) {
      console.log('AdMob plugin not available');
      return;
    }
    
    // Initialize AdMob
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [],
      initializeForTesting: ADMOB_CONFIG.isTesting,
    });
    
    adMobInitialized = true;
    console.log('AdMob initialized');
    
    // Prepare interstitial ad
    await prepareInterstitial();
  } catch (error) {
    console.error('AdMob initialization error:', error);
  }
}

// Prepare interstitial ad
async function prepareInterstitial() {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform() || !adMobInitialized) {
    return;
  }
  
  try {
    const { AdMob } = window.Capacitor.Plugins;
    if (!AdMob) return;
    
    await AdMob.prepareInterstitial({
      adId: ADMOB_CONFIG.interstitialId,
      isTesting: ADMOB_CONFIG.isTesting,
    });
    
    interstitialReady = true;
    console.log('Interstitial ad prepared');
  } catch (error) {
    console.error('Error preparing interstitial:', error);
  }
}

async function showAdIfNeeded() {
  const count = incrementDiceClickCount();
  
  if (count >= ADS_EVERY_N_CLICKS) {
    resetDiceClickCount();
    
    // Check if we're in a Capacitor app (iOS/Android)
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        const { AdMob } = window.Capacitor.Plugins;
        if (!AdMob) {
          console.log('AdMob plugin not available');
          return;
        }
        
        // Initialize if not already done
        if (!adMobInitialized) {
          await initializeAdMob();
        }
        
        // Prepare ad if not ready
        if (!interstitialReady) {
          await prepareInterstitial();
        }
        
        // Show interstitial ad
        if (interstitialReady) {
          await AdMob.showInterstitial();
          // Prepare next ad after showing
          interstitialReady = false;
          setTimeout(() => prepareInterstitial(), 1000);
        }
      } catch (error) {
        console.error('AdMob error:', error);
      }
    } else {
      // Web version - AdSense is already loaded in the HTML
      // Ads will show automatically via AdSense auto ads
      console.log('Web version: AdSense auto ads are active');
    }
  }
}

// --------- Wiring ----------
// FAB + Random - also switch to Save tab (but don't activate any panel)
if (fabBtn) fabBtn.addEventListener("click", async () => {
  if (tabSave) {
    // Remove active from all tabs
    for (const btn of [tabSave,tabFav,tabShare,tabSet]) if (btn) btn.classList.remove('active');
    // Set Save tab as active (default view)
    tabSave.classList.add('active');
    // Hide all panels
    if (panelFav) panelFav.setAttribute('aria-hidden', 'true');
    if (panelShare) panelShare.setAttribute('aria-hidden', 'true');
    if (panelSet) panelSet.setAttribute('aria-hidden', 'true');
  }
  
  // Show ad if needed (after 5 clicks)
  await showAdIfNeeded();
  
  fetchRandom();
});

if (randomBtn) randomBtn.addEventListener("click", async () => {
  await showAdIfNeeded();
  fetchRandom();
});

// search
if (searchBtn) searchBtn.addEventListener("click", fetchRandom);
if (searchBox) searchBox.addEventListener("keydown", e => { if (e.key === "Enter") fetchRandom(); });

// subreddit - use Settings selector only
function syncSubredditSelectors() {
  if (!subSelSettings) return;
  const url = new URL(window.location.href);
  url.searchParams.set("sub", subSelSettings.value);
  url.searchParams.delete("id");
  history.replaceState({}, "", url.toString());
  fetchRandom();
}

// Settings subreddit selector
if (subSelSettings) {
  subSelSettings.addEventListener("change", syncSubredditSelectors);
}

// sort + top range
if (sortSel) {
  sortSel.addEventListener("change", () => {
    toggleTopRangeVisibility();
    fetchRandom();
  });
}
if (rangeSel) rangeSel.addEventListener("change", fetchRandom);

// vote buttons
if (voteYTA) voteYTA.addEventListener("click", () => vote("YTA"));
if (voteNTA) voteNTA.addEventListener("click", () => vote("NTA"));
if (voteESH) voteESH.addEventListener("click", () => vote("ESH"));

// favorite - removed note functionality
// Note button removed, only Save tab remains

// Tabs behavior
function setActiveTab(which){
  for (const btn of [tabSave,tabFav,tabShare,tabSet]) if (btn) btn.classList.remove('active');
  if (which) which.classList.add('active');
  if (panelFav) panelFav.setAttribute('aria-hidden', String(which!==tabFav));
  // Don't show share panel - share tab directly triggers native share
  if (panelShare) panelShare.setAttribute('aria-hidden', 'true');
  if (panelSet) panelSet.setAttribute('aria-hidden', String(which!==tabSet));
  
  // Sync desktop nav (if available)
  if (typeof setActiveDesktopTab === 'function') {
    if (which === tabSave && desktopTabSave) setActiveDesktopTab(desktopTabSave);
    else if (which === tabFav && desktopTabFav) setActiveDesktopTab(desktopTabFav);
    else if (which === tabShare && desktopTabShare) setActiveDesktopTab(desktopTabShare);
    else if (which === tabSet && desktopTabSet) setActiveDesktopTab(desktopTabSet);
  }
}
if (tabSave) tabSave.addEventListener('click', ()=> {
  if (currentPost) toggleFavorite(currentPost);
  renderFavorites();
  setActiveTab(tabFav); // Switch to Favorites panel after saving
});
if (tabFav)  tabFav.addEventListener('click', ()=>{ renderFavorites(); setActiveTab(tabFav); });
if (tabShare) tabShare.addEventListener('click', async () => {
  // Directly open native share sheet, don't show panel
  if (!navigator.share) {
    alert("Sharing is not supported on this device");
    return;
  }
  const url   = currentPost?.permalink ? `https://reddit.com${currentPost.permalink}` : window.location.href;
  const title = currentPost?.title || "Random AITA story";
  const text  = "Check out this AITA story";
  try { 
    await navigator.share({ title, text, url }); 
  } catch (e) {
    // User cancelled or error occurred
    if (e.name !== 'AbortError') {
      console.error('Error sharing:', e);
    }
  }
});
if (tabSet)  tabSet.addEventListener('click', ()=>{ setActiveTab(tabSet); });

// Settings wiring
function saveSettings(partial){
  const s = { ...getSettings(), ...partial };
  saveJSON(STORAGE_KEYS.settings, s);
  applySettings();
}
if (setDefaultNSFW) setDefaultNSFW.addEventListener('change', ()=> saveSettings({ defaultNSFW: setDefaultNSFW.checked }));
if (setTextSize) setTextSize.addEventListener('input', ()=> saveSettings({ textSize: Number(setTextSize.value||16) }));
if (setDefaultSub) setDefaultSub.addEventListener('change', ()=> saveSettings({ defaultSub: setDefaultSub.value }));
if (btnClearData) btnClearData.addEventListener('click', ()=>{ localStorage.clear(); location.reload(); });

// Swipe to random (left/right) - only trigger on clear horizontal swipes, not scrolls
let touchStartX = null;
let touchStartY = null;
let touchMoved = false;
document.addEventListener('touchstart', e=>{ 
  touchStartX = e.changedTouches?.[0]?.clientX ?? null;
  touchStartY = e.changedTouches?.[0]?.clientY ?? null;
  touchMoved = false;
}, {passive:true});
document.addEventListener('touchmove', e=>{
  if (touchStartX == null || touchStartY == null) return;
  const dx = e.changedTouches?.[0]?.clientX - touchStartX;
  const dy = e.changedTouches?.[0]?.clientY - touchStartY;
  // Mark as moved if there's any significant movement
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    touchMoved = true;
  }
}, {passive:true});
document.addEventListener('touchend', e=>{
  if (touchStartX==null || touchStartY==null) return;
  if (!touchMoved) {
    touchStartX = null;
    touchStartY = null;
    return;
  }
  const dx = e.changedTouches?.[0]?.clientX - touchStartX;
  const dy = e.changedTouches?.[0]?.clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  // Only trigger if:
  // 1. Horizontal movement is significant (>= 150px)
  // 2. Horizontal movement is at least 3x greater than vertical movement
  // 3. Vertical movement is relatively small (< 80px) to avoid scroll triggers
  if (absDx >= 150 && absDx >= absDy * 3 && absDy < 80) {
    fetchRandom();
  }
  touchStartX = null;
  touchStartY = null;
  touchMoved = false;
}, {passive:true});

// Share button in panel (kept for backward compatibility, but panel is hidden)
// The tabShare button now directly triggers native share
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    if (!navigator.share) {
      alert("Sharing is not supported on this device");
      return;
    }
    const url   = currentPost?.permalink ? `https://reddit.com${currentPost.permalink}` : window.location.href;
    const title = currentPost?.title || "Random AITA story";
    const text  = "Check out this AITA story";
    try { 
      await navigator.share({ title, text, url }); 
    } catch (e) {
      // User cancelled or error occurred
      if (e.name !== 'AbortError') {
        console.error('Error sharing:', e);
      }
    }
  });
}

// Legacy share toggle removed - now using Share panel

// Show/hide desktop nav based on screen size
function updateDesktopNav() {
  if (window.innerWidth > 600) {
    if (desktopNav) desktopNav.style.display = 'flex';
  } else {
    if (desktopNav) desktopNav.style.display = 'none';
  }
}

// Wire up desktop navigation (after DOM is ready)
function setupDesktopNav() {
  if (desktopTabSave) {
    desktopTabSave.addEventListener('click', () => {
      if (tabSave) tabSave.click();
      setActiveDesktopTab(desktopTabSave);
    });
  }

  if (desktopTabFav) {
    desktopTabFav.addEventListener('click', () => {
      if (tabFav) tabFav.click();
      setActiveDesktopTab(desktopTabFav);
    });
  }

  if (desktopRandomBtn) {
    desktopRandomBtn.addEventListener('click', async () => {
      await showAdIfNeeded();
      fetchRandom();
    });
  }

  if (desktopTabShare) {
    desktopTabShare.addEventListener('click', () => {
      if (tabShare) tabShare.click();
      setActiveDesktopTab(desktopTabShare);
    });
  }

  if (desktopTabSet) {
    desktopTabSet.addEventListener('click', () => {
      if (tabSet) tabSet.click();
      setActiveDesktopTab(desktopTabSet);
    });
  }

  // Update on resize
  window.addEventListener('resize', updateDesktopNav);
}

window.addEventListener("DOMContentLoaded", async () => {
  // Initialize AdMob on app start (for iOS/Android)
  await initializeAdMob();
  
  // Setup desktop navigation
  setupDesktopNav();
  updateDesktopNav();
  
  const urlParams = new URLSearchParams(window.location.search);

  const sub = urlParams.get("sub");
  if (sub && subSelSettings && Array.from(subSelSettings.options).some(o => o.value.toLowerCase() === sub.toLowerCase())) {
    const val = Array.from(subSelSettings.options).find(o => o.value.toLowerCase() === sub.toLowerCase()).value;
    subSelSettings.value = val;
  }

  toggleTopRangeVisibility();

  // Apply persisted settings
  applySettings();

  const pid = urlParams.get("id");
  setTimeout(() => {
    if (pid) {
      fetchById(pid);
    } else {
      fetchRandom().catch(() => setTimeout(fetchRandom, 1200));
    }
  }, 300);
});














