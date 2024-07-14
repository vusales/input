"use client"
import React from 'react'; 
import { QueryClient, QueryClientProvider } from 'react-query';
import FormulaInputComponent from '../FormulaInputComponent';

const queryClient = new QueryClient();

const HomeInputComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <FormulaInputComponent
        />
    </QueryClientProvider>
  )
}

export default HomeInputComponent; 