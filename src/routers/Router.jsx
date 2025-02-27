import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Service1 from "../Pages/Service1";
import Service2 from "../Pages/Service2";
import Service3 from "../Pages/Service3";
import ProductDetails from "../Pages/ProductDetails";
import Cart from "../Pages/Cart";
import { decorationData, disposalData, partyData } from "../data/data";
import About from "../Pages/About";
import Checkout from "../Pages/Checkout";
import WhatsAppButton from "../components/WhatsAppButton";
import Login2 from "../Pages/Login2";
import SignUp2 from "../Pages/SignUp2";
import NotFound from "../Pages/Notfound";
import Profile from "../Pages/Profile";
import Orders from "../Pages/Orders";
import DecorBook from "../components/DecorBook";
import PincodeModal from "../components/PincodeModal";

const Router = () => {
    const location = useLocation();
    const [cart, setCart] = useState([
        {
            id: 7,
            image: "https://placehold.co/50x50", // Replace with actual image URL
            title: "Decorative Plates",
            description: "Stylish and sustainable essentials.",
            price: 60,
            quantity: 1
        }
    ]);
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false); 

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

    return (
        <div>
            {!hideHeaderFooter && (
                <Navbar
                    onLoginClick={() => setShowLogin(true)}                    
                    />
            )}
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/party" element={<Service1 data={partyData} />}></Route>
                <Route path="/decoration" element={<Service2 data={decorationData}/>}></Route>
                <Route path="/disposable" element={<Service3 data={disposalData}/>}></Route>
                <Route path="/product/:productId" element={<ProductDetails addToCart={addToCart}/>}></Route>
                <Route
                    path="/cart"
                    element={
                        <Cart
                            cart={cart}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                        />
                    }
                />
                <Route path="/checkout" element={<Checkout />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/login" element={<Login2 />}></Route>
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/decor/:productId" element={<DecorBook />} />
                <Route path="/pincode" element={<PincodeModal/>}/>
                <Route path="*" element={<NotFound />} />
            </Routes>

            {showSignup && (
                <SignUp2
                    onClose={() => setShowSignup(false)}
                    onLoginClick={() => {
                        setShowSignup(false); 
                        setShowLogin(true); 
                    }}
                />
            )}

            {showLogin && (
                <Login2
                    onClose={() => setShowLogin(false)}
                    onSignupClick={() => {
                        setShowLogin(false); 
                        setShowSignup(true); 
                    }}
                />
            )}

            {!hideHeaderFooter && <WhatsAppButton />}
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

export default Router;