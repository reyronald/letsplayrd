import React from 'react'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    if ('serviceWorker' in window.navigator) {
      window.addEventListener('load', () => {
        window.navigator.serviceWorker
          .register('/service-worker.js')
          .then(function (registration) {
            console.log(
              'Registration successful, scope is:',
              registration.scope,
            )
          })
          .catch(function (error) {
            console.log('Service worker registration failed, error:', error)
          })
      })
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
