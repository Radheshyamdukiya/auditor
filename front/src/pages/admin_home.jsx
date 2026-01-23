
import All_User from "./admin_all_user";
import Admin_Nev from "../components/admin_nev";
import User_Data_Upload from "../components/admin.user_data_upload";
import User_filter from "../components/admin_user_filter";
function Admin_home(){
return (
    <>
    <Admin_Nev/>
   <User_Data_Upload/>
   <User_filter/>
   
    </>
)
}
export default Admin_home;