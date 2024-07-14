// stores/useAutocompleteStore.js
import { create } from 'zustand'; 


const formulaInputStore = create((set) => ({

    categories: [],
    inputValue: '',
    selectedCategories : [] ,
    usedOperators: [] ,  

    setInputValue: (value) => set({ inputValue: value }),
    setCategories: (value) => {
        set({categories: value}) ; 
    },
    addSelectedCategory: ( selectedCat ) => set((state) =>{  
        // console.log(state); 
        // const alreadyExists = state.selectedCategories.find((cat) => cat.id === selectedCat.id);

        // if (!alreadyExists) {
            return { selectedCategories: [...state.selectedCategories, selectedCat] };
        // }

        // return { selectedCategories: [...state.selectedCategories] };
    }),
    removeSelectedCategory: (removedCat) => set((state) => {
      const newCategories = state.selectedCategories.filter(({id}) => id !== removedCat.id );
      return { selectedCategories: newCategories };
    }),
    addOperator: (operator) => set(
        (state) =>{
            let length =  state.usedOperators.length ;  
            let index = length + 1 ; 
            return  {usedOperators : [...state.usedOperators , { index , operator } ] }
        }
    ),  
    editOPerator: (editedOPerator) =>set(
        state => {
            let newOpArray =  state.usedOperators.map((item ) => {
                if( item.index === editedOPerator.index ){
                    item.operator = editedOPerator.operator ;   
                }
            })
            return {usedOperators: newOpArray }
        }
    )
    
}));

export default formulaInputStore;
