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
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react'
import { MdOutlineFoodBank } from 'react-icons/md'
import { Icon } from '@chakra-ui/react'


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
  		// newObj[ingredient.id] = ingredient;
  		if(!pantry.find(ele => ele.id === ingredient.id)){
  			setPantry([ ...pantry, ingredient ]);
  		}
	}


    return (
    	<>
	    	<div>
	    		<div className={styles.fabDiv}>
	    			<Button colorScheme = "dark green" className = {styles.button}  size="md" mt = '3vh' 
	    				leftIcon = {<Icon as={MdOutlineFoodBank}  boxSize={6} />}
	    				onClick = {() => router.push({
							    pathname: '/pantry',
							    query: { data: JSON.stringify(pantry) }
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