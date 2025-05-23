import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "./routers/Router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const {user, status } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (localStorage.getItem("accessToken") && !user && status !== "loading") {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, user, status]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Router />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;