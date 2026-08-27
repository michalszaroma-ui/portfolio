/* ==========================================================================
   script.js
   Behaviour for the Michal Szaroma portfolio.

   Everything here is progressive enhancement: if this file fails to load,
   the page still reads, scrolls and links out correctly. Only the extras
   are lost.

   Contents:
     1. Footer year
     2. Mobile navigation
     3. Scroll reveal
     4. Navigation scrollspy
     5. Timeline packet distance
     6. Contact form
   ========================================================================== */

/* The whole file is wrapped in an IIFE (Immediately Invoked Function
   Expression). Everything declared inside stays private instead of being
   attached to window, so nothing here can collide with a script added
   later. 'use strict' turns silent mistakes into visible errors. */
(function () {
  'use strict';


  /* ------------------------------------------------------------------------
     1. FOOTER YEAR
     Writes the current year into the copyright line so it never goes stale.
     ------------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();


  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION
     Shows and hides the dropdown menu below the md breakpoint, keeping the
     aria attributes in sync so screen readers report the correct state.
     ------------------------------------------------------------------------ */

  var toggle = document.getElementById('navToggle');
  var panel  = document.getElementById('mobileNav');

  /* Shared close routine, used by the link clicks and the Escape key. */
  function closeNav() {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    /* classList.toggle returns true when the class was ADDED, so when it
       returns false the panel has just become visible. */
    var isOpen = panel.classList.toggle('hidden') === false;

    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  /* Close the menu after a link is tapped, otherwise it stays open on top
     of the section the visitor just jumped to. */
  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* Escape closes the menu. Standard behaviour for any overlay, and the
     thing keyboard users try first. */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeNav();
    }
  });


  /* ------------------------------------------------------------------------
     3. SCROLL REVEAL
     Elements marked .reveal start faded and slightly low (see styles.css
     section 12). Adding .in triggers the transition.

     IntersectionObserver is used instead of a scroll event listener because
     the browser handles the geometry off the main thread, so it does not
     cost frame rate the way a scroll handler does.
     ------------------------------------------------------------------------ */

  var revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');

          /* Stop watching once revealed. The animation runs once, so
             continuing to observe would be wasted work. */
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,                     /* fire at 12% visible */
      rootMargin: '0px 0px -60px 0px'      /* wait until it is properly on
                                              screen, not just clipping the
                                              bottom edge */
    });

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {
    /* Fallback for any browser without IntersectionObserver: show everything
       immediately rather than leaving the page blank. */
    revealTargets.forEach(function (el) {
      el.classList.add('in');
    });
  }


  /* ------------------------------------------------------------------------
     4. NAVIGATION SCROLLSPY
     Underlines the nav link matching whichever section is currently in the
     middle of the viewport.
     ------------------------------------------------------------------------ */

  var sectionIds = ['about', 'labs', 'background'];

  /* Map each section id to its nav link so the observer can find the right
     one without querying the DOM on every scroll. */
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
          /* styles.css keys the underline off this attribute. */
          link.setAttribute('data-active', entry.isIntersecting ? 'true' : 'false');
        }
      });
    }, {
      /* Shrinking the observation box to a horizontal band across the middle
         of the screen means only one section can qualify at a time. Without
         this, two long sections would both count as visible. */
      rootMargin: '-45% 0px -50% 0px'
    });

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) {
        spy.observe(section);
      }
    });
  }


  /* ------------------------------------------------------------------------
     5. TIMELINE PACKET DISTANCE
     The glowing dot on the career timeline travels down using a CSS
     animation, but CSS cannot measure the timeline's height. This measures
     it and passes the value in as a custom property, then remeasures on
     resize because the cards get taller as the screen narrows.
     ------------------------------------------------------------------------ */

  var timeline = document.getElementById('timeline');

  if (timeline) {

    function setSpineHeight() {
      /* Minus 20px so the dot fades out just before the end of the line
         rather than overshooting past the last card. */
      var distance = timeline.offsetHeight - 20;
      document.documentElement.style.setProperty('--spine-h', distance + 'px');
    }

    setSpineHeight();
    window.addEventListener('resize', setSpineHeight);
  }


  /* ------------------------------------------------------------------------
     6. CONTACT FORM
     There is no server behind this page, so the form validates the input
     and then hands the message to the visitor's own mail client through a
     mailto link.

     If you later want messages delivered without opening a mail app,
     Netlify Forms will do it: add netlify and name="contact" to the form
     tag in index.html and delete the submit handler below.
     ------------------------------------------------------------------------ */

  var form       = document.getElementById('contactForm');
  var errorBox   = document.getElementById('formError');
  var RECIPIENT  = 'michalszaroma@gmail.com';

  /* Shows a validation message and moves focus to the field that needs
     fixing, so keyboard and screen reader users land in the right place. */
  function showError(message, field) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    if (field) {
      field.focus();
    }
  }

  form.addEventListener('submit', function (event) {

    /* Stop the browser doing its own submit and reloading the page. */
    event.preventDefault();

    /* Clear any error left over from a previous attempt. */
    errorBox.classList.add('hidden');

    /* trim() removes leading and trailing whitespace, so a field holding
       only spaces counts as empty. */
    var name    = form.name.value.trim();
    var email   = form.email.value.trim();
    var company = form.company.value.trim();
    var message = form.message.value.trim();

    /* Validation. Each check returns early, so only the first problem is
       reported. Fixing errors one at a time is less discouraging than
       being handed a list. */
    if (!name) {
      return showError('Add your name so I know who I am replying to.', form.name);
    }

    /* A deliberately loose email pattern: something, an @, something, a dot,
       and at least two more characters. Strict email regexes reject valid
       addresses, and the real test is whether the reply arrives. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return showError('That email address looks incomplete. Check it and try again.', form.email);
    }

    if (message.length < 10) {
      return showError('Add a little more detail to the message, at least 10 characters.', form.message);
    }

    /* Assemble the email body. \n is a line break in plain text. The company
       line is only included when the optional field was filled in. */
    var body =
      'From: ' + name + '\n' +
      (company ? 'Company: ' + company + '\n' : '') +
      'Email: ' + email + '\n\n' +
      message;

    /* encodeURIComponent escapes spaces, line breaks and any special
       characters so they survive the trip through the URL. Skipping this
       would truncate the message at the first ampersand or hash. */
    var mailtoUrl =
      'mailto:' + RECIPIENT +
      '?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
      '&body='    + encodeURIComponent(body);

    /* Hands off to the operating system, which opens the default mail app. */
    window.location.href = mailtoUrl;
  });

})();
