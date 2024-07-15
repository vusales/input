"use client"
import React, { 
  useEffect, 
  useState , 
} from 'react';
import Downshift from 'downshift';
import { TextField, Chip, Paper, MenuItem } from '@mui/material';
import formulaInputStore from '@/app/stores/formulaInputStore';
import { getCategories } from '@/app/api/categoriesApi';
import { useQuery } from 'react-query';


const FormulaInputComponent  = () => {

  const [ result , setresult ] = useState(""); 

  const { 
    categories, 
    inputValue, 
    setInputValue, 
    selectedCategories, 
    addSelectedCategory, 
    removeSelectedCategory ,
    setCategories ,
    usedOperators , 
    addOperator , 
    editOPerator ,  
  } = formulaInputStore();

  const query = useQuery({
    queryKey: ["categories"] ,
    queryFn: async () => {
      let categories = await getCategories() ; 
      return categories ; 
    },
  });
        
  useEffect(() => {
    if(query.isSuccess&&query.data){
      setCategories(query.data); 
    }
  }, [query.isSuccess]);
 

  const handleInputChange = (event) => {
    const value = event.target.value;
    // setInputValue(value);
    try {
      const result = eval(value); // Perform calculation
      // setCalculatedValue(result);
    } catch {
      // setCalculatedValue('');
    }
  };

  const handleSelect = (selectedItem) => { 
    addSelectedCategory(selectedItem);
    setInputValue("");
  };

  const handleDelete = (categoryToDelete) => {
    removeSelectedCategory(categoryToDelete);
  };


  const handleDeleteOPerator = () => {

  }

  const handleAddOperator = (operator) => {
    addOperator(operator); 
  }

  console.log("usedOP"  , usedOperators ); 


  return (
    <div>
      <Downshift
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onSelect={handleSelect}
        itemToString={(item) => (item ? item.name : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
        }) => (
          <div>
            <TextField
              {...getInputProps({
                placeholder: 'Enter category or math operation',
                onChange: handleInputChange,
              })}
              fullWidth
              variant="outlined"
            />
            <div {...getMenuProps()}>
              {isOpen ? (
                <Paper>
                  {categories
                    .filter((item) => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
                    .map((item, index) => (
                      <MenuItem
                        {...getItemProps({
                          key: item.id,
                          index,
                          item,
                          style: {
                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          },
                        })}
                      >
                        {item.name}
                      </MenuItem>
                    ))
                  }

                  {
                    ["/" , "*" , "+" , "-"].filter((item) => !inputValue || item.toLowerCase().includes(inputValue.toLowerCase()))
                    .map((item, index) => (
                      <MenuItem
                        {...getItemProps({
                          key: index ,
                          index,
                          item,
                          style: {
                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          },
                          onClick: () => handleAddOperator(item) , 
                        })}
                      >
                       {item}
                      </MenuItem>
                    ))
                  }

                </Paper>
              ) : null}
            </div>
          </div>
        )}
      </Downshift>
      <div style={{ marginTop: '10px' }}>
        {selectedCategories?.map((category, index) => (
          <>

            <Chip
              key={`some${category.id}${index}`}
              label={category.name}
              onDelete={() => handleDelete(category)}
              style={{ margin: '2px' }}
            />

            { 
              usedOperators.map(( operator , indexOP )=>{
                if(operator.index == index) {
                  return(
                    <Chip
                      key={`opera${operator.index}${indexOP}`}
                      label={operator.operator}
                      onDelete={() => handleDeleteOPerator(operator)}
                      style={{ margin: '2px' }}
                    />
                  )
                }
              })
            }

          </>
        ))}
      </div>
       <button onClick={() => setCalculatedValue(eval(inputValue))} style={{ marginTop: '10px' }}>Calculate</button>
      {/* {calculatedValue && (
        <div>
          <strong>Result:</strong> {calculatedValue}
        </div>
      )} */}
    </div>
  );
};

export default FormulaInputComponent ;
