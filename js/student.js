'use strict';

const student = (() => {
  const MEAL_ORDER  = ['breakfast','lunch','snack','dinner'];
  const MEAL_ICON   = { breakfast:'☀️', lunch:'🌤', snack:'🌥', dinner:'🌙' };

  let _ratingCtx    = null;  // { day, meal }
  let _selectedStar = 0;

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderDayTabs();
    renderMeals();
  }

  // ── Day Tabs ──────────────────────────────────────────────────
  function renderDayTabs() {
    const container = document.getElementById('day-tabs');
    container.innerHTML = DATA.DAYS.map((day, i) => {
      const isToday  = i === app.todayIdx();
      const isActive = i === app.currentDayIdx();
      return `<button
        class="day-tab ${isActive ? 'active' : ''} ${isToday && !isActive ? 'today' : ''}"
        onclick="student.selectDay(${i})">
        ${day.slice(0,3)}${isToday ? ' ●' : ''}
      </button>`;
    }).join('');
  }

  function selectDay(index) {
    app.setDay(index);
    renderDayTabs();
  }

  // ── Meal Cards ────────────────────────────────────────────────
  function renderMeals() {
    const day     = app.getCurrentDay();
    const dayIdx  = app.currentDayIdx();
    const grid    = document.getElementById('meal-grid');

    grid.innerHTML = MEAL_ORDER.map(meal => {
      const info   = DATA.MENU[day][meal];
      const key    = `${day}-${meal}`;
      const r      = DATA.ratings[key];
      const opted  = app.isOptedOut(day, meal);
      const past   = app.isMealPast(dayIdx, meal);
      const canOpt = app.canOptOut(dayIdx, meal);

      // ─ Opt-out button ─
      let optBtn;
      if (past) {
        optBtn = `<span class="cutoff-tag">Meal passed</span>`;
      } else if (!canOpt) {
        optBtn = `<button class="btn-optout" disabled>⏰ Cutoff Passed</button>`;
      } else {
        optBtn = `<button class="btn-optout ${opted ? 'opted' : ''}"
          onclick="student.handleOptOut('${day}','${meal}')">
          ${opted ? '✕ Opted Out' : "✓ I'll Eat"}
        </button>`;
      }

      // ─ Rate button (only after meal) ─
      const userRated = r?.userRating > 0;
      const rateBtn   = past
        ? `<button class="btn-rate ${userRated ? 'rated' : ''}"
            onclick="student.openRatingModal('${day}','${meal}')">
            ${userRated ? `★ ${r.userRating}` : '☆ Rate'}
           </button>`
        : '';

      // ─ Star summary ─
      const starRow = r
        ? `<div class="card-rating">
             ${starsHTML(r.avg)}
             <span class="rating-val">${r.avg.toFixed(1)} (${r.count})</span>
           </div>`
        : '';

      return `
        <div class="meal-card">
          <div class="card-top">
            <span class="meal-time-label">${MEAL_ICON[meal]} ${meal.charAt(0).toUpperCase()+meal.slice(1)} · ${DATA.MEAL_TIMES[meal]}</span>
            <span class="diet-badge ${info.veg ? 'veg' : 'non-veg'}">${info.veg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
          </div>
          <div class="meal-name">${info.name}</div>
          <div class="meal-desc">${info.desc}</div>
          <div class="meal-items">${info.items.map(it => `<span class="item-chip">${it}</span>`).join('')}</div>
          ${starRow}
          <div class="meal-actions">${optBtn}${rateBtn}</div>
        </div>`;
    }).join('');
  }

  function starsHTML(avg) {
    return [1,2,3,4,5]
      .map(n => `<span class="star-sm">${n <= Math.round(avg) ? '★' : '☆'}</span>`)
      .join('');
  }

  // ── Opt-Out Handler ───────────────────────────────────────────
  function handleOptOut(day, meal) {
    app.toggleOptOut(day, meal);
    renderMeals();
    supervisor.renderHeadcount(); // keep supervisor card in sync
  }

  // ── Rating Modal ──────────────────────────────────────────────
  function openRatingModal(day, meal) {
    _ratingCtx    = { day, meal };
    _selectedStar = DATA.ratings[`${day}-${meal}`]?.userRating || 0;

    document.getElementById('rating-title').textContent =
      `Rate: ${DATA.MENU[day][meal].name}`;
    document.getElementById('rating-comment').value =
      DATA.ratings[`${day}-${meal}`]?.comment || '';

    _applyStarUI();
    document.getElementById('rating-modal').classList.remove('hidden');

    document.querySelectorAll('#star-rating .star').forEach(s => {
      s.onclick = () => { _selectedStar = +s.dataset.val; _applyStarUI(); };
    });
  }

  function _applyStarUI() {
    document.querySelectorAll('#star-rating .star').forEach(s => {
      s.classList.toggle('active', +s.dataset.val <= _selectedStar);
    });
  }

  function closeRatingModal() {
    document.getElementById('rating-modal').classList.add('hidden');
    _ratingCtx = null;
  }

  function submitRating() {
    if (!_ratingCtx || _selectedStar === 0) {
      app.showToast('Please pick a star rating', true);
      return;
    }
    const { day, meal } = _ratingCtx;
    const key = `${day}-${meal}`;
    const r   = DATA.ratings[key];
    const comment = document.getElementById('rating-comment').value.trim();

    // Recalculate running average
    if (r.userRating > 0) {
      r.avg = +((r.avg * r.count - r.userRating + _selectedStar) / r.count).toFixed(2);
    } else {
      r.count += 1;
      r.avg = +((r.avg * (r.count - 1) + _selectedStar) / r.count).toFixed(2);
    }
    r.userRating = _selectedStar;
    r.comment    = comment;

    closeRatingModal();
    renderMeals();
    charts.updateRatingsChart();
    app.showToast('Rating submitted! Thank you 🙏');
  }

  return { init, renderMeals, selectDay, handleOptOut, openRatingModal, closeRatingModal, submitRating };
})();
