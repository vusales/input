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
import Button from '@mui/material/Button';


const FormulaInputComponent  = () => {

  const [ textResult , setTextResult ] = useState(""); 
  const [ result , setResult ] = useState(0); 

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
    // clearTimeout(inputTimer) ; 
    // const inputTimer = setTimeout(() => {
    //   calculateResult();
    // }, 1000);  
  };

  const handleSelect = (selectedItem) => { 
    console.log("selectedItem" , selectedItem ); 
    let text ; 
    if(typeof selectedItem == "object") {
      addSelectedCategory(selectedItem);
      text =  `${textResult} ${selectedItem.value } ` ; 
    }else {
      handleAddOperator(selectedItem); 
      text = `${textResult} ${selectedItem} `  ;
    }
    setInputValue("");
    setTextResult(text); 
  };

  const handleDelete = (categoryToDelete) => {
    removeSelectedCategory(categoryToDelete);
  };

  const handleAddOperator = (operator) => {
    addOperator(operator); 
  }

  const calculateResult = () => {
    let result = eval(textResult) ; 
    setResult(result); 
  }


  return (
    <div>
      <Downshift
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onSelect={handleSelect}
        itemToString={(item) => (item ? item.name : '')}
      >
        {
          ({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
            initialSelectedItem , 
          }) =>{ 
            return (
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
                {isOpen ?
                <>
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
                  </Paper>

                  <Paper>
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
                            // onClick: () => handleAddOperator(item) , 
                          })}
                        >
                        {item}
                        </MenuItem>
                      ))
                    }
                  </Paper>
                </> 
                 : null}
              </div>
            </div>
          )}
        }
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
              usedOperators&&usedOperators.length>0?
              usedOperators.map((oprt, indexOprt)=>{ 
                if(index == indexOprt) {
                  return (
                    <Chip
                      key={`some${oprt.index}${indexOprt}`}
                      label={oprt.operator}
                      onDelete={() => {}}
                      style={{ margin: '2px' }}
                    />
                  )
                }
              })
              :null
            }
          </>
        ))}
      </div>

      <div style={{marginTop: "10px"}}>{result||""}</div>

      <Button 
      onClick={() => calculateResult() } 
      variant="outlined" 
      sx={{marginTop: "10px"}}
      >Calculate</Button>

    </div>
  );
};

export default FormulaInputComponent ;
