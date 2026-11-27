// Shared UI builders: HTML escaping, numeric formatting, KPI cards, takeaway callouts, sortable tables

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

export function fmtNum(value, decimals = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function kpiCard(item, sparkSvg = '') {
  const toneClass =
    item.tone === 'good' ? 'delta-good' : item.tone === 'signal' ? 'delta-signal' : 'delta-neutral';
  const accentClass =
    item.tone === 'signal' ? 'accent-crimson' : item.tone === 'good' ? 'accent-teal' : '';
  const openTag = item.route
    ? `<a href="${esc(item.route)}" class="kpi-card ${accentClass}" style="color:inherit;text-decoration:none">`
    : `<article class="kpi-card ${accentClass}">`;
  const closeTag = item.route ? '</a>' : '</article>';
  return `${openTag}
    <div class="kpi-top">
      <span class="kpi-label">${esc(item.label)}</span>
      <span class="code-tag">${esc(item.code)}</span>
    </div>
    <div class="kpi-main">
      <span class="kpi-value">${esc(item.value)}</span>
      <span class="delta ${toneClass}">${esc(item.delta)}</span>
    </div>
    ${sparkSvg}
    <div class="kpi-meta">
      <span>${esc(item.source)}</span>
      <strong>${esc(item.year)}</strong>
    </div>
  ${closeTag}`;
}

export function takeawayBox(text, label = 'Key Takeaway') {
  return `<div class="takeaway"><strong>${esc(label)}:</strong> ${esc(text)}</div>`;
}

export function renderTable({ columns, rows, sortKey = '', sortDir = 'asc', tableId = '' }) {
  const head = columns
    .map((col) => {
      const cls = col.align === 'num' ? ' class="num"' : '';
      if (!col.sortable) return `<th${cls}>${esc(col.label)}</th>`;
      const arrow = sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
      return `<th${cls}><button type="button" class="sort-btn" data-sort="${esc(col.key)}">${esc(col.label)}${arrow}</button></th>`;
    })
    .join('');

  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => {
            const cls = col.align === 'num' ? ' class="num"' : '';
            const raw = row[col.key];
            const display = col.render ? col.render(raw, row) : esc(raw);
            return `<td${cls}>${display}</td>`;
          })
          .join('')}</tr>`,
    )
    .join('');

  return `<div class="table-scroll">
    <table class="data-table"${tableId ? ` id="${esc(tableId)}"` : ''}>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}
