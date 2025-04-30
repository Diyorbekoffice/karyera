import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import Verification from "./auth/Verification";
import Respassword from "./auth/Respassword"; // ❗ Fayl nomi: Respassword.jsx
import Sentemail from "./auth/Sentemail";
// Avval: import LocationCreate from "./createUser/LocationCreate";
// Keyin: 
import LocationCreate from "./createUser/locationCreate"; // L katta harf // ❗ Fayl nomi: LocationCreate.jsx
import Study from "./createUser/Study";
import Main from "./landingPage/Main";
import Work from "./createUser/Work";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import Connection from "./pages/Connection";

function App() {
    return (
        <Routes>
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/respassword" element={<Respassword />} />
            <Route path="/sentemail" element={<Sentemail />} />
            <Route path="/locationcreate" element={<LocationCreate />} />
            <Route path="/work" element={<Work />} />
            <Route path="/study" element={<Study />} />

            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/connection" element={<Connection />} />
            </Route>
        </Routes>
    );
}

export default App;
