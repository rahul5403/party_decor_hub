import React, { useState, useEffect } from "react";
import "../assets/styles/PincodeModal.css";
import { useDispatch } from "react-redux";
import { setPincode } from "../redux/pincodeSlice";

const PincodeModal = () => {
  const [pincode, setPincodeInput] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  const validPincodes = [
    "110001", "110002", "110003", "110004", "110005", "110006", "110007", "110008", "110009", "110010",
    "110011", "110012", "110013", "110014", "110015", "110016", "110017", "110018", "110019", "110020",
    "110021", "110022", "110023", "110024", "110025", "110026", "110027", "110028", "110029", "110030",
    "110031", "110032", "110033", "110034", "110035", "110036", "110037", "110038", "110039", "110040",
    "110041", "110042", "110043", "110044", "110045", "110046", "110047", "110048", "110049", "110050",
    "110051", "110052", "110053", "110054", "110055", "110056", "110057", "110058", "110059", "110060",
    "110061", "110062", "110063", "110064", "110065", "110066", "110067", "110068", "110069", "110070",
    "110071", "110072", "110073", "110074", "110075", "110076", "110077", "110078", "110079", "110080",
    "110081", "110082", "110083", "110084", "110085", "110086", "110087", "110088", "110089", "110090",
    "110091", "110092", "110093", "110094", "110095", "110096", "110097", "110098", "110099", "110100"
  ];
  

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

  const handleClose = () => {
    setIsOpen(false);
  };

  return isOpen ? (
    <div className="pincode-modal">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>&times;</button>
        <h2>Enter Your Pincode</h2>
        <p>Currently, our decoration services are available in Delhi NCR only.</p>
        <input
          type="text"
          placeholder="Enter your pincode"
          value={pincode}
          onChange={(e) => setPincodeInput(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button className="submit-button" onClick={handleSubmit}>Check Availability</button>
      </div>
    </div>
  ) : null;
};

export default PincodeModal;