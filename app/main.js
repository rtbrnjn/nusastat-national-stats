// Ultra-lean bootstrap: loads stylesheets before chrome & router to avoid FOUC
const css = (href) => new Promise((r) => document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href, onload: r, onerror: r })));
let boot;
const go = async () => (await (boot ??= Promise.all([css('style.css'), css('styles-extra.css'), import('./components/chrome.js')]).then(([, , c]) => c))).renderRoute();
addEventListener('hashchange', go);
go();
