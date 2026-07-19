(function () {
  document.documentElement.classList.add('has-js');
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- View router (no reload) ---------------- */
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var navAll = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var VALID = views.map(function (v) { return v.getAttribute('data-view'); });

  function viewName() {
    var h = (location.hash || '').replace('#', '');
    return VALID.indexOf(h) !== -1 ? h : 'home';
  }

  function showView(name) {
    var target = document.querySelector('.view[data-view="' + name + '"]');
    if (!target) { name = 'home'; target = document.querySelector('.view[data-view="home"]'); }
    views.forEach(function (v) { v.classList.remove('active'); });
    target.classList.add('active');
    // active nav state
    navAll.forEach(function (a) {
      a.classList.toggle('active-link', a.getAttribute('data-nav') === name);
    });
    // reveal everything in this view
    target.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    // jump to top (header stays sticky)
    window.scrollTo(0, 0);
    // update document title for context
    document.title = (name === 'home' ? 'Abstract Concrete & Flooring Solutions' :
      name.charAt(0).toUpperCase() + name.slice(1) + ' — Abstract Concrete & Flooring Solutions');
    closeMenu();
  }

  window.addEventListener('hashchange', function () { showView(viewName()); });

  /* ---------------- Header shadow ---------------- */
  var header = document.getElementById('top');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  });

  /* ---------------- Mobile menu ---------------- */
  var burger = document.getElementById('burger');
  var mm = document.getElementById('mobileMenu');
  function closeMenu() { if (mm) { mm.classList.remove('open'); burger.classList.remove('on'); } }
  if (burger) {
    burger.addEventListener('click', function () {
      mm.classList.toggle('open'); burger.classList.toggle('on');
    });
  }

  /* ---------------- Gallery tabs / filtering ---------------- */
  var galTabs = document.getElementById('gal-tabs');
  if (galTabs) {
    var galItems = Array.prototype.slice.call(document.querySelectorAll('#gallery-grid figure'));
    var galEmpty = document.getElementById('gal-empty');
    var grid = document.getElementById('gallery-grid');
    galTabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.gal-tab');
      if (!btn) return;
      galTabs.querySelectorAll('.gal-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      grid.classList.toggle('filtered', f !== 'all');
      var shown = 0;
      galItems.forEach(function (fig) {
        var cats = (fig.getAttribute('data-cat') || '').split(' ');
        var match = f === 'all' || cats.indexOf(f) !== -1;
        fig.style.display = match ? '' : 'none';
        if (match) { fig.classList.remove('animate'); void fig.offsetWidth; fig.classList.add('animate'); shown++; }
      });
      galEmpty.style.display = shown ? 'none' : 'block';
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  var faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q) return;
      var item = q.parentElement;
      var isOpen = item.classList.contains('open');
      faqList.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------------- Lightbox ---------------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  document.querySelectorAll('#gallery-grid figure').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = fig.querySelector('img');
      lbImg.src = img ? img.src : fig.getAttribute('data-src');
      lb.classList.add('open');
    });
  });
  function closeLb() { lb.classList.remove('open'); }
  var lbClose = document.getElementById('lb-close');
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---------------- Estimate form ---------------- */
  var CONTACT_EMAIL = 'Tom.Miller@abstractflooringsolutions.com';
  var SMS_NUMBER = '+19803625422';
  var tfWrap = document.getElementById('timeframe');
  if (tfWrap) {
    var tfVal = document.getElementById('timeframe-val');
    var dateInput = document.getElementById('tf-date-input');
    var dateLabel = document.getElementById('tf-date-label');
    var dateWrap = document.getElementById('tf-date-wrap');
    var clearTf = function () {
      tfWrap.querySelectorAll('.tf-opt').forEach(function (o) { o.classList.remove('sel'); o.setAttribute('aria-checked', 'false'); });
    };
    tfWrap.querySelectorAll('button.tf-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        clearTf(); b.classList.add('sel'); b.setAttribute('aria-checked', 'true');
        tfVal.value = b.getAttribute('data-val'); dateLabel.textContent = 'Pick a specific date';
      });
    });
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.addEventListener('click', function (e) { e.stopPropagation(); });
    dateInput.addEventListener('change', function () {
      if (!dateInput.value) return;
      var d = new Date(dateInput.value + 'T00:00:00');
      var fmt = d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
      clearTf(); dateWrap.classList.add('sel'); dateWrap.setAttribute('aria-checked', 'true');
      dateLabel.textContent = fmt; tfVal.value = 'Target date: ' + fmt;
    });

    var fv = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    var buildLines = function () {
      return [
        'New Free Estimate Request',
        'Name: ' + (fv('name') || '-'),
        'Phone: ' + (fv('phone') || '-'),
        'Email: ' + (fv('email') || '-'),
        'Address: ' + (fv('address') || '-'),
        'Project: ' + (fv('service') || '-'),
        'Approx. sq ft: ' + (fv('sqft') || '-'),
        'Timeframe: ' + (fv('timeframe-val') || '-'),
        'Details: ' + (fv('msg') || '-')
      ];
    };
    var showSuccess = function () {
      document.getElementById('estimate-form').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    };
    var estForm = document.getElementById('estimate-form');
    estForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var subject = 'Free Estimate Request' + (fv('name') ? ' — ' + fv('name') : '');
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildLines().join('\n'));
      showSuccess();
    });
    var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (matchMedia('(pointer:coarse)').matches && innerWidth < 820);
    var textBtn = document.getElementById('text-instead');
    if (isMobile && textBtn) {
      textBtn.style.display = 'flex';
      textBtn.addEventListener('click', function () {
        if (!estForm.reportValidity()) return;
        window.location.href = 'sms:' + SMS_NUMBER + '?&body=' + encodeURIComponent(buildLines().join('\n'));
        showSuccess();
      });
    }
  }

  /* ---------------- Init ---------------- */
  showView(viewName());
})();
