(function () {
  "use strict";

  const curriculum = window.YUE_CURRICULUM || [];
  const allPhrases = curriculum.flatMap((stage, dayIndex) => stage.phrases.map((phrase, phraseIndex) => ({ ...phrase, dayIndex, phraseIndex })));
  const STORAGE_KEY = "yue-life-lab-progress-v2";
  const OLD_STORAGE_KEY = "yue-life-lab-progress-v1";
  const SETTINGS_KEY = "yue-life-lab-settings-v2";

  const scheduler = window.FSRS ? FSRS.fsrs({
    request_retention: 0.9,
    maximum_interval: 365,
    enable_fuzz: true,
    enable_short_term: true,
    learning_steps: ["1m", "10m"],
    relearning_steps: ["10m"]
  }) : null;

  const els = {
    views: {
      splash: document.getElementById("splash-view"),
      home: document.getElementById("home-view"),
      route: document.getElementById("route-view"),
      favorites: document.getElementById("favorites-view"),
      progress: document.getElementById("progress-view"),
      lesson: document.getElementById("lesson-view"),
      session: document.getElementById("session-view"),
      settings: document.getElementById("settings-view")
    },
    splashEnter: document.getElementById("splash-enter"),
    appDock: document.getElementById("app-dock"),
    routeList: document.getElementById("route-list"),
    favoritesList: document.getElementById("favorites-list"),
    progressLearned: document.getElementById("progress-learned"),
    progressScore: document.getElementById("progress-score"),
    progressStage: document.getElementById("progress-stage"),
    progressReview: document.getElementById("progress-review"),
    progressStreakDetail: document.getElementById("progress-streak-detail"),
    weekGrid: document.getElementById("week-grid"),
    lessonProgress: document.getElementById("lesson-progress"),
    lessonCount: document.getElementById("lesson-count"),
    phrase: document.getElementById("phrase"),
    meaning: document.getElementById("meaning"),
    syllables: document.getElementById("syllables"),
    lessonPlay: document.getElementById("lesson-play"),
    lessonPause: document.getElementById("lesson-pause"),
    lessonSpeedButtons: [...document.querySelectorAll("[data-lesson-speed]")],
    favoriteToggle: document.getElementById("favorite-toggle"),
    lessonPrev: document.getElementById("lesson-prev"),
    lessonForward: document.getElementById("lesson-forward"),
    lessonNext: document.getElementById("lesson-next"),
    sessionTitle: document.getElementById("session-title"),
    sessionCount: document.getElementById("session-count"),
    questionCard: document.getElementById("question-card"),
    questionKind: document.getElementById("question-kind"),
    questionAudio: document.getElementById("question-audio"),
    questionText: document.getElementById("question-text"),
    sessionPlay: document.getElementById("session-play"),
    sessionPause: document.getElementById("session-pause"),
    choiceList: document.getElementById("choice-list"),
    feedback: document.getElementById("feedback-mark"),
    feedbackIcon: document.getElementById("feedback-icon"),
    jyutpingToggle: document.getElementById("jyutping-toggle"),
    soundToggle: document.getElementById("sound-toggle"),
    toast: document.getElementById("toast")
  };

  const defaults = {
    learned: {}, listen: {}, passed: {}, bestScores: {}, cards: {}, wrong: {},
    favorites: {}, activity: {}, unlockedDay: 0, lastDay: 0, lastPhrase: 0
  };

  function safeParse(value, fallback) {
    if (!value) return structuredClone(fallback);
    try { return { ...structuredClone(fallback), ...JSON.parse(value) }; }
    catch (_) { return structuredClone(fallback); }
  }

  function migrateProgress() {
    const current = safeParse(localStorage.getItem(STORAGE_KEY), defaults);
    if (localStorage.getItem(STORAGE_KEY)) return current;
    const old = safeParse(localStorage.getItem(OLD_STORAGE_KEY), {});
    if (!Object.keys(old).length) return current;
    current.cards = old.cards || {};
    current.wrong = old.wrong || {};
    current.learned = { ...(old.seen || {}), ...(old.completed || {}) };
    current.lastDay = old.lastDay || 0;
    current.lastPhrase = old.lastPhrase || 0;
    return current;
  }

  const progress = migrateProgress();
  if (!progress.favorites || typeof progress.favorites !== "object") progress.favorites = {};
  progress.unlockedDay = clamp(Number(progress.unlockedDay) || 0, 0, Math.max(0, curriculum.length - 1));
  const savedSettings = safeParse(localStorage.getItem(SETTINGS_KEY), { showJyutping: true, soundEffects: true, lessonSpeed: 1 });
  const savedLessonSpeed = [1, 5, 10].includes(Number(savedSettings.lessonSpeed)) ? Number(savedSettings.lessonSpeed) : 1;

  const state = {
    view: "splash",
    dayIndex: clamp(progress.lastDay || 0, 0, progress.unlockedDay),
    phraseIndex: 0,
    showJyutping: savedSettings.showJyutping !== false,
    soundEffects: savedSettings.soundEffects !== false,
    lessonSpeed: savedLessonSpeed,
    segmentedDone: false,
    connectedDone: false,
    nextAudioMode: "segmented",
    audioRun: 0,
    audioOwner: null,
    audioPaused: false,
    audioBusy: false,
    activeSources: [],
    audioSchedule: [],
    audioMonitor: 0,
    session: null,
    feedbackTimer: 0
  };

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  const audioBufferCache = new Map();
  const fallbackAudio = new Audio();
  fallbackAudio.preload = "auto";
  let splashTimer = 0;

  const audioControls = {
    lesson: { play: els.lessonPlay, pause: els.lessonPause },
    session: { play: els.sessionPlay, pause: els.sessionPause }
  };

  els.jyutpingToggle.checked = state.showJyutping;
  els.soundToggle.checked = state.soundEffects;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function persist() {
    progress.lastDay = state.dayIndex;
    progress.lastPhrase = state.phraseIndex;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      showJyutping: state.showJyutping,
      soundEffects: state.soundEffects,
      lessonSpeed: state.lessonSpeed
    }));
  }

  function updateLessonSpeedButtons() {
    els.lessonSpeedButtons.forEach((button) => {
      const active = Number(button.dataset.lessonSpeed) === state.lessonSpeed;
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function switchView(name) {
    Object.entries(els.views).forEach(([key, node]) => node.classList.toggle("is-hidden", key !== name));
    els.appDock.classList.toggle("is-hidden", name === "splash");
    const dockState = { home: "home", favorites: "favorites", progress: "progress", settings: "settings" }[name] || "";
    els.appDock.querySelectorAll(".dock-button").forEach((button) => {
      const active = button.dataset.homeAction === dockState;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    state.view = name;
    hideFeedback();
  }

  function currentStage() { return curriculum[state.dayIndex]; }
  function currentBasePhrase() { return currentStage().phrases[state.phraseIndex]; }
  function displayedPhrase() { return currentBasePhrase(); }
  function learnedCount(index) { return curriculum[index].phrases.filter((phrase) => progress.learned[phrase.id]).length; }
  function isStageLearned(index) { return learnedCount(index) === curriculum[index].phrases.length; }
  function tokensOf(phrase) { return (phrase?.jyutping || "").match(/[a-z]+[1-6]/g) || []; }
  function toneOf(token) { return Number(token.match(/[1-6]$/)?.[0] || 6); }
  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function recordActivity() {
    const key = dateKey();
    progress.activity[key] = (progress.activity[key] || 0) + 1;
  }
  function activityStreak() {
    let streak = 0;
    const cursor = new Date();
    while (progress.activity[dateKey(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  function reviewCount() {
    const now = Date.now();
    return accessiblePhrases().filter((phrase) => {
      const due = progress.cards[phrase.id] && new Date(progress.cards[phrase.id].due).getTime() <= now;
      return due || (progress.wrong[phrase.id] || 0) > 0;
    }).length;
  }

  function showSplash() {
    stopAudio();
    switchView("splash");
    document.title = "粤语";
    window.clearTimeout(splashTimer);
    splashTimer = window.setTimeout(showHome, 1450);
  }

  function showHome() {
    window.clearTimeout(splashTimer);
    stopAudio();
    switchView("home");
    state.dayIndex = clamp(progress.lastDay || 0, 0, progress.unlockedDay);
    document.title = "粤语";
  }

  function showRoute() {
    stopAudio();
    switchView("route");
    renderRoute();
  }

  function renderRoute() {
    els.routeList.innerHTML = "";
    curriculum.forEach((stage, index) => {
      const locked = index > progress.unlockedDay;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-item";
      if (index === state.dayIndex && !locked) button.classList.add("current");
      button.disabled = locked;
      button.setAttribute("aria-label", `${index + 1} ${stage.place}${locked ? "，未解锁" : ""}`);
      button.innerHTML = `<span class="stage-number">${String(index + 1).padStart(2, "0")}</span><strong>${stage.place}</strong>`;
      button.addEventListener("click", () => openStage(index));
      els.routeList.appendChild(button);
    });
  }

  function showFavorites() {
    stopAudio();
    switchView("favorites");
    renderFavorites();
  }

  function renderFavorites() {
    els.favoritesList.innerHTML = "";
    const favorites = allPhrases.filter((phrase) => progress.favorites[phrase.id]);
    if (!favorites.length) {
      const empty = document.createElement("p");
      empty.className = "favorites-empty";
      empty.textContent = "暂无收藏";
      els.favoritesList.appendChild(empty);
      return;
    }
    favorites.forEach((phrase) => {
      const item = document.createElement("article");
      item.className = "favorite-item";
      const word = document.createElement("button");
      word.type = "button";
      word.className = "favorite-word";
      word.innerHTML = `<strong>${phrase.hanzi}</strong>${state.showJyutping ? `<span>${phrase.jyutping}</span>` : ""}<small>${phrase.meaning}</small>`;
      word.addEventListener("click", () => {
        state.dayIndex = phrase.dayIndex;
        state.phraseIndex = phrase.phraseIndex;
        persist();
        startLesson();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "favorite-remove";
      remove.setAttribute("aria-label", `取消收藏 ${phrase.hanzi}`);
      remove.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3 10.7 19.1C5.4 14.3 2 11.2 2 7.4 2 4.3 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.3 22 7.4c0 3.8-3.4 6.9-8.7 11.7z"/></svg>`;
      remove.addEventListener("click", () => {
        delete progress.favorites[phrase.id];
        persist();
        renderFavorites();
      });
      item.append(word, remove);
      els.favoritesList.appendChild(item);
    });
  }

  function showProgress() {
    stopAudio();
    switchView("progress");
    const totalLearned = Object.keys(progress.learned).filter((id) => progress.learned[id]).length;
    const bestScore = Math.max(0, ...Object.values(progress.bestScores).map((value) => Number(value) || 0));
    const streak = activityStreak();
    els.progressLearned.textContent = String(totalLearned);
    els.progressScore.textContent = String(bestScore);
    els.progressStage.textContent = `${progress.unlockedDay + 1}/${curriculum.length}`;
    els.progressReview.textContent = String(reviewCount());
    els.progressStreakDetail.textContent = `${streak}天`;
    els.weekGrid.innerHTML = "";
    const weekday = ["日", "一", "二", "三", "四", "五", "六"];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const active = Boolean(progress.activity[dateKey(date)]);
      const item = document.createElement("div");
      item.className = `week-day${active ? " active" : ""}${offset === 0 ? " today" : ""}`;
      item.innerHTML = `<span>${weekday[date.getDay()]}</span><i>${active ? "✓" : ""}</i>`;
      els.weekGrid.appendChild(item);
    }
  }

  function openStage(index) {
    if (index > progress.unlockedDay) return;
    state.dayIndex = index;
    progress.lastDay = index;
    const first = curriculum[index].phrases.findIndex((phrase) => !progress.learned[phrase.id]);
    state.phraseIndex = first < 0 ? 0 : first;
    persist();
    startLesson();
  }

  function startLesson() {
    stopAudio();
    switchView("lesson");
    resetLessonPhrase();
    renderLesson();
  }

  function resetLessonPhrase() {
    state.segmentedDone = false;
    state.connectedDone = false;
    state.nextAudioMode = "segmented";
  }

  function renderLesson() {
    const phrase = displayedPhrase();
    const total = currentStage().phrases.length;
    els.lessonCount.textContent = `${state.phraseIndex + 1}/${total}`;
    els.lessonProgress.style.width = `${((state.phraseIndex + 1) / total) * 100}%`;
    els.phrase.textContent = phrase.hanzi;
    els.meaning.textContent = phrase.meaning;
    renderSyllables(phrase);
    renderFavoriteToggle(phrase);
    updateListenSteps();
    els.lessonPrev.disabled = state.phraseIndex === 0;
    els.lessonForward.disabled = state.phraseIndex === total - 1;
  }

  function renderSyllables(phrase) {
    els.syllables.innerHTML = "";
    els.syllables.classList.toggle("is-hidden", !state.showJyutping);
    tokensOf(phrase).forEach((token, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "syllable";
      button.textContent = token;
      button.dataset.index = String(index);
      button.style.setProperty("--tone-color", `var(--tone-${toneOf(token)})`);
      button.title = window.YUE_TONE_NAMES?.[toneOf(token)] || "";
      button.setAttribute("aria-label", `播放 ${token}`);
      button.addEventListener("click", () => playSingleToken(token, index));
      els.syllables.appendChild(button);
    });
  }

  function updateListenSteps() {
    els.lessonNext.disabled = !(state.segmentedDone && state.connectedDone);
  }

  function renderFavoriteToggle(phrase) {
    const active = Boolean(progress.favorites[phrase.id]);
    els.favoriteToggle.classList.toggle("active", active);
    els.favoriteToggle.setAttribute("aria-pressed", String(active));
    els.favoriteToggle.setAttribute("aria-label", active ? "取消收藏" : "收藏");
  }

  function toggleFavorite() {
    const phrase = currentBasePhrase();
    if (progress.favorites[phrase.id]) delete progress.favorites[phrase.id];
    else progress.favorites[phrase.id] = true;
    persist();
    renderFavoriteToggle(phrase);
  }

  function navigateLesson(delta) {
    const lastIndex = currentStage().phrases.length - 1;
    const nextIndex = Math.max(0, Math.min(lastIndex, state.phraseIndex + delta));
    if (nextIndex === state.phraseIndex) return;
    stopAudio();
    state.phraseIndex = nextIndex;
    resetLessonPhrase();
    persist();
    renderLesson();
  }

  function completeLessonPhrase() {
    if (!(state.segmentedDone && state.connectedDone)) return;
    const phrase = currentBasePhrase();
    progress.learned[phrase.id] = true;
    progress.listen[phrase.id] = { segmented: true, connected: true };
    recordActivity();
    schedulePhrase(phrase, true);
    if (state.phraseIndex < currentStage().phrases.length - 1) {
      state.phraseIndex += 1;
      resetLessonPhrase();
      persist();
      renderLesson();
      return;
    }
    persist();
    startTest(state.dayIndex);
  }

  async function ensureAudioContext() {
    if (!AudioContextClass) return null;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === "suspended") await audioContext.resume();
    return audioContext;
  }

  function base64ArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes.buffer;
  }

  async function audioBufferFor(token, context) {
    if (audioBufferCache.has(token)) return audioBufferCache.get(token);
    const encoded = window.YUE_AUDIO_DATA?.[token];
    if (!encoded) throw new Error(`missing-${token}`);
    const promise = context.decodeAudioData(base64ArrayBuffer(encoded));
    audioBufferCache.set(token, promise);
    try { return await promise; }
    catch (error) {
      audioBufferCache.delete(token);
      throw error;
    }
  }

  function stopAudio() {
    state.audioRun += 1;
    state.activeSources.forEach((source) => { try { source.stop(); } catch (_) {} });
    state.activeSources = [];
    state.audioSchedule = [];
    if (state.audioMonitor) cancelAnimationFrame(state.audioMonitor);
    state.audioMonitor = 0;
    fallbackAudio.pause();
    state.audioOwner = null;
    state.audioPaused = false;
    state.audioBusy = false;
    document.querySelectorAll(".syllable.active").forEach((node) => node.classList.remove("active"));
    Object.values(audioControls).forEach((controls) => {
      controls.play.classList.remove("is-playing");
      controls.pause.disabled = true;
    });
  }

  async function pauseAudio(owner) {
    if (state.audioOwner !== owner || !state.audioBusy || state.audioPaused) return;
    if (audioContext && state.activeSources.length) await audioContext.suspend();
    else fallbackAudio.pause();
    state.audioPaused = true;
    audioControls[owner].play.classList.remove("is-playing");
  }

  async function resumeAudio(owner) {
    if (state.audioOwner !== owner || !state.audioBusy || !state.audioPaused) return false;
    if (audioContext && state.activeSources.length) await audioContext.resume();
    else await fallbackAudio.play().catch(() => {});
    state.audioPaused = false;
    audioControls[owner].play.classList.add("is-playing");
    return true;
  }

  async function playSequence(phrase, mode, owner, onComplete) {
    if (!phrase) return;
    if (await resumeAudio(owner)) return;
    if (state.audioBusy) return;
    stopAudio();
    const runId = state.audioRun;
    const tokens = tokensOf(phrase);
    const controls = audioControls[owner];
    try {
      const context = await ensureAudioContext();
      if (!context || runId !== state.audioRun) return;
      const buffers = await Promise.all(tokens.map((token) => audioBufferFor(token, context)));
      if (runId !== state.audioRun) return;
      scheduleWebAudio(buffers, mode, owner, controls, runId, onComplete);
    } catch (error) {
      const token = String(error?.message || "").replace("missing-", "");
      if (token) showToast(token);
    }
  }

  function scheduleWebAudio(buffers, mode, owner, controls, runId, onComplete) {
    const speed = owner === "lesson" ? state.lessonSpeed : 1;
    const rate = (mode === "connected" ? 1.12 : .94) * speed;
    let cursor = audioContext.currentTime + .05;
    state.audioOwner = owner;
    state.audioBusy = true;
    state.audioPaused = false;
    controls.play.classList.add("is-playing");
    controls.pause.disabled = false;
    buffers.forEach((buffer, index) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      source.connect(audioContext.destination);
      const duration = buffer.duration / rate;
      source.start(cursor);
      state.activeSources.push(source);
      state.audioSchedule.push({ start: cursor, end: cursor + duration, index });
      if (index === buffers.length - 1) source.onended = () => {
        if (runId !== state.audioRun) return;
        finishAudio(owner, controls, onComplete);
      };
      cursor += mode === "connected" ? Math.max(.012, duration - (.035 / speed)) : duration + (.18 / speed);
    });
    monitorSyllable(owner, runId);
  }

  function monitorSyllable(owner, runId) {
    if (owner !== "lesson" || !audioContext) return;
    const tick = () => {
      if (runId !== state.audioRun || !state.audioBusy) return;
      const now = audioContext.currentTime;
      const active = state.audioSchedule.find((item) => now >= item.start && now < item.end)?.index;
      els.syllables.querySelectorAll(".syllable").forEach((node) => node.classList.toggle("active", Number(node.dataset.index) === active));
      state.audioMonitor = requestAnimationFrame(tick);
    };
    tick();
  }

  function finishAudio(owner, controls, onComplete) {
    controls.play.classList.remove("is-playing");
    controls.pause.disabled = true;
    state.activeSources = [];
    state.audioSchedule = [];
    state.audioOwner = null;
    state.audioPaused = false;
    state.audioBusy = false;
    if (state.audioMonitor) cancelAnimationFrame(state.audioMonitor);
    state.audioMonitor = 0;
    document.querySelectorAll(".syllable.active").forEach((node) => node.classList.remove("active"));
    if (typeof onComplete === "function") onComplete();
  }

  function playLessonAudio() {
    const mode = state.nextAudioMode;
    playSequence(displayedPhrase(), mode, "lesson", () => {
      if (mode === "segmented") {
        state.segmentedDone = true;
        state.nextAudioMode = "connected";
      } else {
        state.connectedDone = true;
        state.nextAudioMode = "segmented";
      }
      updateListenSteps();
    });
  }

  async function playSingleToken(token, index) {
    stopAudio();
    const runId = state.audioRun;
    try {
      const context = await ensureAudioContext();
      const buffer = await audioBufferFor(token, context);
      if (runId !== state.audioRun) return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = state.lessonSpeed;
      source.connect(context.destination);
      state.audioOwner = "lesson";
      state.audioBusy = true;
      state.activeSources = [source];
      audioControls.lesson.pause.disabled = false;
      const node = els.syllables.querySelector(`[data-index="${index}"]`);
      if (node) node.classList.add("active");
      source.onended = () => {
        if (runId !== state.audioRun) return;
        if (node) node.classList.remove("active");
        finishAudio("lesson", audioControls.lesson);
      };
      source.start();
    } catch (_) { showToast(token); }
  }

  async function playSfx(type) {
    if (!state.soundEffects) return;
    const context = await ensureAudioContext().catch(() => null);
    if (!context) return;
    const tone = (frequency, start, duration, volume, wave = "sine", endFrequency = frequency) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
    };
    const now = context.currentTime;
    if (type === "tap") tone(680, now, .045, .025, "sine", 460);
    if (type === "correct") {
      tone(660, now, .16, .075);
      tone(990, now + .07, .2, .06);
    }
    if (type === "wrong") {
      tone(210, now, .13, .055, "triangle", 170);
      tone(170, now + .11, .13, .04, "triangle", 135);
    }
    if (type === "unlock") {
      [523, 659, 784].forEach((frequency, index) => tone(frequency, now + index * .065, .32, .045));
    }
  }

  function accessiblePhrases() {
    return curriculum.slice(0, progress.unlockedDay + 1).flatMap((stage) => stage.phrases);
  }

  function questionFrom(phrase, type) {
    const answerField = type === "meaning-text" ? "hanzi" : "meaning";
    const answer = phrase[answerField];
    const distractors = shuffled(allPhrases.filter((item) => item.id !== phrase.id))
      .map((item) => item[answerField])
      .filter((value, index, values) => value !== answer && values.indexOf(value) === index)
      .slice(0, 3);
    return { phrase, type, answer, choices: shuffled([answer, ...distractors]) };
  }

  function buildTestItems(dayIndex) {
    const phrases = shuffled(curriculum[dayIndex].phrases);
    const types = shuffled(["listening", "text-meaning", "meaning-text", "listening", "text-meaning", "meaning-text"]);
    return phrases.slice(0, 6).map((phrase, index) => questionFrom(phrase, types[index]));
  }

  function startPractice() {
    stopAudio();
    state.session = { mode: "practice", index: 0, score: 0, locked: false, current: null, previousId: null };
    switchView("session");
    renderSessionQuestion();
  }

  function startTest(dayIndex) {
    if (dayIndex > progress.unlockedDay) return;
    stopAudio();
    state.dayIndex = dayIndex;
    state.session = { mode: "test", dayIndex, items: buildTestItems(dayIndex), index: 0, score: 0, locked: false, current: null };
    switchView("session");
    renderSessionQuestion();
  }

  function nextPracticeQuestion() {
    const pool = duePhrases();
    let phrase = pool[Math.floor(Math.random() * pool.length)] || currentStage().phrases[0];
    if (pool.length > 1 && phrase.id === state.session.previousId) phrase = pool[(pool.indexOf(phrase) + 1) % pool.length];
    state.session.previousId = phrase.id;
    const types = ["listening", "text-meaning", "meaning-text"];
    return questionFrom(phrase, types[Math.floor(Math.random() * types.length)]);
  }

  function renderSessionQuestion() {
    stopAudio();
    hideFeedback();
    const session = state.session;
    if (!session) return showHome();
    if (session.mode === "test" && session.index >= session.items.length) return renderTestResult();
    session.current = session.mode === "practice" ? nextPracticeQuestion() : session.items[session.index];
    session.locked = false;
    const question = session.current;
    els.sessionTitle.textContent = session.mode === "practice" ? "练习" : "测试";
    els.sessionCount.textContent = session.mode === "practice" ? String(session.index + 1) : `${session.index + 1}/6`;
    els.questionCard.classList.remove("result");
    els.questionText.classList.remove("result-score");
    const labels = { listening: "听力", "text-meaning": "文字", "meaning-text": "选择" };
    els.questionKind.textContent = labels[question.type];
    els.questionAudio.classList.toggle("is-hidden", question.type !== "listening");
    els.questionText.classList.toggle("is-hidden", question.type === "listening");
    els.questionText.textContent = question.type === "text-meaning" ? question.phrase.hanzi : question.phrase.meaning;
    renderChoices(question);
    if (question.type === "listening") window.setTimeout(() => playSequence(question.phrase, "connected", "session"), 160);
  }

  function renderChoices(question) {
    els.choiceList.innerHTML = "";
    question.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => answerSession(choice));
      els.choiceList.appendChild(button);
    });
  }

  function answerSession(choice) {
    const session = state.session;
    if (!session || session.locked) return;
    stopAudio();
    session.locked = true;
    [...els.choiceList.children].forEach((button) => { button.disabled = true; });
    const question = session.current;
    const correct = choice === question.answer;
    if (correct) {
      progress.wrong[question.phrase.id] = Math.max(0, (progress.wrong[question.phrase.id] || 0) - 1);
      if (session.mode === "test") session.score += 1;
    } else {
      progress.wrong[question.phrase.id] = (progress.wrong[question.phrase.id] || 0) + 1;
    }
    schedulePhrase(question.phrase, correct);
    recordActivity();
    persist();
    showFeedback(correct);
  }

  function showFeedback(correct) {
    window.clearTimeout(state.feedbackTimer);
    els.feedback.classList.remove("is-hidden", "correct", "wrong");
    els.feedback.classList.add(correct ? "correct" : "wrong");
    els.feedbackIcon.textContent = correct ? "✓" : "×";
    playSfx(correct ? "correct" : "wrong");
    state.feedbackTimer = window.setTimeout(() => {
      hideFeedback();
      if (state.session.mode === "practice" && !correct) retryPracticeQuestion();
      else advanceSession();
    }, 720);
  }

  function hideFeedback() {
    window.clearTimeout(state.feedbackTimer);
    els.feedback.classList.add("is-hidden");
    els.feedback.classList.remove("correct", "wrong");
  }

  function retryPracticeQuestion() {
    state.session.locked = false;
    renderChoices(state.session.current);
    if (state.session.current.type === "listening") playSequence(state.session.current.phrase, "connected", "session");
  }

  function advanceSession() {
    state.session.index += 1;
    renderSessionQuestion();
  }

  function renderTestResult() {
    stopAudio();
    const session = state.session;
    const percent = Math.round((session.score / session.items.length) * 100);
    const testPassed = percent >= 75;
    const learned = isStageLearned(session.dayIndex);
    progress.bestScores[session.dayIndex] = Math.max(progress.bestScores[session.dayIndex] || 0, percent);
    if (testPassed && learned) {
      progress.passed[session.dayIndex] = true;
      let unlocked = false;
      if (session.dayIndex < curriculum.length - 1 && progress.unlockedDay <= session.dayIndex) {
        progress.unlockedDay = session.dayIndex + 1;
        unlocked = true;
      }
      state.dayIndex = Math.min(session.dayIndex + 1, progress.unlockedDay);
      state.phraseIndex = 0;
      progress.lastPhrase = 0;
      persist();
      if (unlocked) playSfx("unlock");
      showRoute();
      return;
    }
    persist();
    els.sessionTitle.textContent = "结果";
    els.sessionCount.textContent = "";
    els.questionKind.textContent = testPassed ? "通过" : "未通过";
    els.questionAudio.classList.add("is-hidden");
    els.questionText.classList.remove("is-hidden");
    els.questionText.classList.add("result-score");
    els.questionText.textContent = String(percent);
    els.choiceList.innerHTML = "";
    const note = document.createElement("p");
    note.className = "result-note";
    note.textContent = testPassed && !learned ? `${learnedCount(session.dayIndex)}/${curriculum[session.dayIndex].phrases.length}` : "";
    els.choiceList.appendChild(note);
    const primary = document.createElement("button");
    primary.type = "button";
    primary.textContent = testPassed && !learned ? "学习" : "重试";
    primary.addEventListener("click", () => {
      if (testPassed && !learned) {
        const first = currentStage().phrases.findIndex((phrase) => !progress.learned[phrase.id]);
        state.phraseIndex = first < 0 ? 0 : first;
        startLesson();
      } else startTest(session.dayIndex);
    });
    els.choiceList.appendChild(primary);
    const home = document.createElement("button");
    home.type = "button";
    home.textContent = "返回";
    home.addEventListener("click", showHome);
    els.choiceList.appendChild(home);
  }

  function reviveCard(raw) {
    if (!raw) return window.FSRS ? FSRS.createEmptyCard(new Date()) : null;
    return { ...raw, due: new Date(raw.due), last_review: raw.last_review ? new Date(raw.last_review) : undefined };
  }

  function serializeCard(card) {
    return {
      ...card,
      due: card.due instanceof Date ? card.due.toISOString() : card.due,
      last_review: card.last_review instanceof Date ? card.last_review.toISOString() : card.last_review
    };
  }

  function schedulePhrase(phrase, correct) {
    if (!scheduler || !window.FSRS) return;
    try {
      const card = reviveCard(progress.cards[phrase.id]);
      const rating = correct ? FSRS.Rating.Good : FSRS.Rating.Again;
      progress.cards[phrase.id] = serializeCard(scheduler.next(card, new Date(), rating).card);
    } catch (_) { delete progress.cards[phrase.id]; }
  }

  function duePhrases() {
    const accessible = accessiblePhrases();
    const learned = accessible.filter((phrase) => progress.learned[phrase.id]);
    const pool = learned.length ? learned : currentStage().phrases;
    const now = Date.now();
    const due = pool.filter((phrase) => progress.cards[phrase.id] && new Date(progress.cards[phrase.id].due).getTime() <= now);
    if (due.length) return due;
    const weak = pool.filter((phrase) => (progress.wrong[phrase.id] || 0) > 0).sort((a, b) => (progress.wrong[b.id] || 0) - (progress.wrong[a.id] || 0));
    return weak.length ? weak : pool;
  }

  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const pick = Math.floor(Math.random() * (index + 1));
      [result[index], result[pick]] = [result[pick], result[index]];
    }
    return result;
  }

  function showSettings() {
    stopAudio();
    switchView("settings");
  }

  let toastTimer;
  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 1200);
  }

  document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("button");
    if (button && !button.disabled) playSfx("tap");
  });

  els.splashEnter.addEventListener("click", () => {
    ensureAudioContext().catch(() => {});
    showHome();
  });

  document.querySelector(".app-shell").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-home-action]");
    if (!button) return;
    ensureAudioContext().catch(() => {});
    const action = button.dataset.homeAction;
    if (action === "home") showHome();
    else if (action === "start") showRoute();
    else if (action === "favorites") showFavorites();
    else if (action === "progress") showProgress();
    else if (action === "practice") startPractice();
    else if (action === "settings") showSettings();
  });

  document.querySelectorAll("[data-back-home]").forEach((button) => button.addEventListener("click", showHome));
  els.lessonPlay.addEventListener("click", playLessonAudio);
  els.lessonPause.addEventListener("click", () => pauseAudio("lesson"));
  els.lessonSpeedButtons.forEach((button) => button.addEventListener("click", () => {
    const requestedSpeed = Number(button.dataset.lessonSpeed);
    const wasPlaying = state.audioOwner === "lesson" && state.audioBusy && !state.audioPaused;
    state.lessonSpeed = state.lessonSpeed === requestedSpeed ? 1 : requestedSpeed;
    updateLessonSpeedButtons();
    persist();
    if (state.audioOwner === "lesson" && state.audioBusy) stopAudio();
    if (wasPlaying) playLessonAudio();
  }));
  els.sessionPlay.addEventListener("click", () => playSequence(state.session?.current?.phrase, "connected", "session"));
  els.sessionPause.addEventListener("click", () => pauseAudio("session"));
  els.favoriteToggle.addEventListener("click", toggleFavorite);
  els.lessonPrev.addEventListener("click", () => navigateLesson(-1));
  els.lessonForward.addEventListener("click", () => navigateLesson(1));
  els.lessonNext.addEventListener("click", completeLessonPhrase);
  els.jyutpingToggle.addEventListener("change", () => {
    state.showJyutping = els.jyutpingToggle.checked;
    persist();
    if (state.view === "lesson") renderSyllables(displayedPhrase());
  });
  els.soundToggle.addEventListener("change", () => {
    state.soundEffects = els.soundToggle.checked;
    persist();
  });
  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
    location.reload();
  });

  updateLessonSpeedButtons();
  persist();
  showSplash();
})();
