import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
function Show_Feddback(){
  const [Feedback,setFeedback]=useState(null);
  const name=localStorage.getItem('username');
   useEffect(()=>{
   async function get_data(){
 
    try{
   const res=await axios.get(`${import.meta.env.VITE_API_URL}/user/get/student-feedback`,{params:{name},withCredentials:true});
   console.log(res.data)
    }
    catch(err){
        console.log(err);
    }

   }
   get_data();
   },[])

    return(
        <>
        <h1>helow</h1>
        </>
    )
}
export default Show_Feddback;