import Head from 'next/head'
import styles from '../styles/Home.module.css'
import firebase from "../pages/api/initFirebase"
import ReadFirebase from "../pages/api/readFirebase"
import { Title } from "@tremor/react";
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chef'd</title>
        <meta name="description" content="Generate Recipes" />
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,900;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className = {styles.header}>
          <h2> Chef'd</h2>
        </div>
        <div className={styles.div}>
          <ReadFirebase IngredientOperation/>
          <Analytics />
        </div>
      </main>
    </div>
  )

}