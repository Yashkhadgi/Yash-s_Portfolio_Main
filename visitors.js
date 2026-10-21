(() => {
  'use strict';
  const el = id => document.getElementById(id);
  let token = '', page = 0, detailPage = 0, selected = null, busy = false, generation = 0;
  const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const labels = { arrival: 'Arrival', universe: 'Universe', theater: 'Theater', research: 'Archives', contact: 'Contact' };
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
  function country(code) { try { return code ? countryNames.of(code) : 'Unavailable'; } catch { return code || 'Unavailable'; } }
  function section(route) {
    const [base, ...rest] = route.replace(/^#/, '').split('/');
    return `${labels[base] || base}${rest.length ? ` / ${rest.join('/')}` : ''}`;
  }
  function duration(ms) {
    if (ms === null || ms === undefined) return 'Unknown';
    const seconds = Math.floor(Number(ms) / 1000);
    return `${Math.floor(seconds / 3600) ? `${Math.floor(seconds / 3600)}h ` : ''}${Math.floor(seconds / 60) % 60}m ${seconds % 60}s`;
  }
  function browserDevice(ua = '') {
    const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /(?:Chrome|CriOS)\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser';
    const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Macintosh|Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown OS';
    const device = /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) ? 'Tablet' : /Mobile|iPhone|iPod/.test(ua) ? 'Mobile' : /Windows|Macintosh|Linux/.test(ua) ? 'Desktop' : 'Unknown device';
    return `${browser} · ${os} · ${device}`;
  }
  function status(message, error = false) { el('status').textContent = message; el('status').classList.toggle('error', error); }
  function row(values) {
    const tr = document.createElement('tr');
    for (const value of values) {
      const td = document.createElement('td');
      if (value instanceof Node) td.appendChild(value); else td.textContent = value ?? '—';
      tr.appendChild(td);
    }
    return tr;
  }
  function renderRows(id, rows, columns) {
    if (!rows.length) {
      const tr = row(['No records on this page yet.']); tr.firstChild.colSpan = columns; rows.push(tr);
    }
    el(id).replaceChildren(...rows);
  }
  function lock() {
    token = ''; selected = null; generation++;
    el('rows').replaceChildren(); el('detail-rows').replaceChildren();
    el('detail').hidden = true; el('history').hidden = true; el('login').hidden = false;
    status('Locked. Unlock to view visitor records.');
  }
  async function get(query) {
    const response = await fetch(`/api/visits?${query}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!(response.headers.get('content-type') || '').includes('application/json')) throw new Error('This page needs the deployed Vercel APIs.');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load visits');
    return data.visits;
  }
  async function load(targetPage = page, targetDetailPage = detailPage) {
    if (!token || busy) return;
    busy = true;
    const version = generation, selection = selected;
    status('Loading saved visits…');
    try {
      const [sessions, events] = await Promise.all([
        get(new URLSearchParams({ page: targetPage })),
        selection ? get(new URLSearchParams({ page: targetDetailPage, session: selection.visit_key })) : Promise.resolve([])
      ]);
      if (version !== generation) return;
      page = targetPage; detailPage = targetDetailPage;
      renderRows('rows', sessions.map(visit => {
        const button = document.createElement('button');
        button.textContent = visit.visit_key.startsWith('event-') ? visit.visit_key : `Visit ${visit.visit_key.slice(0, 8)}`;
        button.title = visit.visit_key;
        button.setAttribute('aria-label', `Open journey for ${visit.ip}, ${date.format(new Date(visit.first_seen))} ${time.format(new Date(visit.first_seen))} IST`);
        button.setAttribute('aria-expanded', String(selected?.visit_key === visit.visit_key));
        button.addEventListener('click', async () => {
          if (busy) return;
          selected = visit; detailPage = 0;
          el('detail-rows').replaceChildren(); el('detail').hidden = true;
          await load(page, 0);
          if (!el('detail').hidden) el('detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        const device = document.createElement('span'); device.textContent = browserDevice(visit.user_agent); device.title = visit.user_agent || 'Unavailable';
        return row([button, 'Unknown', visit.ip, date.format(new Date(visit.first_seen)), time.format(new Date(visit.first_seen)), `${date.format(new Date(visit.last_seen))} ${time.format(new Date(visit.last_seen))}`, country(visit.country), visit.city || 'Unavailable', device, (visit.routes || []).map(section).join(' · ') || 'Unavailable', visit.page_views, duration(visit.active_ms), visit.referrer || 'Direct / unavailable']);
      }), 13);
      el('history').hidden = false; el('login').hidden = true;
      el('previous').disabled = page === 0; el('next').disabled = sessions.length < 100;
      el('page').textContent = `Page ${page + 1}`;
      el('summary').textContent = `${sessions.length} visits on this page`;
      el('detail').hidden = !selection;
      if (selection) {
        el('detail-title').textContent = `Journey · ${selection.ip}`;
        el('detail-meta').textContent = `Session: ${selection.visit_key} · Browser: ${selection.user_agent || 'Unavailable'}`;
        renderRows('detail-rows', events.map((visit, index) => {
          return row([detailPage * 100 + index + 1, date.format(new Date(visit.visited_at)), time.format(new Date(visit.visited_at)), visit.last_seen ? `${date.format(new Date(visit.last_seen))} ${time.format(new Date(visit.last_seen))}` : 'Unknown', section(visit.route), duration(visit.active_ms), visit.ended ? 'Left page' : 'Last reported', visit.ip]);
        }), 8);
        el('detail-previous').disabled = detailPage === 0;
        el('detail-next').disabled = events.length < 100;
        el('detail-page').textContent = `Journey page ${detailPage + 1}`;
      }
      status(`Updated ${time.format(new Date())} IST${page ? ' · Open page 1 to see the latest visits.' : ''}`);
    } catch (error) {
      if (version === generation) status(error.message, true);
    } finally { busy = false; }
  }
  el('login').addEventListener('submit', event => {
    event.preventDefault(); if (busy) return;
    token = el('token').value.trim(); el('token').value = ''; generation++; load(0, 0);
  });
  el('refresh').addEventListener('click', () => load());
  el('lock').addEventListener('click', lock);
  el('previous').addEventListener('click', () => load(Math.max(0, page - 1)));
  el('next').addEventListener('click', () => load(page + 1));
  el('detail-previous').addEventListener('click', () => load(page, Math.max(0, detailPage - 1)));
  el('detail-next').addEventListener('click', () => load(page, detailPage + 1));
  el('close-detail').addEventListener('click', () => {
    selected = null; detailPage = 0; generation++;
    el('detail').hidden = true; el('detail-rows').replaceChildren();
    el('rows').querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', 'false'));
  });
  setInterval(() => { if (token && el('auto').checked && !document.hidden) load(); }, 15000);
})();
