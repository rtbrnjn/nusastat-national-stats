// Interactive hover tooltip binder for SVG data points and map features

export function bindChartTooltips(root) {
  root.querySelectorAll('.chart-wrap').forEach((wrap) => {
    const tip = wrap.querySelector('.chart-tooltip');
    if (!tip) return;
    wrap.querySelectorAll('[data-tip]').forEach((el) => {
      el.addEventListener('mouseenter', (ev) => {
        tip.textContent = el.getAttribute('data-tip') || '';
        const rect = wrap.getBoundingClientRect();
        const x = Math.min(rect.width - 190, Math.max(8, ev.clientX - rect.left + 10));
        const y = Math.max(4, ev.clientY - rect.top - 26);
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
        tip.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        tip.style.opacity = '0';
      });
    });
  });
}
