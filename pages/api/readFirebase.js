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
import { Button, Icon } from '@chakra-ui/react'
import { MdOutlineFoodBank } from 'react-icons/md'


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
		        const ingredients = data.docs.map((item) => ({ ...item.data(), key: item.id }));
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

    function addToPantry(event, ingredient){
    	if(event.target.checked === true) {
    		if(!pantry.find(ele => ele.key === ingredient.key)){
  				setPantry([ ...pantry, ingredient ]);
  			}
    	} else {
    		setPantry(pantry.filter(el=> el !== ingredient));
    	}

    	console.log(pantry)
  		
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
					          <TableRow key={ingredient.id}>
					          	<TableCell>
					          		<input type="checkbox" id="checkbox" onClick= {(event) =>addToPantry(event, ingredient)}/>
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