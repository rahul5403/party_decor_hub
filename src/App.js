import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from "./routers/Router";
// import { Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Router />} />
        </Routes>
        {/* <Toaster position="top-center" reverseOrder={false} /> */}
        <ToastContainer />
      </BrowserRouter>
      

    </div>
  );
}

export default App;
