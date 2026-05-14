(function () {
  const measurementId = 'G-REPLACE-ME';
  const isConfigured = /^G-[A-Z0-9]+$/i.test(measurementId) && !measurementId.includes('REPLACE');

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  if (!isConfigured) {
    window.aiHealthAnalyticsStatus = 'missing-measurement-id';
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
})();
