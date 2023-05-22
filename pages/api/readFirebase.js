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
import { Button, Icon, InputRightElement, InputGroup, Input  } from '@chakra-ui/react'
import { MdOutlineFoodBank, MdSearch } from 'react-icons/md'


const dbInstance = collection(database, 'ing');
export default function IngredientOperation() {

	const [ingArray, setIngArray] = useState([])
	const [groupIngArray, setGroupIngArray] = useState([])
	const [pantry, setPantry] = useState([])
	const [value, setValue] = useState('')
	const [temp, setTemp] = useState()

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
  		
	}

	function filterIngredients(e) {
		setValue(e.target.value)
		var filtered = ingArray.filter((product) => product.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
		if(value === '') {
			setGroupIngArray(ingArray.reduce((group, product) => {
        const { category } = product;
        group[category] = group[category] ?? [];
        group[category].push(product);
        return group;
      }, {}));

		} else {
			setGroupIngArray(filtered.reduce((group, product) => {
				const { category } = product;
        group[category] = group[category] ?? [];
        group[category].push(product);
        return group;
  		}, {}));
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
	    		<div className = {styles.search}>
	    			<InputGroup>
					    <InputRightElement pointerEvents='pointer' width='6.5rem'>
					    	
					    <Button className = {styles.greenBg} size = 'md'
					      rightIcon = {<Icon as= {MdSearch} color = 'black'/>}> Search </Button>
					    </InputRightElement>
					    <Input type='search' placeholder='Search Ingredients' value = {value} onChange = {(e) => filterIngredients(e)}/>
					  </InputGroup>
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