import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { firebase, auth } from "./api/initFirebase"
import ReadFirebase from "../pages/api/readFirebase"
import { Analytics } from '@vercel/analytics/react';
import { Heading, Button, Icon, HStack } from '@chakra-ui/react'
import { coffeeIcon } from '../public/coffee'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {


  const [user, setUser] = useState(null);
  const { data, status } = useSession();

  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    if(user === null){
      loadUser(data.user)
    }
  }


  function loadUser(userDetails) {
    console.log('Set')
    setUser(userDetails);
  }

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
            <HStack className = {styles.nav} spacing='72px'>
              <Heading> Chef'd</Heading>
              
            </HStack>
          </div>
          <div> 
            <ReadFirebase IngredientOperation/>
            <Analytics />
          </div>
          <div className={styles.fabBottom}>
            <Link href = "https://www.buymeacoffee.com/tilakshenoy">
            <Button  size="md" variant = 'solid' className = {styles.greenText} mt='72px'
                leftIcon = {<Icon as={coffeeIcon}  boxSize={6} color = 'black' />}>Buy me a coffee</Button>
             </Link>
          </div>
        </main>
      </div>
  )


}