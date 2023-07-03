import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import Image from 'next/image';
import { Heading, Text, Button, Icon, Progress, 
	SimpleGrid, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { coffeeIcon } from '../public/coffee'
import Link from 'next/link'

export default function RecipeDetails() {
	const router = useRouter();
	const { data } = router.query;
	const spareRecipe = {
		"image": "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
		"title": "Placeholder Title",
		"ingredients": ["Placeholder ingredients"],
		"instructions": ["Placeholder ingredients"],
		"cookTime": 'Placeholder time',
		"prepTime": 'Placeholder time',
		"difficulty": "Easy"
	}
  	const recipeDetail = data ? JSON.parse(data) : spareRecipe;

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
	        		<Image className={styles.recipeImage} src={recipeDetail.image}
	        		 width='480'
	    			 height = '480'
	    			 placeholder = "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
	    			 alt = {recipeDetail.title}/>
			    	<Heading as='h3' mt='16px'>{recipeDetail.title}</Heading>
			    	<Heading as='h7' size='sm' mt = '24px' color ='green'>Difficulty</Heading>
			    	<Text>{recipeDetail.difficulty}</Text>
			    	<Heading as='h7' size='sm' mt = '8px' color ='green'>Prep Time</Heading>
			    	<Text>{recipeDetail.prepTime}</Text>
			    	<Heading as='h7' size='sm' mt = '8px' color ='green'>Cook Time</Heading>
			    	<Text>{recipeDetail.cookTime}</Text>
			    	<Heading as='h4' size = 'md' mt = '8px'>Ingredients</Heading>
			    	{recipeDetail.ingredients.map((ing) => (
			    		<Text>{ing}</Text>
			    	))}
			    	<Heading as='h4' size='md' mt = '8px'>Instructions</Heading>
			    	{recipeDetail.instructions.map((instrct) => (
			    	<Text>{instrct}</Text>
			    	))}
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