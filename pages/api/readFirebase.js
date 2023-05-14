import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
	Button} from "@tremor/react";
import {Configuration, OpenAIApi} from 'openai';
import { app, database } from './initFirebase';
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';

// 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 - My openai key

const dbInstance = collection(database, 'ing');
export default function IngredientOperation() {

	const [ingArray, setIngArray] = useState([])
	const [groupIngArray, setGroupIngArray] = useState([])
	const [pantry, setPantry] = useState([])
	

	const router = useRouter();
 

	const getIng = async() => {
		if (ingArray.length === 0) {
		    getDocs(dbInstance)
		      .then((data) => {
		        const ingredients = data.docs.map((item) => ({ ...item.data(), id: item.id }));
		        setIngArray(ingredients);
		        setGroupIngArray(ingredients.reduce((group, product) => {
		          const { category } = product;
		          group[category] = group[category] ?? [];
		          group[category].push(product);
		          return group;
		        }, {}));
		    });
		}

	};

	useEffect(() => {
        getIng();
    }, [])

    function addToPantry(ingredient){
    	const newObj = {};
  		newObj[ingredient.id] = ingredient;
		setPantry(prevObject => ({ ...prevObject, ...newObj }));
		console.log(pantry)
	}

    return (
    	<>
	    	<div>
	    		<div>
	    			<Button color = "blue" className = {styles.button} size="sm" 
	    				onClick = {() => router.push({
							    pathname: '/recipes',
							    query: {pantry}
							})}>Pantry</Button>
	    		</div>
	    		<div className={styles.ing}>
	    			{Object.entries(groupIngArray).map(([category, ingredients]) => (
					  <div key={category} className={styles.category}>
					    <Text className = {styles.w600} variant="title">{category}</Text>
					    <Table>
					      <TableBody>
					        {ingredients.map((ingredient) => (
					          <TableRow key={ingredient.id} onClick= {() =>addToPantry(ingredient)}>
					          	<TableCell>
					          		<input type="checkbox" id="checkbox"/>
					          	</TableCell>
					            <TableCell>
					              <Image src={ingredient.image} width={72} height={72}  />
					            </TableCell>
					            <TableCell>
					              <Text>{ingredient.name}</Text>
					            </TableCell>
					          </TableRow>
					        ))}
					      </TableBody>
					    </Table>
					  </div>
					))}
	    		</div>
    		</div>
    	</>
	)
}