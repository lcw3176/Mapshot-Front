const resource = [
  /* --- CSS --- */
  '/blog/assets/css/jekyll-theme-chirpy.css',

  /* --- PWA --- */
  '/blog/app.js',
  '/blog/sw.js',

  /* --- HTML --- */
  '/blog/index.html',
  '/blog/404.html',

  
    '/blog/categories/',
  

  /* --- Favicons & compressed JS --- */
  
  
    '/blog/assets/img/favicons/android-chrome-192x192.png',
    '/blog/assets/img/favicons/android-chrome-512x512.png',
    '/blog/assets/img/favicons/apple-touch-icon.png',
    '/blog/assets/img/favicons/favicon-16x16.png',
    '/blog/assets/img/favicons/favicon-32x32.png',
    '/blog/assets/img/favicons/favicon.ico',
    '/blog/assets/img/favicons/mstile-150x150.png',
    '/blog/assets/js/dist/categories.min.js',
    '/blog/assets/js/dist/commons.min.js',
    '/blog/assets/js/dist/home.min.js',
    '/blog/assets/js/dist/misc.min.js',
    '/blog/assets/js/dist/page.min.js',
    '/blog/assets/js/dist/post.min.js'
];

/* The request url with below domain will be cached */
const allowedDomains = [
  

  'kmapshot.com',

  
    'avatars.githubusercontent.com',
  

  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net',
  'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [];

