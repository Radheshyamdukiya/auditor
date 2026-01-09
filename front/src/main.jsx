import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserContextProvider from '../context/UserAuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeInit } from "../.flowbite-react/init";
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <UserContextProvider>
        <ThemeInit/>
        <App/>
    </UserContextProvider>
</BrowserRouter>


     
 
  
)
