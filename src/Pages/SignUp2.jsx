import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../assets/styles/SignUp2.css";

const SignUp2 = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signing up:", { fullName, email, phone, password });
    navigate("/home");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Token:", credentialResponse.credential);
    // Send this token to your backend for verification
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="74027685761-uao4u2m2ibpo6j5t2ate76ebf6e1knur.apps.googleusercontent.com">
      <div className="parent">
        <div className="signup-container">
          {/* Left Section - Image & Text */}
          <div className="signup-left">
            <h2>Luxury & Comfort Redefined</h2>
            <p>
              Discover elegantly designed spaces, top-tier amenities, and an
              unforgettable stay at Decor Hub. Your perfect getaway starts here.
            </p>
          </div>

          {/* Right Section - Signup Form */}
          <div className="signup-right">
            <div>
              <h3 className="wlcm">Welcome to Decor Hub</h3>
            </div>
            <div className="form-container">
              <form onSubmit={handleSignup}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button type="submit" className="signup-btn">
                  Sign Up
                </button>

                <div className="divider">or</div>
                <div className="google-login-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                <p className="signup-link">
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp2;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/styles/SignUp2.css";
// import googleIcon from "../assets/images/google_icon.webp";

// const SignUp2 = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     console.log("Signing up:", { fullName, email, phone, password });
//     navigate("/home");
//   };

//   return (
//     <div className="parent">
//       <div className="signup-container">
//         {/* Left Section - Image & Text */}
//         <div className="signup-left">
//           <h2>Luxury & Comfort Redefined</h2>
//           <p>
//             Discover elegantly designed spaces, top-tier amenities, and an unforgettable stay at Decor Hub. Your perfect getaway starts here.
//           </p>
//         </div>

//         {/* Right Section - Signup Form */}
//         <div className="signup-right">
//           <div>
//             <h3 className="wlcm">Welcome to Decor Hub</h3>
//           </div>

//           <div className="form-container">
//             <form onSubmit={handleSignup}>
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 required
//               />

//               <label>Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />

//               <label>Phone Number</label>
//               <input
//                 type="tel"
//                 placeholder="Enter your phone number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//               />

//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />

//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />

//               <button type="submit" className="signup-btn">Sign Up</button>

//               <div className="divider">or</div>

//               <button className="google-signup">
//                 {/* <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Icon" /> */}
//                 <img src={googleIcon} alt="Google Icon" />
//                 Sign up with Google
//               </button>

//               <p className="signup-link">
//                 Already have an account? <a href="/login">Login here</a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp2;
