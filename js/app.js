'use strict';

const app = (() => {
  // ── Index of day currently shown in student view (0=Mon) ─────
  let _currentDayIdx = 0;
  let _todayIdx      = 0;

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    // 0=Mon … 6=Sun  (JS getDay: 0=Sun, so shift)
    _todayIdx      = (new Date().getDay() + 6) % 7;
    _currentDayIdx = _todayIdx;

    student.init();
    supervisor.init();
    charts.init();

    switchView('student');
  }

  // ── View switcher ─────────────────────────────────────────────
  function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${view}`).classList.add('active');
    document.getElementById(`btn-${view}`).classList.add('active');
  }

  // ── Day helpers ───────────────────────────────────────────────
  function currentDayIdx()  { return _currentDayIdx; }
  function todayIdx()       { return _todayIdx; }
  function getCurrentDay()  { return DATA.DAYS[_currentDayIdx]; }
  function getTodayDay()    { return DATA.DAYS[_todayIdx]; }

  function setDay(index) {
    _currentDayIdx = index;
    student.renderMeals();
  }

  // ── Meal datetime for cutoff logic ────────────────────────────
  function getMealDateTime(dayIndex, meal) {
    const [h, m] = DATA.MEAL_TIMES[meal].split(':').map(Number);
    const now     = new Date();
    const todayDow = (now.getDay() + 6) % 7;         // 0=Mon
    const diff     = dayIndex - todayDow;
    const target   = new Date(now);
    target.setDate(now.getDate() + diff);
    target.setHours(h, m, 0, 0);
    return target;
  }

  // ── Cutoff: must be ≥ 6 h before meal ────────────────────────
  function canOptOut(dayIndex, meal) {
    return (getMealDateTime(dayIndex, meal) - Date.now()) >= 6 * 3600 * 1000;
  }

  function isMealPast(dayIndex, meal) {
    return getMealDateTime(dayIndex, meal) < Date.now();
  }

  // ── Opt-out state ─────────────────────────────────────────────
  function optKey(day, meal) { return `${day}-${meal}`; }

  function getOptOutCount(day, meal) {
    return DATA.optOuts[optKey(day, meal)]?.size || 0;
  }

  function isOptedOut(day, meal) {
    return DATA.optOuts[optKey(day, meal)]?.has(DATA.CURRENT_STUDENT_ID) || false;
  }

  function toggleOptOut(day, meal) {
    const key = optKey(day, meal);
    if (!DATA.optOuts[key]) DATA.optOuts[key] = new Set();
    const set = DATA.optOuts[key];
    if (set.has(DATA.CURRENT_STUDENT_ID)) {
      set.delete(DATA.CURRENT_STUDENT_ID);
      showToast('Meal opt-out cancelled ✓');
    } else {
      set.add(DATA.CURRENT_STUDENT_ID);
      showToast('Meal skipped — kitchen notified 🌱');
    }
  }

  // ── Headcount formula ─────────────────────────────────────────
  // CookQty = (Enrolled − OptOuts) × PortionGrams × SafetyMargin
  function getPredictedHeadcount(day, meal) {
    return DATA.TOTAL_ENROLLED - getOptOutCount(day, meal);
  }

  function getCookQuantities(day, meal) {
    const hc = getPredictedHeadcount(day, meal);
    const out = {};
    for (const [item, grams] of Object.entries(DATA.PORTIONS)) {
      out[item] = ((hc * grams * DATA.SAFETY_MARGIN) / 1000).toFixed(1) + ' kg';
    }
    return out;
  }

  // ── Toast ─────────────────────────────────────────────────────
  function showToast(msg, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast' + (isError ? ' error' : '');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  return {
    init, switchView,
    currentDayIdx, todayIdx,
    getCurrentDay, getTodayDay, setDay,
    getMealDateTime, canOptOut, isMealPast,
    getOptOutCount, isOptedOut, toggleOptOut,
    getPredictedHeadcount, getCookQuantities,
    showToast,
  };
})();

window.addEventListener('DOMContentLoaded', app.init);
