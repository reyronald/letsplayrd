import React from "react";
import Head from "next/head";
import Image from "next/image";
import * as contentful from "contentful";

import styles from "../styles/Home.module.css";

type Game = {
  name: string;
  description: string;
  alt: string;
  date: string;
  image: Array<contentful.Asset>;
};

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
});

export default function Home() {
  async function fetchEntries() {
    const entries = await client.getEntries<Game>();
    if (entries.items) return entries.items;
  }

  const [games, setGames] = React.useState<contentful.Entry<Game>[]>([]);

  React.useEffect(() => {
    async function getGames() {
      const allGames = await fetchEntries();
      if (allGames) {
        setGames([...allGames]);
      }
    }
    getGames();
  }, []);

  console.log({ games });

  return (
    <div className={styles.container}>
      <Head>
        <title>Let's Play RD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Let's play RD</h1>

        <p className={styles.description}>Bienvenido</p>

        <div className={styles.grid}>
          {games.map((game) => {
            const img = game.fields.image[0];
            if (!img) {
              return null;
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
            );
          })}

          {/* <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a> */}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
