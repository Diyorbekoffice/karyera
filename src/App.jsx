import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import Verification from "./auth/Verification";
import Respassword from "./auth/ResPassword";
import Sentemail from "./auth/Sentemail";
import LocationCreate from "./createUser/locationCreate";
import Study from "./createUser/Study";
import Main from "./landingPage/Main";
import Work from "./createUser/Work";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";

function App() {
    return (
        <Routes>
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/respassword" element={<Respassword />} />
            <Route path="/sentemail" element={<Sentemail />} />
            <Route path="/locationCreate" element={<LocationCreate />} />
          
            <Route path="/work" element={<Work />} />
            <Route path="/study" element={<Study />} />

            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
            </Route>


            
        </Routes>
    );
}

export default App;
