import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { createApi } from 'unsplash-js';
import Image from 'next/image';
import { Heading, Text, Button, Icon } from '@chakra-ui/react'
import { coffeeIcon } from '../public/coffee'
import Link from 'next/link'

export default function Recipe() {


	const [result, setResult] = useState(['','','',''])
	const [ingredientNames, setIngredientNames] = useState([])

	const router = useRouter();
	const { data } = router.query;
  	const pantry = data ? JSON.parse(data) : null;

	const [im, setIm] = useState({
		results: [
				{
					'width':72,
					'height': 72,
					'urls': {
						'regular': ''
					}
				}
			]
	});

	async function loadRecipe(){

		// Create a list of names of ingredients for passing to GPT API
		var ingNames =[]

		for(var x in pantry){
			console.log(pantry[x].name)
			ingNames.push(pantry[x].name)
		}

		try {
	      const response = await fetch("/../api/gpt", {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	        },
	        body: JSON.stringify({ ingredients: ingNames }),
	      });

	      const data = await response.json();
	      if (response.status !== 200) {
	        throw data.error || new Error(`Request failed with status ${response.status}`);
	      }

	      console.log('Response ', data)
	      setResult(data.result.split(':'));

	      // Generate image from DallE
	      await getImg(data.result.split(':')[1].toString().slice(0,-12));
		    } catch(error) {
		      // Consider implementing your own error handling logic here
		      console.error(error);
		      alert(error.message);
		    }

		}

	useEffect(() => {
        loadRecipe();
    }, [])


	async function getImg(recipe){
			
		try {
	      const response = await fetch("/../api/dalle", {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	        },
	        body: JSON.stringify({ prompt: recipe }),
	      });

	      const data = await response.json();
	      if (response.status !== 200) {
	        throw data.error || new Error(`Request failed with status ${response.status}`);
	      }
	      setIm(data.photo)

		    } catch(error) {
		      // Consider implementing your own error handling logic here
		      console.error(error);
		      alert(error.message);
		    }
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
		          		<Heading className={styles.pointer} onClick = {() => router.push({
							    pathname: '/'})}> Chef'd</Heading>
		        	</div>
			        <div className={styles.recipeBody}>
			        	<Image className={styles.recipeImage} src={im} width={512}
		    			 height = {512} alt = {result[1].toString().slice(0,-12)}/>
				    	<Heading as='h3' mt='16px'>{result[1].toString().slice(0,-12)}</Heading>
				    	<Heading as='h4' size = 'md' mt = '8px'>{result[1].toString().slice(-11,-1)}</Heading>
				    	<Text>{result[2].toString().slice(0,-13)}</Text>
				    	<Heading as='h4' size='md' mt = '8px'>{result[2].toString().slice(-12,-1)}</Heading>
				    	<Text>{result[3]}</Text>
		        	</div>
        	</main>

        	<div className={styles.fabBottom}>
            <Link href = "https://www.buymeacoffee.com/tilakshenoy">
            <Button  size="md" variant = 'solid' className = {styles.greenText} mt='72px'
                leftIcon = {<Icon as={coffeeIcon}  boxSize={6} color = 'black' />}>Buy me a coffee</Button>
             </Link>
          </div>

    	</div>

	)
}
