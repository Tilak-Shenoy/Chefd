import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { Card, CardHeader, CardBody, CardFooter, Stack, Heading, Text,
		 Button, ButtonGroup, SimpleGrid } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image';
import {RiDeleteBinFill} from 'react-icons/ri'
import { Icon } from '@chakra-ui/react'
import { MdOutlineFastfood } from 'react-icons/md'

export default function Pantry() {

	const router = useRouter();
	const { data } = router.query;
  	const pantry = data ? JSON.parse(data) : [];
  	const [ingPantry, setIngPantry] = useState([]);
  	

  	function deleteIngredient(ing) {
  		setIngPantry(oldValues => {
      		return oldValues.filter(ingred => ingred !== ing)
  		})
  	}

  	useEffect(() => {
  		setIngPantry(pantry);
    }, [])

	return(
		<>
	    <div className={styles.container}>
	    	<Head>
	        	<title>Chef\'d</title>
	        	<meta name="description" content="Pantry" />
        	</Head>

    	<main className={styles.main}>
	        <div className = {styles.header}>
	          <Heading className={styles.pointer} onClick = {() => router.push({
								    pathname: '/'})}> Chef'd</Heading>
	        </div>

	        <div className={styles.fabDiv}>
				<Button colorScheme = "dark green" className = {styles.button} size="md" mt = '3vh' 
					leftIcon = {<Icon as={MdOutlineFastfood}  boxSize={6} />}
					onClick = {() => router.push({
						    pathname: '/recipes',
						    query: { data: JSON.stringify(ingPantry) }
						})}>Start Cooking</Button>
    		</div>

        	<SimpleGrid spacing= {1} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
	        	{ingPantry.map((ing) => (
		          	<Card size='sm' maxW='20vh' mt='4vh' align ='center' key= {ing.key}>
					  	<CardBody>
						    <Image
						      src= {ing.image}
						      alt='Some edible food'
						      width = '160'
						      height = '72'
						    />
						      <Text size='md' align='Center'>{ing.name}</Text>
					  </CardBody>
					  <CardFooter>
					      <Button variant='solid' colorScheme='red'
					       rightIcon = {<Icon as={RiDeleteBinFill} />}
					       onClick = {() => deleteIngredient(ing)}>
					        Delete
					      </Button>
					  </CardFooter>
					</Card>
				))}
			</SimpleGrid>
      </main>
    </div>
	</>

		)
}