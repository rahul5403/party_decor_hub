import React, { useState, useEffect } from "react";
import "../assets/styles/PincodeModal.css";
import { useDispatch } from "react-redux";
import { setPincode } from "../redux/pincodeSlice";

const PincodeModal = () => {
  const [pincode, setPincodeInput] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  const validPincodes = ["110001", "110002", "110003", "110004", "110005"]; // Example valid Delhi NCR pincodes

  useEffect(() => {
    const savedPincode = sessionStorage.getItem("userPincode");
    if (savedPincode) {
      setIsOpen(false);
    }
  }, []);

  const handleSubmit = () => {
    if (validPincodes.includes(pincode)) {
      dispatch(setPincode(pincode));
      sessionStorage.setItem("userPincode", pincode);
      setIsOpen(false);
    } else {
      setError("Sorry, we only provide services in Delhi NCR.");
    }
  };

  return isOpen ? (
    <div className="pincode-modal">
      <div className="modal-content">
        <h2>Enter Your Pincode</h2>
        <p>Currently, our decoration services are available in Delhi NCR only.</p>
        <input
          type="text"
          placeholder="Enter your pincode"
          value={pincode}
          onChange={(e) => setPincodeInput(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Check Availability</button>
      </div>
    </div>
  ) : null;
};

export default PincodeModal;
