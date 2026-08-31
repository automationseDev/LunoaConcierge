(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function push(eventName, params) {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  function queryParams() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || ''
    };
  }

  function loadGTM(id) {
    if (!id || !/^GTM-[A-Z0-9]+$/i.test(id)) return;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var first = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    first.parentNode.insertBefore(script, first);
  }

  function clickArea(link) {
    if (link.closest('.hero-actions')) return 'hero';
    if (link.closest('.download-card')) return 'download_section';
    if (link.closest('.footer-links')) return 'footer';
    return 'other';
  }

  loadGTM(window.LUNOA_GTM_ID || '');

  document.addEventListener('DOMContentLoaded', function () {
    push('lunoa_lp_view', Object.assign({
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || ''
    }, queryParams()));
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;

    var href = link.href || '';
    var isRelease = /github\.com\/automationseDev\/LunoaConcierge\/releases/i.test(href);
    var isApk = /\.apk(?:$|\?)/i.test(href);
    if (!isRelease && !isApk) return;

    push('lunoa_download_click', Object.assign({
      click_area: clickArea(link),
      link_text: (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
      link_url: href,
      page_path: window.location.pathname
    }, queryParams()));
  }, true);
})();
