import { useState, useEffect } from "react";
import UserContext from "./UserAuth";

const UserContextProvider = ({ children }) => {
const [data,setdata]=useState(()=>{
  return localStorage.getItem('user') || "";
})

useEffect(()=>{
  if(data){
     localStorage.setItem('user',data);
  }
else
  localStorage.removeItem('user');


},[data])
  return (
    <UserContext.Provider value={{ data, setdata }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
