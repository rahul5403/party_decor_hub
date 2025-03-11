import React from "react";
import "../assets/styles/Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  // addToCart,
  removeFromCart,
  updateQuantity,
  // mergeCart,
} from "../redux/cartSlice";
import useGetCartItems from "../hooks/useGetCartItems";
import useRemoveItem from "../hooks/useRemoveItem";
// import useGetThumbnail from "../hooks/useGetThumbnail";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  // const thumbnails = useSelector((state) => state.cart.thumbnails);
  const removeItem = useRemoveItem();


  useGetCartItems();
  // useGetThumbnail(); 


  const calculateSubTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return 2;
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateTax();
  };

  const onCheckout = () => {
    navigate("/checkout");
  };

  const handleQuantityChange = (id, newQuantity) => {
    const item = cartItems.find((item) => item.id === id);
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart({ id }));
    }
  };

  return (
    <div className="cart-page">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty!</h2>
          <p>Browse products and add items to your cart.</p>
          <Link to="/home">
            <button className="go-back-button">Go Back to Home</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            <h2>Your Cart</h2>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product Img</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sub Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/* <img
                        src={`https://partydecorhub.com${
                          thumbnails.find(
                            (t) => t.product_id === item.product_id
                          )?.thumbnail
                        }`}
                        alt={item.name}
                        className="cart-product-img"
                      /> */}
                      <img className="cart-product-img" src={item.thumbnail } alt={item.name} />
                    </td>
                    <td>{item.name || item.product_name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <input
                        type="number"
                        className="cart-quantity-input"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <button
                        className="cart-remove-button"
                        onClick={() => {
                          removeItem(item);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h2>Cart Price</h2>
            <div className="cart-summary-item">
              <span>Tax:</span>
              <span>₹{calculateTax()}</span>
            </div>
            <div className="cart-summary-item">
              <span>SubTotal Price:</span>
              <span>₹{calculateSubTotal()}</span>
            </div>
            <div className="cart-summary-item">
              <span>Total Price:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <button className="cart-pay-button" onClick={onCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
