
import User_Route from "../router/User.route";
import { Toaster } from "react-hot-toast";
function App(){
    return (
        <>
              <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
        }}
      />

        <User_Route/>

        </>
    )
}
export default App;