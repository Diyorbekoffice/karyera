import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import Verification from "./auth/Verification";
import Respassword from "./auth/Respassword"; // ❗ Fayl nomi: Respassword.jsx
import Sentemail from "./auth/Sentemail";
// Avval: import LocationCreate from "./createUser/LocationCreate";
// Keyin: 
// import LocationCreate from "./createUser/locationCreate";
import CreateLocation from "./createUser/CreateLocation"
import Study from "./createUser/Study";
import Main from "./landingPage/Main";
import Work from "./createUser/Work";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import Connection from "./pages/Connection";
import MobileWarning from "./components/MobileWarning";
import PostMe from "./pages/PostMe";
import Friends from "./pages/Friends";
import Notifictions from "./pages/Notifictions";

function App() {
    return (
        <>
            <MobileWarning />
            <Routes>
                <Route path="/main" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/respassword" element={<Respassword />} />
                <Route path="/sentemail" element={<Sentemail />} />
                <Route path="/locationcreate" element={<CreateLocation />} />


                <Route path="/work" element={<Work />} />
                <Route path="/study" element={<Study />} />

                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/connection" element={<Connection />} />
                    <Route path="/postme" element={<PostMe />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/notifictions" element={<Notifictions />} />
                    
                </Route>
            </Routes>
        </>
    );
}

export default App;
