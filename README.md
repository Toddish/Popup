# Popup.js

---

A barebones, flexible jQuery popup plugin. Designed for developers, it's simple to use but very powerful.

---

## Features

* Barebones - it only has what it absolutely needs, the rest is up to you
* Automatically detects images, external sites, inline content and ajax content
* It can also cope with raw HTML, functions, jQuery...
* Plus custom content types. (Think YouTube, Vimeo etc.)
* Lightweight - ~1.7kb minified and gzipped
* Made to be customized - callbacks and options aplenty
* Fully styled with CSS, make it look however you want
* Handles loading errors intelligently

---

## Installation

Place `/assets/css/popup.css` in `/your/css/folder/`.

Add this just before your closing `head` tag:

```html
<link rel="styesheet" href="/your/css/folder/popup.css">
```

Then, place `/assets/js/jquery.popup.min.js` in `/your/js/folder/`.

Add this just before your closing `body` tag, after you've included jQuery:

```html
<script src="/your/js/folder/jquery.popup.min.js"></script>
```

---

## Usage

Set up your html:

```html
<a href="http://placehold.it/350x175.png" class="popup">Popup link</a>
```

Call the plugin:

```javascript
var options = {};
$('a.popup').popup(options);
```

---

## Documentation

For full documentation, have a look at [http://docs.toddish.co.uk/popup](http://docs.toddish.co.uk/popup).
