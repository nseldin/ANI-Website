const CACHE_VERSION = "ani-pwa-v349-web-1e74625a9add";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app-config.js",
  "/styles.css",
  "/web/ani-website-responsive.css",
  "/src/microbiology/domain-core.js",
  "/data/microbiology-database.js",
  "/src/surgery-procedures/domain-core.js",
  "/data/surgery-procedure-database.js",
  "/data/mnemonic-library.js",
  "/data/learner-language-standard.js",
  "/data/medical-updates.js",
  "/data/medical-updates.json",
  "/main.js",
  "/src/lane4/runtime-efficiency.js",
  "/data/pharm-database.js",
  "/data/pharm-expansion.js",
  "/data/pharm-drug-bible-supplement.js",
  "/data/pharm-reviewed-expansion.js",
  "/data/pharm-auto-standalone-cards.js",
  "/data/pharm-integrity-patch.js",
  "/data/pharm-frontier-patch.js",
  "/data/pharm-frontier-wave3-patch.js",
  "/data/pharm-frontier-wave3-targeted-patch.js",
  "/data/pharm-frontier-wave3-immune-patch.js",
  "/data/pharm-frontier-wave3-neuro-patch.js",
  "/data/pharm-frontier-wave3-acute-specialty-patch.js",
  "/data/pathology-database.js",
  "/data/pathology-bible-supplement.js",
  "/data/pathology-medication-treatment-supplement.js",
  "/data/pathology-reviewed-expansion.js",
  "/data/holistic-database.js",
  "/data/diagnostic-database.js",
  "/data/encyclopedia-quality-patch.js",
  "/data/first-sentence-crash-course-patch.js",
  "/data/pharm-frontier-wave4-anesthesia-eye-patch.js",
  "/data/pharm-frontier-wave4-gi-hepatology-patch.js",
  "/data/pharm-frontier-wave4-dermatology-patch.js",
  "/data/pharm-frontier-wave4-urology-patch.js",
  "/data/pharm-frontier-wave4-bone-renal-patch.js",
  "/data/pharm-frontier-wave5-psychiatry-patch.js",
  "/data/pharm-frontier-wave6-endocrine-patch.js",
  "/data/pharm-frontier-wave7-hematology-patch.js",
  "/data/pharm-frontier-wave8-pulmonary-allergy-patch.js",
  "/data/pharm-frontier-wave9-rheumatology-patch.js",
  "/data/pharm-frontier-wave10-infectious-antiparasitic-patch.js",
  "/data/pharm-frontier-wave11-maternal-reproductive-patch.js",
  "/data/pharm-why-closure-systemic-patch.js",
  "/data/pharm-frontier-wave12-common-core-causal-patch.js",
  "/data/pharm-frontier-wave13-cardiovascular-ccb-patch.js",
  "/data/pharm-frontier-wave14-cardiovascular-raas-patch.js",
  "/data/pharm-frontier-wave15-renal-diuretic-patch.js",
  "/data/pharm-frontier-wave16-lipid-lowering-patch.js",
  "/data/pharm-frontier-wave17-antifungal-causal-patch.js",
  "/data/pharm-frontier-wave18-beta-lactam-causal-patch.js",
  "/data/pharm-frontier-wave19-weight-management-why-patch.js",
  "/data/pharm-frontier-wave20-sglt2-causal-patch.js",
  "/data/pharm-frontier-wave21-antiseizure-causal-patch.js",
  "/data/pharm-frontier-wave21-antiseizure-routing.js",
  "/data/pharm-frontier-wave22-parkinson-causal-patch.js",
  "/data/pharm-frontier-wave22-parkinson-routing.js",
  "/data/clinical-frontier-wave23-stroke-causal-patch.js",
  "/data/clinical-frontier-wave23-stroke-routing.js",
  "/data/pharm-frontier-wave24-opioid-causal-patch.js",
  "/data/pharm-frontier-wave24-opioid-routing.js",
  "/data/clinical-frontier-wave25-renal-causal-patch.js",
  "/data/clinical-frontier-wave25-acidbase-causal-patch.js",
  "/data/clinical-frontier-wave25-renal-acidbase-routing.js",
  "/data/pharm-frontier-wave26-antidote-causal-patch.js",
  "/data/pharm-frontier-wave28-antidote-expansion.js",
  "/data/pharm-frontier-wave29-antidote-expansion.js",
  "/data/pharm-frontier-wave30-antidote-expansion.js",
  "/data/pharm-frontier-wave31-antidote-expansion.js",
  "/data/pharm-frontier-wave32-antidote-expansion.js",
  "/data/pharm-frontier-wave33-antidote-expansion.js",
  "/data/pharm-frontier-wave34-antidote-expansion.js",
  "/data/clinical-frontier-wave26-pathology-nursing-patch.js",
  "/data/clinical-frontier-wave27-pathology-canonical-cleanup.js",
  "/data/clinical-frontier-wave27-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave27-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave28-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave28-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave29-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave29-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave30-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave30-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave31-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave31-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave32-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave32-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave33-pathology-nursing-cohort-a.js",
  "/data/clinical-frontier-wave33-pathology-nursing-cohort-b.js",
  "/data/clinical-frontier-wave33-pathology-nursing-cohort-c.js",
  "/data/clinical-frontier-wave33-pathology-nursing-cohort-d.js",
  "/data/clinical-frontier-wave34-pathology-distinctiveness-cohort-a.js",
  "/data/clinical-frontier-wave34-pathology-distinctiveness-cohort-b.js",
  "/data/clinical-frontier-wave34-pathology-distinctiveness-cohort-c.js",
  "/data/clinical-frontier-wave35-foundations-a.js",
  "/data/clinical-frontier-wave35-foundations-b.js",
  "/data/clinical-frontier-wave35-ten.js",
  "/data/clinical-frontier-wave36-pathology-a.js",
  "/data/clinical-frontier-wave36-diagnostics-b.js",
  "/data/clinical-frontier-wave36-pharm-c.js",
  "/data/clinical-frontier-wave37-neuro-a.js",
  "/data/clinical-frontier-wave37-diagnostics-b.js",
  "/data/clinical-frontier-wave37-clinical-c.js",
  "/data/clinical-frontier-wave38-critical-links.js",
  "/data/clinical-frontier-wave38-clinical-signs.js",
  "/data/clinical-frontier-wave38-vaccination.js",
  "/data/clinical-frontier-wave41-diabetes-core.js",
  "/data/clinical-frontier-wave41-diabetes-secondary.js",
  "/data/clinical-frontier-wave41-diabetes-monogenic.js",
  "/data/clinical-frontier-wave42-diseases.js",
  "/data/clinical-frontier-wave42-foundations-diagnostics.js",
  "/data/clinical-frontier-wave42-critical-care.js",
  "/data/pharm-frontier-wave42-procaine.js",
  "/data/clinical-frontier-wave44-heme-integrity.js",
  "/data/clinical-frontier-wave44-treatment-integrity.js",
  "/data/clinical-frontier-wave44-component-parity-p0.js",
  "/data/clinical-frontier-wave44-component-parity-p1.js",
  "/data/clinical-frontier-wave44-component-parity-p2.js",
  "/data/clinical-frontier-wave44-pharmacy-component-parity.js",
  "/data/pharm-frontier-wave26-antidote-routing.js",
  "/data/pharm-frontier-wave28-antidote-routing.js",
  "/data/pharm-frontier-wave29-antidote-routing.js",
  "/data/pharm-frontier-wave30-antidote-routing.js",
  "/data/pharm-frontier-wave31-antidote-routing.js",
  "/data/pharm-frontier-wave32-antidote-routing.js",
  "/data/pharm-frontier-wave33-antidote-routing.js",
  "/data/pharm-frontier-wave34-antidote-routing.js",
  "/data/clinical-frontier-wave35-intelligent-search-routing.js",
  "/data/high-yield-image-library.js",
  "/data/pharm-runtime-parity.js",
  "/manifest.webmanifest",
  "/offline.html",
  "/assets/ani-avatar.png",
  "/assets/microphone-icon.png",
  "/assets/risk-pregnancy.png",
  "/assets/risk-pediatric.png",
  "/assets/risk-geriatric.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_VERSION)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html").then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (request.method === "GET" && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (request.method === "GET" && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
