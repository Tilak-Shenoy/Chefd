import { collection, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from '../api/initFirebase';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/Home.module.css'
import { Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text} from "@tremor/react";



const dbInstance = collection(database, 'ing');
export default function IngredientOperation() {

	const [ingArray, setIngArray] = useState([])
	const [groupIngArray, setGroupIngArray] = useState([])
	const [pantry, setPantry] = useState([])


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
    	// setPantry((prev) => {...prev, ..newObj})
		setPantry(prevObject => ({ ...prevObject, ...newObj }));
		console.log(pantry)
	}


    return (
    	<>
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
    	</>
	)
}