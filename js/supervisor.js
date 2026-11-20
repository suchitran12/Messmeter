'use strict';

const supervisor = (() => {
  const MEAL_ORDER = ['breakfast','lunch','snack','dinner'];
  const MEAL_ICON  = { breakfast:'☀️', lunch:'🌤', snack:'🌥', dinner:'🌙' };

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderHeadcount();
    renderWasteTable();
  }

  // ── Headcount Predictor Cards ─────────────────────────────────
  function renderHeadcount() {
    const grid  = document.getElementById('headcount-grid');
    const today = app.getTodayDay();
    const todayIdx = app.todayIdx();

    grid.innerHTML = MEAL_ORDER.map(meal => {
      const hc      = app.getPredictedHeadcount(today, meal);
      const optOuts = app.getOptOutCount(today, meal);
      const qs      = app.getCookQuantities(today, meal);
      const past    = app.isMealPast(todayIdx, meal);

      const ingRows = Object.entries(qs).map(([k, v]) =>
        `<div class="hc-ing-row">
           <span>${k.charAt(0).toUpperCase() + k.slice(1)}</span>
           <span>${v}</span>
         </div>`
      ).join('');

      return `
        <div class="hc-card">
          <div class="hc-meal">${MEAL_ICON[meal]} ${meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
          <div class="hc-count">${hc}</div>
          <div class="hc-label">students expected${past ? ' (passed)' : ''}</div>
          ${optOuts > 0 ? `<div class="hc-optouts">↓ ${optOuts} opted out · ₹${optOuts * DATA.MEAL_REBATE} saved</div>` : ''}
          <div class="hc-ing">${ingRows}</div>
        </div>`;
    }).join('');
  }

  // ── Waste Log Table ───────────────────────────────────────────
  function renderWasteTable() {
    const tbody = document.getElementById('waste-tbody');
    const logs  = [...DATA.wasteLogs].reverse(); // most-recent first

    tbody.innerHTML = logs.map(log => {
      const total = (log.rice + log.dal + log.veg + log.roti).toFixed(1);
      return `<tr>
        <td>${log.date}</td>
        <td>${log.meal.charAt(0).toUpperCase() + log.meal.slice(1)}</td>
        <td>${log.rice}</td>
        <td>${log.dal}</td>
        <td>${log.veg}</td>
        <td>${log.roti}</td>
        <td class="total-kg">${total} kg</td>
      </tr>`;
    }).join('');
  }

  // ── Waste Modal ───────────────────────────────────────────────
  function openWasteModal() {
    ['waste-rice','waste-dal','waste-veg','waste-roti'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('waste-modal').classList.remove('hidden');
  }

  function closeWasteModal() {
    document.getElementById('waste-modal').classList.add('hidden');
  }

  function saveWasteLog() {
    const meal = document.getElementById('waste-meal').value;
    const rice = parseFloat(document.getElementById('waste-rice').value) || 0;
    const dal  = parseFloat(document.getElementById('waste-dal').value)  || 0;
    const veg  = parseFloat(document.getElementById('waste-veg').value)  || 0;
    const roti = parseFloat(document.getElementById('waste-roti').value) || 0;

    if (rice + dal + veg + roti === 0) {
      app.showToast('Enter at least one value', true);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    DATA.wasteLogs.push({ date: today, meal, rice, dal, veg, roti });

    closeWasteModal();
    renderWasteTable();
    charts.updateWasteChart();
    app.showToast('Waste log saved ✓');
  }

  return { init, renderHeadcount, renderWasteTable, openWasteModal, closeWasteModal, saveWasteLog };
})();
