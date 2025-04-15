import './App.css'
import React from 'react';
import AppLayout from './components/AppLayout';
 import { CryptoContextProvider } from '../src/context/crypto-context' 



export default function App() {
  return (
    <CryptoContextProvider>
      <AppLayout />
    </CryptoContextProvider>
  )
}

