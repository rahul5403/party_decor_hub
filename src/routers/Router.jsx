import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DecorPage from "../Pages/DecorPage";
import ServicePage from "../Pages/ServicePage";
import DisposePage from "../Pages/DisposePage";
import ProductDetails from "../Pages/ProductDetails";
import Cart from "../Pages/Cart";
import About from "../Pages/About";
import Checkout from "../Pages/Checkout";
import WhatsAppButton from "../components/WhatsAppButton";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import NotFound from "../Pages/Notfound";
import Profile from "../Pages/Profile";
import DecorBook from "../components/DecorBook";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import RefundReturnPolicy from "../Pages/RefundReturnPolicy";
import ShippingPolicy from "../Pages/ShippingPolicy";
import TermsAndConditions from "../Pages/TermsCondition";
import InstagramButton from "../components/Insta";
import OrderConfirmation from "../Pages/OrderConfirmation";
import TrackOrder from '../Pages/TrackOrder';
import MyOrders from "../Pages/MyOrders";
import OrderDetails from "../Pages/OrderDetails";

const Router = () => {
  const location = useLocation();
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {!hideHeaderFooter && <Navbar onLoginClick={() => setShowLogin(true)} />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/party" element={<DecorPage/>}></Route>
        <Route
          path="/decoration"
          element={<ServicePage/>}
        ></Route>
        <Route
          path="/disposable"
          element={<DisposePage/>}
        ></Route>
        <Route
          path="/products/:product_id"
          element={<ProductDetails />}
        ></Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/services/:product_id" element={<DecorBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showSignup && (
        <SignUp
          onClose={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}


      {!hideHeaderFooter && <InstagramButton />}
      {!hideHeaderFooter && <WhatsAppButton />}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default Router;
