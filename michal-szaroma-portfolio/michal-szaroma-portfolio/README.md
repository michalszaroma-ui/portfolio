# Personal portfolio :: Michal Szaroma

Static portfolio site for a BSc (Hons) Computing student at National College of
Ireland, moving from six years of logistics operations into cybersecurity and
infrastructure.

**Live site:** https://REPLACE-WITH-YOUR-URL/

![Social preview](assets/img/og-image.png)

## What this is

A hand written single page site. No framework, no build step, no dependencies to
install. Clone it, open `index.html`, and it runs.

## Built with

| Layer | Choice | Why |
| --- | --- | --- |
| Markup | Semantic HTML5 | Landmarks, real headings, labelled form controls |
| Styling | Tailwind CSS via CDN, plus a custom stylesheet | Utility classes for layout, hand written CSS for the effects Tailwind cannot express |
| Behaviour | Vanilla JavaScript | Roughly 150 lines, no libraries |
| Graphics | Inline SVG | Icons and illustrations ship as markup, so there are no image requests and they inherit the current text colour |
| Hosting | GitHub Pages | Deploys on push |

## Structure

```
index.html            the page
404.html              styled not-found page
robots.txt            crawler rules
sitemap.xml           page list for search engines
assets/
  css/styles.css      custom styling, sectioned and commented
  js/script.js        navigation, scroll reveal, form handling
  img/                portrait, icons, social preview card
```

Every path in the site is relative, so it works served from a domain root or
from a `/repository-name/` subfolder.

## Notable details

- **Accessibility.** Skip link, visible keyboard focus rings, `aria-expanded`
  kept in sync on the mobile menu, real `<label>` elements on every input, and a
  `prefers-reduced-motion` block that disables all animation for anyone who has
  asked their operating system for less movement.
- **Performance.** No JavaScript framework and no web font blocking render.
  Animations run on `transform` and `opacity` so the compositor handles them.
  Scroll effects use `IntersectionObserver` rather than scroll event listeners.
- **Progressive enhancement.** If `script.js` fails to load the page still
  reads, scrolls and links out correctly. Only the extras are lost.
- **Contact form.** No backend. The form validates input, then hands the message
  to the visitor's own mail client via a `mailto:` link. To collect submissions
  properly instead, add `netlify` and `name="contact"` to the form element and
  remove the submit handler in `script.js`.

## Running locally

Open `index.html` in a browser. That is all.

One caveat: some browsers block relative image loads over the `file://`
protocol, which can leave the hero portrait blank. If that happens, serve the
folder over HTTP instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before publishing

Search the repository for `REPLACE-WITH-YOUR-URL` and swap in the real address.
It appears in four places:

1. `index.html` :: `og:url`, `og:image` and `canonical`
2. `robots.txt` :: the sitemap line
3. `sitemap.xml` :: the `loc` element
4. this README

Social previews will not render until `og:image` is an absolute URL.

Once live, submit the site in Google Search Console. A new GitHub Pages site with
no inbound links can otherwise take months to appear in search results.

## Swapping the portrait

`assets/img/profile.jpg` is the image at the centre of the hero graphic. Three
alternate treatments sit beside it (`profile-alt-mono.jpg`,
`profile-alt-light.jpg`, `profile-alt-deep.jpg`). Rename one over
`profile.jpg` to switch. Square images work best; anything else gets cropped
from the centre.

## Licence

Code is free to reuse and adapt. Personal content, photographs and written copy
are not.
