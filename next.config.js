// next.config.js

const withPWA = require('next-pwa')

module.exports = withPWA({
  images: {
    domains: ['images.ctfassets.net'],
  },
  pwa: {
    dest: 'public',
  },
})
