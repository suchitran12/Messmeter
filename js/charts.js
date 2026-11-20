'use strict';

const charts = (() => {
  let wasteChart, savingsChart, ratingsChart;

  const CHART_OPTS = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    buildWasteChart();
    buildSavingsChart();
    buildRatingsChart();
  }

  // ── 1. Weekly Waste Bar Chart ─────────────────────────────────
  function getDailyWaste() {
    const byDate = {};
    DATA.wasteLogs.forEach(log => {
      byDate[log.date] = (byDate[log.date] || 0) + log.rice + log.dal + log.veg + log.roti;
    });
    const sorted = Object.entries(byDate)
      .sort(([a],[b]) => a.localeCompare(b))
      .slice(-7);
    return {
      labels: sorted.map(([d]) => d.slice(5)),   // "MM-DD"
      data:   sorted.map(([,v]) => +v.toFixed(1)),
    };
  }

  function buildWasteChart() {
    const { labels, data } = getDailyWaste();
    wasteChart = new Chart(document.getElementById('chart-waste'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: 'rgba(231,111,81,.75)',
          borderColor:     '#e76f51',
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        ...CHART_OPTS,
        scales: {
          y: { beginAtZero: true, ticks: { font: { size: 11 } } },
          x: { ticks: { font: { size: 11 } } },
        },
      },
    });
  }

  function updateWasteChart() {
    if (!wasteChart) return;
    const { labels, data } = getDailyWaste();
    wasteChart.data.labels         = labels;
    wasteChart.data.datasets[0].data = data;
    wasteChart.update();
  }

  // ── 2. Money Saved Line Chart ─────────────────────────────────
  // Savings = optOuts × ₹30 rebate + estimated food cost saving (₹8/kg prevented)
  function getSavingsData() {
    const labels = DATA.DAYS.map(d => d.slice(0,3));
    const data   = DATA.DAYS.map(day => {
      let saved = 0;
      ['breakfast','lunch','snack','dinner'].forEach(meal => {
        const oo = DATA.optOuts[`${day}-${meal}`]?.size || 0;
        saved += oo * DATA.MEAL_REBATE;
      });
      return saved;
    });
    return { labels, data };
  }

  function buildSavingsChart() {
    const { labels, data } = getSavingsData();
    savingsChart = new Chart(document.getElementById('chart-savings'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor:     '#52b788',
          backgroundColor: 'rgba(82,183,136,.15)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#2d6a4f',
          pointRadius: 4,
        }],
      },
      options: {
        ...CHART_OPTS,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => '₹' + v, font: { size: 11 } },
          },
          x: { ticks: { font: { size: 11 } } },
        },
      },
    });
  }

  // ── 3. Top Dish Ratings Horizontal Bar ───────────────────────
  function getRatingsData() {
    const dishes = Object.entries(DATA.ratings)
      .map(([key, r]) => {
        const [day, meal] = key.split('-');
        return { label: DATA.MENU[day][meal].name, avg: r.avg };
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8);

    return {
      labels: dishes.map(d => d.label),
      data:   dishes.map(d => +d.avg.toFixed(2)),
      colors: dishes.map(d =>
        d.avg >= 4.5 ? 'rgba(82,183,136,.85)'
        : d.avg >= 3.5 ? 'rgba(244,197,66,.85)'
        :                'rgba(231,111,81,.85)'
      ),
    };
  }

  function buildRatingsChart() {
    const { labels, data, colors } = getRatingsData();
    ratingsChart = new Chart(document.getElementById('chart-ratings'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 5,
        }],
      },
      options: {
        indexAxis: 'y',
        ...CHART_OPTS,
        scales: {
          x: { min: 0, max: 5, ticks: { font: { size: 11 } } },
          y: { ticks: { font: { size: 10 } } },
        },
      },
    });
  }

  function updateRatingsChart() {
    if (!ratingsChart) return;
    const { labels, data, colors } = getRatingsData();
    ratingsChart.data.labels                      = labels;
    ratingsChart.data.datasets[0].data            = data;
    ratingsChart.data.datasets[0].backgroundColor = colors;
    ratingsChart.update();
  }

  return { init, updateWasteChart, updateRatingsChart };
})();
