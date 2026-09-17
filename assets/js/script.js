(function () {
  'use strict';

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Mobile navigation */
  var toggle = document.getElementById('navToggle');
  var panel  = document.getElementById('mobileNav');

  function closeNav() {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    var isOpen = panel.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  /* Scroll reveal */
  var revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('in');
    });
  }

  /* Navigation scrollspy */
  var sectionIds = ['about', 'labs', 'background'];

  var navLinks = {
    about:      document.querySelector('a[href="#about"].nav-link'),
    labs:       document.querySelector('a[href="#labs"].nav-link'),
    background: document.querySelector('a[href="#background"].nav-link')
  };

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (link) {
          link.setAttribute('data-active', entry.isIntersecting ? 'true' : 'false');
        }
      });
    }, {
      rootMargin: '-45% 0px -50% 0px'
    });

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) {
        spy.observe(section);
      }
    });
  }

  /* Timeline packet distance */
  var timeline = document.getElementById('timeline');

  if (timeline) {
    function setSpineHeight() {
      var distance = timeline.offsetHeight - 20;
      document.documentElement.style.setProperty('--spine-h', distance + 'px');
    }

    setSpineHeight();
    window.addEventListener('resize', setSpineHeight);
  }

  // Contact form. Posts to the shared Apps Script backend, with mailto as a
  // fallback if the request fails. Do not add a Content-Type header to the
  // fetch, or the browser sends a preflight Apps Script cannot answer.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzhg-xEK6CcXGCT258LMYA1ZQ1EK6ciVCxklUbZ_CU9QnL2oKmCtJ1GzsQpITay7yF1/exec';

  var form     = document.getElementById('contactForm');
  var errorBox = document.getElementById('formError');
  var button   = form ? form.querySelector('button[type="submit"]') : null;
  var RECIPIENT = 'michalszaroma@gmail.com';

  function showError(message, field) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    errorBox.classList.remove('text-cyan');
    errorBox.classList.add('text-rose-300');
    if (field) {
      field.focus();
    }
  }

  function showSuccess(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    errorBox.classList.remove('text-rose-300');
    errorBox.classList.add('text-cyan');
  }

  function mailtoFallback(name, email, company, message) {
    var body =
      'From: ' + name + '\n' +
      (company ? 'Company: ' + company + '\n' : '') +
      'Email: ' + email + '\n\n' +
      message;

    window.location.href =
      'mailto:' + RECIPIENT +
      '?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
      '&body='    + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      errorBox.classList.add('hidden');

      var name    = form.name.value.trim();
      var email   = form.email.value.trim();
      var company = form.company.value.trim();
      var message = form.message.value.trim();

      if (!name) {
        return showError('Add your name so I know who I am replying to.', form.name);
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return showError('That email address looks incomplete. Check it and try again.', form.email);
      }

      if (message.length < 10) {
        return showError('Add a little more detail to the message, at least 10 characters.', form.message);
      }

      var payload = new FormData();
      payload.append('source', 'portfolio');
      payload.append('name', name);
      payload.append('email', email);
      payload.append('company', company);
      payload.append('message', message);

      if (button) {
        button.disabled = true;
        button.classList.add('opacity-60');
      }
      showSuccess('Sending...');

      fetch(ENDPOINT, { method: 'POST', body: payload, headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) { throw new Error('bad response'); }
          form.reset();
          showSuccess('Thank you. Your message is on its way, I will reply shortly.');
        })
        .catch(function () {
          showError('Could not send directly. Opening your mail app instead.');
          mailtoFallback(name, email, company, message);
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.classList.remove('opacity-60');
          }
        });
    });
  }

})();
