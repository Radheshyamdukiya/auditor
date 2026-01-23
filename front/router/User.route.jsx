 import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/home";
import Login from "../src/pages/login";
import Admin from "../src/pages/admin";
import Admin_home from "../src/pages/admin_home";
import Link_List from "../src/pages/admin_user_video";
import Admin_User_Option from "../src/pages/admin_user_option";
import Show_Feddback from "../src/pages/admin_student_rating";
function User_Route(){
return(
    <>
    <Routes>
        <Route path="/" element={<Login/>} />
 <Route path="/home" element={<Home/>} />
 <Route path="/admin" element={<Admin/>} />
 <Route path="/admin/home" element={<Admin_home/>}  />
 <Route path="admin/user" element={<Link_List/>} />
 <Route path="admin/user/option" element={<Admin_User_Option/>} />
 <Route path='admin/user/feedback' element={<Show_Feddback/>} />
     </Routes>
    </>
)
}
export default User_Route;