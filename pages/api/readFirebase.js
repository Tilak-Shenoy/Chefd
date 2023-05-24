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
  TableCell} from "@tremor/react";
import { useRouter } from 'next/router';
import { Button, Icon, InputRightElement, InputGroup, Input,
				 Card, CardHeader, CardBody, SimpleGrid  } from '@chakra-ui/react'
import { MdOutlineFoodBank, MdSearch } from 'react-icons/md'

import { Box, Text } from '@chakra-ui/react';


// Custom card to add green border onClick
const CustomCard = ({ ing, handleClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = () => {
    setIsSelected(!isSelected);
    handleClick(ing);
  };

  return (
    <Box
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'green.500' : 'gray.200'}
      rounded="md"
      p={4}
      mt = '8px'
      cursor="pointer"
      onClick={handleCardClick}
      _hover={{ shadow: 'md', 
  						transform: 'scale(1.1)' }}
      transition="transform 0.2s"
    >
      <Image src={ing.image} alt="Some edible food" width="160" height="72" />
      <Text size="md" align="center" mt={2}>
        {ing.name}
      </Text>
    </Box>
  );
};


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
		        const ingredients = data.docs.map((item) => ({ ...item.data(), key: item.id}));
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


 	const [selectedCards, setSelectedCards] = useState([]);
	const handleClick = (ingredient) => {

  	if (selectedCards.includes(ingredient.key)) {
   		//Deselect a card
      setSelectedCards((prevSelectedCards) => prevSelectedCards.filter((id) => id !== ingredient.key));
    	setPantry(pantry.filter(el=> el !== ingredient));
    } else {
    	//Select a card
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, ingredient.key]);
      if(!pantry.find(ele => ele.key === ingredient.key)){
  				setPantry([ ...pantry, ingredient ]);
  			}
    }

    console.log(pantry)
  };


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
					    <InputRightElement pointerEvents='pointer' width='6px'>
					    <Button className = {styles.greenBg} size = 'md' w='6px'
					      rightIcon = {<Icon as= {MdSearch} boxSize={4} color = 'black'/>}/>
					    </InputRightElement>
					    <Input type='search' placeholder='Search Ingredients' value = {value} onChange = {(e) => filterIngredients(e)}/>
					  </InputGroup>
	    		</div>
	    		<div className={styles.ing}>
		        	{Object.entries(groupIngArray).map(([category, ingredients]) => (
			        <div key={category} className={styles.category}>
			          <Text className={styles.w800} variant="title">
			            {category}
			          </Text>
			          <SimpleGrid spacing="24px" templateColumns="repeat(auto-fill, minmax(180px, 1fr))">
			            {ingredients.map((ing) => (
			              <CustomCard ing={ing} handleClick={handleClick} key={ing.id} />
			            ))}
			          </SimpleGrid>
        </div>
      ))}
				  </div>
    		</div>
    	</>
	)
}