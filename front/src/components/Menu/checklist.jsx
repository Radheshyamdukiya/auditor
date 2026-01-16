/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";


function CheckList(){
    const [data,setdata]=useState();

   async function addclick(){
    try{
        const res=await axios.post(`${import.meta.env.VITE_API_URL}/user/check-list`,"hellow");
        console.log(res);
    }
    catch(err){
        console.log(err);
    }
    }

    return(
        <>
        <h1>CheckList</h1>
        <button onClick={addclick} >click me</button>
        </>
    )
}
export default CheckList;