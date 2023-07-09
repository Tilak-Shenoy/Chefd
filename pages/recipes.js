import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import Image from 'next/image';
import { Heading, Text, Button, Icon, Progress, 
	SimpleGrid, Card, CardHeader, CardBody, CardFooter, useToast } from '@chakra-ui/react'
import { coffeeIcon } from '../public/coffee'
import Link from 'next/link'
import { cache } from 'memory-cache';

export default function Recipe() {


	const [result, setResult] = useState([{'image': "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"},
										  {'image': "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"},
										  {'image': "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"},
										])
	const [ingredientNames, setIngredientNames] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const router = useRouter();
	const { data } = router.query;
	const {cuisine} = router.query;
  	const pantry = data ? JSON.parse(data) : null;
  	const cacheKey = JSON.stringify({ ingredients: pantry, cuisine });
  	var cache = require('memory-cache');
	const toast = useToast()

	async function loadRecipe(cacheKey){
		// Create a list of names of ingredients for passing to GPT API
		var ingNames =[]

		for(var x in pantry){
			ingNames.push(pantry[x].name)
		}

		try {
	      const response = await fetch("/../api/gpt", {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	        },
	        body: JSON.stringify({ ingredients: ingNames }, { cuisine: cuisine}),
	      });

	      const data = await response.json();
	      if (response.status !== 200) {
	        throw data.error || new Error(`Request failed with status ${response.status}`);
	      }
	      if(data.result != undefined){
	      		const formattedResult = await formatRecipes(data.result)
	      		setResult(formattedResult)
	      		cache.put(cacheKey, formattedResult, 1000 * 60 * 10);
	      }
		    } catch(error) {
		      // Consider implementing your own error handling logic here
		      console.error(error);
		      alert(error.message);
		    }

		}

		function showRecipes(recipe) {
			// Avoid user to click on the card before loading the recipe
			if(!cache.get(cacheKey)){
				console.log('error')
		  		return (
		  			toast({
		          title: 'Your pantry is empty!',
		          description: "You can't cook anything if you don't tell us what you got.",
		          status: 'error',
		          duration: 5000,
		          isClosable: true,
		        })
			)
			}
			if(!recipe.isVisted){
				recipe.ingredients = recipe.ingredients.split('\n')
				recipe.instructions = recipe.instructions.split('\n')
				recipe.isVisted = true
			}
			router.push({
			    pathname: '/recipeDetails',
			    query: { data: JSON.stringify(recipe) }
		 		 })	
		}

	useEffect(() => {
		const fetchData = async () => {
		    const cachedResult = cache.get(cacheKey);
		    if (cachedResult) {
	        	setResult(cachedResult);
	      	} else {
        		loadRecipe(cacheKey);	
	      	}
	      	toast.closeAll();
	      	 return (
	      	 	toast({
		          title: 'Your recipes are loading',
		          description: "Please wait for up to a minute while we load your recipes",
		          status: 'info',
		          duration: 10000,
		          isClosable: true,
        		}))
	      };

	      fetchData();
    }, [])


  // Generate image from DallE
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
	      if(data !== null){
	      	return data.photo;
	      }

	    } catch(error) {
	      // Consider implementing your own error handling logic here
	      console.error(error);
	      alert(error.message);
	    }
			
		}


	async function formatRecipes(data){
		var recipes = [];
		var recipeSplitData = data.split('@recipe');
		for(var i=1;i<=3;i++) {
			var recipe_i =  recipeSplitData[i].split(':')
			var recipe = {
				"title": recipe_i[0].split('\nP')[0].trim(),
				"prepTime": recipe_i[1].split("\n")[0].trim(),
				"cookTime": recipe_i[2].split('\n')[0].trim(),
				"difficulty": recipe_i[3].split('\n\n')[0].trim(),
				"ingredients": recipe_i[4].split('\n\n')[0].trim(),
				// "optional": recipe_i[5].split('\n\n')[0],
				"instructions": recipe_i[5].trim(),
				"image": await getImg(recipe_i[0].split('\nP')[0].trim()),
				//used for formatting purposes
				"isVisited": false
				
				
				
			}

			recipes.push(recipe);
			if(i==3){
	      		setIsLoading(false)
			}
		}
		return recipes;
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
		        <div className={styles.recipeList}>
		        	{isLoading && <Progress size='sm' colorScheme = "green" isIndeterminate />}
		        	<SimpleGrid spacing= {4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' mt = '8px' ml = '24px'>
	        	{result.map((recipe) => (
		          	<Card size='sm' maxW='720vh' mt='16vh' align ='center'
		          		key= {recipe.title} _hover={{ shadow: 'md', 
  						transform: 'scale(1.1)' }}
      					transition="transform 0.2s"
						cursor="pointer"
						onClick={() => showRecipes(recipe)}>
					  	<CardBody>
						    <Image
						      src= {recipe.image}
						      alt='Some edible food'
						      width = '320'
						      height = '144'
						      placeholder = 'blur'
						      blurDataURL='https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
						    />
						      <Text size='xl' align='Center' as='b'>{recipe.title}</Text>
					  </CardBody>
					  <CardFooter>
					      <Text size='sm' align='Left' color='green'>Prep Time {recipe.prepTime}</Text>
					      <Text size='sm' align='Right' color='green'>Cook Time {recipe.cookTime}</Text>
					  </CardFooter>
					</Card>
				))}
			</SimpleGrid>
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
