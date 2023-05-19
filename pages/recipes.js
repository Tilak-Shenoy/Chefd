import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { createApi } from 'unsplash-js';
import Image from 'next/image';
import { Heading, Text} from '@chakra-ui/react'

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
	})


	const unsplash = createApi({
	  accessKey: "9ITU33nvcP18iGsxY5_n_yWmv6xS-l8yKZD1Szs3xVg",
	});

	async function moveToPantry(){

		// Create a list of names of ingredients for passing to GPT API
		var ingNames =[]

		for(var x in pantry){
			console.log(pantry[x].name)
			ingNames.push(pantry[x].name)
		}

		console.log(ingNames)

		try {
	      const response = await fetch("/../api/gpt", {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	        },
	        body: JSON.stringify({ animal: ingNames }),
	      });

	      const data = await response.json();
	      if (response.status !== 200) {
	        throw data.error || new Error(`Request failed with status ${response.status}`);
	      }

	      console.log('Response ', data)
	      setResult(data.result.split(':'));
	      await getImg(data.result.split(':')[1].toString().slice(0,-12));
		    } catch(error) {
		      // Consider implementing your own error handling logic here
		      console.error(error);
		      alert(error.message);
		    }

		}

	useEffect(() => {
        moveToPantry();
    }, [])


	async function getImg(recipe){
			await unsplash.search.getPhotos({
				 query: recipe,
				 page: 1,
				 perPage: 1,
				 orientation: 'landscape'
			  }).then(result => {
			  if (result.errors) {
			    // handle error here
			    console.log('error occurred: ', result.errors[0]);
			  } else {
			    // handle success here
			   setIm(result.response);
			   console.log('Recipe: ', recipe)
			    console.log(im);
			  }
			});
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
  				<div>
		        	<div className = {styles.header}>
		          		<Heading className={styles.pointer} onClick = {() => router.push({
							    pathname: '/'})}> Chef'd</Heading>
		        	</div>
			        <div className={styles.recipeBody}>
			        	<Image className={styles.recipeImage} src={im.results[0].urls.regular} width={im.results[0].width/10}
		    			 height = {im.results[0].height/10}/>
				    	<Heading as='h3' mt='16px'>{result[1].toString().slice(0,-12)}</Heading>
				    	<Heading as='h4' size = 'md' mt = '8px'>{result[1].toString().slice(-11,-1)}</Heading>
				    	<Text>{result[2].toString().slice(0,-13)}</Text>
				    	<Heading as='h4' size='md' mt = '8px'>{result[2].toString().slice(-12,-1)}</Heading>
				    	<Text>{result[3]}</Text>
		        	</div>
	        	</div>
        	</main>
    	</div>

	)
}
