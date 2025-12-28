 import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/home";
import Login from "../src/pages/login";
import Admin from "../src/pages/admin";
import Admin_home from "../src/pages/admin_home";
import Link_List from "../src/pages/userlist";
import Admin_User_Option from "../src/pages/admin_user_option";
function User_Route(){
return(
    <>
    <Routes>
        <Route path="/" element={<Login/>} />
 <Route path="/home" element={<Home/>} />
 <Route path="/admin" element={<Admin/>} />
 <Route path="/admin/home" element={<Admin_home/>}  />
 <Route path="admin/user/:title" element={<Link_List/>} />
 <Route path="admin/user/option" element={<Admin_User_Option/>} />
     </Routes>
    </>
)
}
export default User_Route;