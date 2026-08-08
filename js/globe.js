/* ============================================================
   Interactive conference globe — light "Claude" styling.
   Data comes from data/conferences.js (window.CONFERENCES).
   Rendering by globe.gl, loaded from CDN in conferences.html.
   ============================================================ */

(function () {
  'use strict';

  /* palette — keep in sync with css/style.css */
  var CLAY        = '#D97757';
  var CLAY_TEXT   = '#A8482A';
  var GLOBE_FILL  = '#FBFAF6';  // ocean / sphere
  var LAND_FILL   = '#E6DECC';  // country polygons
  var LAND_STROKE = '#C2B69C';
  var LABEL_INK   = 'rgba(25, 25, 23, 0.78)';

  var COUNTRIES_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json';

  var confs = (window.CONFERENCES || []).slice().sort(function (a, b) {
    return (b.year || 0) - (a.year || 0);
  });
  var home = window.HOME_BASE;

  var stage   = document.getElementById('globe-stage');
  var vizEl   = document.getElementById('globe-viz');
  var loading = document.getElementById('globe-loading');
  var listEl  = document.getElementById('conf-list');
  var banner  = document.getElementById('placeholder-banner');
  var countEl = document.getElementById('conf-count');

  /* ---------- summary line + placeholder warning ---------- */

  function distinct(key) {
    return confs.reduce(function (set, c) {
      if (c[key] && set.indexOf(c[key]) === -1) set.push(c[key]);
      return set;
    }, []);
  }

  var cities = distinct('city');
  var countries = distinct('country');

  if (countEl) {
    var line = confs.length + ' conference' + (confs.length === 1 ? '' : 's') +
      ' across ' + cities.length + ' cit' + (cities.length === 1 ? 'y' : 'ies');
    if (countries.length > 1) {
      line += ' in ' + countries.length + ' countries';
    }
    countEl.textContent = line + '.';
  }

  var hasPlaceholders = confs.some(function (c) { return c.placeholder; });
  if (banner) banner.style.display = hasPlaceholders ? '' : 'none';

  /* ---------- the list under the globe ---------- */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // "Denver, CO" / "Hamburg, Germany"
  function place(c) {
    return c.region ? c.city + ', ' + c.region : c.city;
  }

  function isInvited(c) {
    return /invited/i.test(c.role || '');
  }

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = '';

    confs.forEach(function (c) {
      var row = document.createElement('div');
      row.className = 'conf-row';
      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', 'Show ' + c.name + ' on the globe');

      var role = c.role || '';
      if (c.title) role += (role ? ' — ' : '') + '“' + c.title + '”';
      if (c.placeholder) role += (role ? ' · ' : '') + 'unverified';

      row.innerHTML =
        '<div class="conf-date">' + esc(c.date || '') + '</div>' +
        '<div>' +
          '<p class="conf-name">' + esc(c.name) + '</p>' +
          (role ? '<p class="conf-role">' + esc(role) + '</p>' : '') +
        '</div>' +
        '<div class="conf-city">' + esc(place(c)) + '</div>';

      function go() { focusOn(c); }
      row.addEventListener('click', go);
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });

      listEl.appendChild(row);
    });
  }

  /* ---------- globe ---------- */

  var globe = null;

  function focusOn(c) {
    if (!globe) return;
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: c.lat, lng: c.lng, altitude: 0.85 }, 900);
    stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function tooltip(c) {
    return '<div class="globe-tip">' +
      '<div class="t-name">' + esc(c.name) + '</div>' +
      '<div class="t-city">' + esc(place(c)) +
        (c.date ? ' · ' + esc(c.date) : '') + '</div>' +
      (c.role ? '<div class="t-role">' + esc(c.role) +
        (c.title ? ': “' + esc(c.title) + '”' : '') + '</div>' : '') +
      (c.venue ? '<div class="t-role">' + esc(c.venue) + '</div>' : '') +
      '</div>';
  }

  function sizeGlobe() {
    if (!globe || !stage) return;
    globe.width(stage.clientWidth).height(stage.clientHeight);
  }

  /* Warm cream sphere, evenly lit — no photographic Earth texture, so it
     sits in the light page instead of punching a dark hole in it. */
  function styleSphere() {
    try {
      var m = globe.globeMaterial();
      m.color.set(GLOBE_FILL);
      m.emissive.set('#E9E3D6');
      m.emissiveIntensity = 0.5;
      m.shininess = 0;
    } catch (e) {
      /* material shape changed upstream — plain default sphere is fine */
    }
  }

  /* Country outlines. Optional: if the CDN is unreachable we keep the
     plain cream sphere rather than failing the page. */
  function addCountries() {
    if (typeof fetch !== 'function' || typeof topojson === 'undefined') return;

    fetch(COUNTRIES_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (topo) {
        var feats = topojson.feature(topo, topo.objects.countries).features;
        globe
          .polygonsData(feats)
          .polygonCapColor(function () { return LAND_FILL; })
          .polygonSideColor(function () { return 'rgba(194, 182, 156, 0.35)'; })
          .polygonStrokeColor(function () { return LAND_STROKE; })
          .polygonAltitude(0.008);
      })
      .catch(function () { /* cream sphere, no outlines — still fine */ });
  }

  function initGlobe() {
    // CDN blocked or offline — the list below still works.
    if (typeof Globe !== 'function') {
      if (loading) {
        loading.textContent = 'Globe could not load — the conference list below still works.';
      }
      return;
    }

    globe = Globe()(vizEl)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor(CLAY)
      .atmosphereAltitude(0.1)

      // pins
      .pointsData(confs)
      .pointLat('lat').pointLng('lng')
      .pointColor(function () { return CLAY; })
      // invited talks get a taller, fatter pin
      .pointAltitude(function (d) { return isInvited(d) ? 0.1 : 0.055; })
      .pointRadius(function (d) { return isInvited(d) ? 0.44 : 0.32; })
      .pointLabel(tooltip)
      .onPointClick(focusOn)

      // city labels
      .labelsData(confs)
      .labelLat('lat').labelLng('lng')
      .labelText(function (d) { return d.city; })
      .labelSize(0.52)
      .labelDotRadius(0)
      .labelAltitude(0.075)
      .labelColor(function () { return LABEL_INK; })
      .labelResolution(2)
      .labelLabel(tooltip)
      .onLabelClick(focusOn)

      // pulsing rings
      .ringsData(confs)
      .ringLat('lat').ringLng('lng')
      .ringColor(function () {
        return function (t) { return 'rgba(217, 119, 87, ' + (1 - t) + ')'; };
      })
      .ringMaxRadius(3)
      .ringPropagationSpeed(1.3)
      .ringRepeatPeriod(1600);

    // arcs from Duke out to each conference
    if (home) {
      globe
        .arcsData(confs.map(function (c) { return { from: home, to: c }; }))
        .arcStartLat(function (d) { return d.from.lat; })
        .arcStartLng(function (d) { return d.from.lng; })
        .arcEndLat(function (d) { return d.to.lat; })
        .arcEndLng(function (d) { return d.to.lng; })
        .arcColor(function () {
          return ['rgba(217, 119, 87, 0.12)', 'rgba(168, 72, 42, 0.75)'];
        })
        .arcStroke(0.32)
        .arcAltitudeAutoScale(0.4)
        .arcDashLength(0.4)
        .arcDashGap(0.9)
        .arcDashAnimateTime(2800);
    }

    styleSphere();
    addCountries();
    sizeGlobe();

    var controls = globe.controls();
    controls.autoRotate = !prefersReducedMotion();
    controls.autoRotateSpeed = 0.42;
    controls.enableZoom = true;
    controls.minDistance = 160;
    controls.maxDistance = 700;

    // Frame the North Atlantic so the US and European pins are both visible.
    globe.pointOfView({ lat: 46, lng: -45, altitude: 2.4 }, 0);

    // Any manual interaction stops the auto-spin for good.
    ['mousedown', 'touchstart', 'wheel'].forEach(function (evt) {
      stage.addEventListener(evt, function () {
        controls.autoRotate = false;
      }, { passive: true, once: true });
    });

    if (loading) loading.classList.add('hidden');
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- go ---------- */

  renderList();

  if (window.ResizeObserver && stage) {
    new ResizeObserver(sizeGlobe).observe(stage);
  } else {
    window.addEventListener('resize', sizeGlobe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }

  // If the CDN is slow, don't leave the loading panel up forever.
  setTimeout(function () {
    if (loading && !loading.classList.contains('hidden') && globe) {
      loading.classList.add('hidden');
    }
  }, 8000);
})();
