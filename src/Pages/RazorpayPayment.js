// This file handles Razorpay payment integration
import axios from "axios";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay payment
 * @param {Object} options - Payment options
 * @param {string} options.key - Razorpay API key
 * @param {number} options.amount - Payment amount in smallest currency unit (paise)
 * @param {string} options.currency - Payment currency code (INR)
 * @param {string} options.orderId - Razorpay order ID
 * @param {string} options.customerName - Customer's full name
 * @param {string} options.customerEmail - Customer's email
 * @param {string} options.customerPhone - Customer's phone number
 * @param {Object} options.orderDetails - Order details from backend
 * @param {number} options.orderTotal - Total order amount
 * @returns {Promise} - Returns a promise that resolves with payment result
 */
export const initiateRazorpayPayment = async (options) => {
  try {
    // Load Razorpay script if not already loaded
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      return {
        success: false,
        error: "Razorpay SDK failed to load. Please check your internet connection."
      };
    }

    // Configure Razorpay payment options
    const paymentOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: options.amount, // Amount in smallest currency unit (paise)
      currency: options.currency || "INR",
      name: "Party Decor Hub",
      description: `Order #${options.orderDetails.order_id || ''}`,
      order_id: options.orderId,
      image: "https://partydecorhub.com/logo.png", // Replace with your actual logo URL
      handler: function (response) {
        // This function will be called after successful payment
        // We will manually handle this below rather than here
      },
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone
      },
      notes: {
        order_id: options.orderDetails.order_id,
        shipping_address: options.orderDetails.shipping_address || ''
      },
      theme: {
        color: "#4ade80" // Green color to match your site theme
      }
    };

    // Create a promise to handle the Razorpay payment flow
    return new Promise((resolve) => {
      const razorpayInstance = new window.Razorpay(paymentOptions);
      
      // Handle payment success
      razorpayInstance.on('payment.success', async function (response) {
        try {
          // Send payment verification to your backend with exact format required by API
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            order_id: options.orderDetails.order_id // Include this if your API needs it (can be sent as a query param if needed)
          };
          
          const accessToken = localStorage.getItem("accessToken");
          
          if (!accessToken) {
            resolve({
              success: false,
              error: "Authentication token not found. Please login again."
            });
            return;
          }
          
          // Verify payment with backend
          const verificationResponse = await axios.post(
            "https://partydecorhub.com/api/payments/razorpay/verify",
            verificationData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          if (verificationResponse.data.success) {
            // Payment successfully verified by backend
            // Order status is automatically updated by the backend during verification
            resolve({
              success: true,
              data: {
                ...response,
                verification: verificationResponse.data
              }
            });
          } else {
            // Payment verification failed
            resolve({
              success: false,
              error: verificationResponse.data.message || "Payment verification failed",
              data: verificationResponse.data
            });
          }
        } catch (err) {
          console.error("Payment verification error:", err);
          resolve({
            success: false,
            error: err.response?.data?.message || "Payment verification failed",
            data: response
          });
        }
      });
      
      // Handle payment failure
      razorpayInstance.on('payment.failed', function (response) {
        resolve({
          success: false,
          error: response.error.description,
          data: response.error
        });
      });
      
      // Handle when checkout is manually closed by user
      razorpayInstance.on('modal.closed', function () {
        resolve({
          success: false,
          error: "Payment cancelled by user",
          canceled: true
        });
      });
      
      // Open Razorpay checkout modal
      razorpayInstance.open();
    });
  } catch (error) {
    console.error("Razorpay initialization error:", error);
    return {
      success: false,
      error: error.message || "Failed to initialize payment"
    };
  }
};

// // Function to capture payment later if needed (for admin or recurring purposes)
// export const captureRazorpayPayment = async (paymentId, amount) => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
    
//     if (!accessToken) {
//       return {
//         success: false,
//         error: "Authentication token not found"
//       };
//     }
    
//     const response = await axios.post(
//       "https://partydecorhub.com/api/payments/razorpay/capture",
//       {
//         payment_id: paymentId,
//         amount: amount // amount in paise
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );
    
//     return {
//       success: true,
//       data: response.data
//     };
//   } catch (error) {
//     console.error("Payment capture error:", error);
//     return {
//       success: false,
//       error: error.response?.data?.message || "Failed to capture payment"
//     };
//   }
// };

// // Function to retrieve payment details by payment ID
// export const getRazorpayPaymentDetails = async (paymentId) => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
    
//     if (!accessToken) {
//       return {
//         success: false,
//         error: "Authentication token not found"
//       };
//     }
    
//     const response = await axios.get(
//       `https://partydecorhub.com/api/payments/razorpay/details/${paymentId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       }
//     );
    
//     return {
//       success: true,
//       data: response.data
//     };
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     return {
//       success: false,
//       error: error.response?.data?.message || "Failed to fetch payment details"
//     };
//   }
// };