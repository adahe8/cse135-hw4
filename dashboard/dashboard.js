(function() {
    'use strict';

    const API_BASE = '/api';
    let currentUser = null;

    // Auth check
    async function checkAuth() {
        try {
            const res = await fetch(API_BASE + '/dashboard', { credentials: 'include' });
            if (res.status === 401) {
                window.location.href = '/login.html';
                return false;
            }
            return true;
        } catch {
            return false;
        }
    }

    async function init() {
        if (await checkAuth()) {
            document.body.style.visibility = 'visible';
            window.addEventListener('hashchange', route);
            route();
        }
        // if not authed, checkAuth() already redirected — body stays hidden
    }

    // Fetch helper
    async function api(endpoint) {
        const dates = getDateRange();
        const url = `${API_BASE}${endpoint}?start=${dates.start}&end=${dates.end}`;
        const res = await fetch(url, { credentials: 'include' });
        if (res.status === 401) { window.location.href = '../01-login/login.html'; return null; }
        const json = await res.json();
        return json.success ? json.data : null;
    }

    function getDateRange() {
        const end = document.getElementById('date-end')?.value || new Date().toISOString().slice(0, 10);
        const start = document.getElementById('date-start')?.value || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
        return { start, end };
    }

    // Render metric cards
    function renderCards(data) {
        const container = document.getElementById('cards');
        if (!container) return;
        container.innerHTML = '';
        const metrics = [
            { label: 'Total Pageviews', value: (data.total_pageviews || 0).toLocaleString() },
            { label: 'Total Sessions', value: (data.total_sessions || 0).toLocaleString() },
            { label: 'Avg Load Time', value: (data.avg_load_time_ms || 0) + ' ms' },
            { label: 'Total Errors', value: (data.total_errors || 0).toLocaleString() },
        ];
        metrics.forEach(m => {
            const card = document.createElement('div');
            card.className = 'metric-card';
            const label = document.createElement('div');
            label.className = 'metric-label';
            label.textContent = m.label;
            const value = document.createElement('div');
            value.className = 'metric-value';
            value.textContent = m.value;
            card.appendChild(label);
            card.appendChild(value);
            container.appendChild(card);
        });
    }

    // Simple line chart on canvas
    function renderLineChart(canvas, dataPoints, labelKey, valueKey) {
        if (!canvas || !dataPoints || dataPoints.length === 0) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width = canvas.offsetWidth;
        const H = canvas.height = 250;
        const pad = { top: 20, right: 20, bottom: 40, left: 60 };
        const plotW = W - pad.left - pad.right;
        const plotH = H - pad.top - pad.bottom;

        ctx.clearRect(0, 0, W, H);

        const values = dataPoints.map(d => Number(d[valueKey]));
        const maxVal = Math.max(...values, 1);

        // Axes
        ctx.strokeStyle = '#ddd';
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, H - pad.bottom);
        ctx.lineTo(W - pad.right, H - pad.bottom);
        ctx.stroke();

        // Line
        ctx.strokeStyle = '#2E86C1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        dataPoints.forEach((d, i) => {
            const x = pad.left + (i / (dataPoints.length - 1 || 1)) * plotW;
            const y = H - pad.bottom - (values[i] / maxVal) * plotH;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Points
        ctx.fillStyle = '#2E86C1';
        dataPoints.forEach((d, i) => {
            const x = pad.left + (i / (dataPoints.length - 1 || 1)) * plotW;
            const y = H - pad.bottom - (values[i] / maxVal) * plotH;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // X labels (show first, middle, last)
        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        [0, Math.floor(dataPoints.length / 2), dataPoints.length - 1].forEach(i => {
            if (!dataPoints[i]) return;
            const x = pad.left + (i / (dataPoints.length - 1 || 1)) * plotW;
            ctx.fillText(dataPoints[i][labelKey], x, H - pad.bottom + 20);
        });

        // Y labels
        ctx.textAlign = 'right';
        ctx.fillText(maxVal.toLocaleString(), pad.left - 8, pad.top + 10);
        ctx.fillText('0', pad.left - 8, H - pad.bottom);
    }

    // Top pages table
    function renderTable(container, pages) {
        if (!container) return;
        container.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>URL</th><th>Views</th></tr>';
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        (pages || []).forEach(p => {
            const tr = document.createElement('tr');
            const tdUrl = document.createElement('td');
            tdUrl.textContent = p.url;
            const tdViews = document.createElement('td');
            tdViews.textContent = Number(p.views).toLocaleString();
            tr.appendChild(tdUrl);
            tr.appendChild(tdViews);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    }

    // Overview view
    async function renderOverview() {
        const content = document.getElementById('content');
        content.innerHTML = '<div id="cards" class="cards-grid"></div><canvas id="chart" style="width:100%;margin:20px 0;"></canvas><div id="top-pages"></div>';

        const [dashboard, pageviews] = await Promise.all([api('/dashboard'), api('/pageviews')]);
        if (dashboard) renderCards(dashboard);
        if (pageviews) {
            renderLineChart(document.getElementById('chart'), pageviews.byDay, 'day', 'views');
            renderTable(document.getElementById('top-pages'), pageviews.topPages);
        }
    }

    // Router
    function route() {
        const hash = window.location.hash || '#/overview';
        // Update active sidebar link
        document.querySelectorAll('.sidebar a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === hash);
        });
        if (hash.startsWith('#/overview')) renderOverview();
        // Other routes would go here (performance, errors, admin)
    }

    // Logout
    document.addEventListener('click', e => {
        if (e.target.id === 'logout-btn') {
            fetch(API_BASE + '/logout', { method: 'POST', credentials: 'include' })
                .then(() => { window.location.href = '../01-login/login.html'; });
        }
    });

    // Date change
    document.addEventListener('change', e => {
        if (e.target.id === 'date-start' || e.target.id === 'date-end') route();
    });

    // Init
    async function init() {
        if (await checkAuth()) {
            window.addEventListener('hashchange', route);
            route();
        }
    }

    init();
})();