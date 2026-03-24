import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "./store/authSlice"; // Assurez-vous d'avoir créé cette action

import Header from "./Header/Header";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Transaction from "./Transaction/Transaction";
import Home from "./Home";
import Dash from "./Dashboard/Dashboard";
import Footer from "./Footer/Footer";
import Profile from "./Profile";
import Budget from "./budget/budget";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // 👉 On demande à Laravel les infos du profil car on a un token
            // Cela va remplir le state.auth.user et isLoggedIn passera à true
            dispatch(getProfile()); 
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            {/* Le Header écoute maintenant Redux, il se mettra à jour tout seul */}
            <Header />
            
            <main className="min-h-[80vh]"> {/* Optionnel: assure un min-height pour le footer */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Dashboard" element={<Dash />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Transaction" element={<Transaction />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/Budget" element={<Budget />} />
                </Routes>
            </main>

            <Footer />
        </BrowserRouter>
    );
}