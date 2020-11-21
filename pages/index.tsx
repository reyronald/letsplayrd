import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import * as contentful from 'contentful'

import styles from '../styles/Home.module.css'

type Game = {
  name: string
  description: string
  alt: string
  date: string
  image: Array<contentful.Asset>
}

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
})

export default function Home() {
  async function fetchEntries() {
    const entries = await client.getEntries<Game>()
    if (entries.items) return entries.items
  }

  const [games, setGames] = React.useState<contentful.Entry<Game>[]>([])

  React.useEffect(() => {
    async function getGames() {
      const allGames = await fetchEntries()
      if (allGames) {
        setGames([...allGames])
      }
    }
    getGames()
  }, [])

  async function onSendEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const emailNode = form.elements.namedItem('email')
    if (emailNode && emailNode instanceof HTMLInputElement) {
      const email = emailNode.value
      const payload = { email }
      try {
        const response = await fetch('/api/sendEmail', {
          headers: {
            'Content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          alert(
            `Correo enviado exitosamente. Revise su bandeja de entrada en ${email}.`,
          )
        } else {
          const text = await response.text()
          const json = safeJSONparse(text)
          const fetchError = new FetchError({
            status: response.status,
            statusText: response.statusText,
            text,
            json,
          })
          throw fetchError
        }
      } catch (error) {
        console.error({ error })
        alert('Ha ocurrido un error, no se ha logrado enviar el correo.')
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Let's Play RD</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Let's play RD</h1>

        <p className={styles.description}>Bienvenido</p>

        <p className={styles.description}>
          Recibe un correo de prueba colocando tu direcció debajo
        </p>

        <form className={styles.form} onSubmit={onSendEmail}>
          <input
            type="email"
            id="email"
            name="email"
            required={true}
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            className={styles.emailInput}
          />
          <button type="submit" className={styles.button}>
            Enviar correo
          </button>
        </form>

        <div className={styles.grid}>
          {games.map((game) => {
            const img = game.fields.image[0]
            if (!img) {
              return null
            }
            return (
              <article key={game.sys.id} className={styles.article}>
                <Image
                  alt={game.fields.alt}
                  src={`https:${img.fields.file.url}`}
                  width={img.fields.file.details.image?.width || 0}
                  height={img.fields.file.details.image?.height || 0}
                />
                <h2>{game.fields.name}</h2>
                <p>{game.fields.description}</p>
              </article>
            )
          })}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}

function safeJSONparse<T>(text: string): T | null {
  try {
    const parsed = JSON.parse(text)
    return parsed
  } catch (error) {
    return null
  }
}

class FetchError extends Error {
  status: number
  statusText: string
  text: string
  json: unknown

  constructor(arg: {
    status: number
    statusText: string
    text: string
    json: unknown
  }) {
    super(arg.statusText)

    this.status = arg.status
    this.statusText = arg.statusText
    this.text = arg.text
    this.json = arg.json
  }
}
