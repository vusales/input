import axios from "axios";

export const getCategories = async () => {
    try {
        let result =  await axios.get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'); 
        if(result?.data?.length<0) return [] ; 
        return result.data ; 
    } catch (error) {
        console.log("error while getting categories" ,  error );    
    }
}