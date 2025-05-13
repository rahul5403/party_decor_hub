// This file handles Razorpay payment integration
import axios from "axios";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  console.log("Starting to load Razorpay script");
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      console.log("Razorpay already loaded");
      resolve(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load Razorpay script:", error);
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
    console.log("Loading Razorpay script");
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      console.error("Razorpay SDK failed to load");
      return {
        success: false,
        error: "Razorpay SDK failed to load. Please check your internet connection."
      };
    }
    
    console.log("Razorpay script loaded successfully");
    console.log("Razorpay available in window:", !!window.Razorpay);
    
    if (!window.Razorpay) {
      console.error("Razorpay not found despite script loaded");
      return {
        success: false,
        error: "Payment integration failed to initialize"
      };
    }

    // Create a variable to track if the payment has been handled
    let paymentHandled = false;
    
    // Create a promise to handle the Razorpay payment flow
    return new Promise((resolve) => {
      // Configure Razorpay payment options
      const paymentOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: options.amount, // Amount in smallest currency unit (paise)
        currency: options.currency || "INR",
        name: "Party Decor Hub",
        description: `Order #${options.orderDetails.order_id || ''}`,
        order_id: options.orderId,
        image: "https://partydecorhub.com/logo.png", // Replace with your actual logo URL
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
        },
        // Add a handler function directly in the options
        handler: async function(response) {
          // This is the primary handler that Razorpay calls on successful payment
          console.log("Razorpay payment success handler called:", response);
          
          // If payment was already handled via event listener, don't process again
          if (paymentHandled) {
            console.log("Payment already handled by event listener, skipping handler");
            return;
          }
          
          // Mark as handled to prevent duplicate processing
          paymentHandled = true;
          
          try {
            // The same verification logic as in your event listener
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              order_id: options.orderDetails.order_id
            };
            
            const accessToken = localStorage.getItem("accessToken");
            
            if (!accessToken) {
              console.error("Authentication token not found");
              resolve({
                success: false,
                error: "Authentication token not found. Please login again."
              });
              return;
            }
            
            console.log("Verifying payment with backend...");
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
            
            console.log("Payment verification response:", verificationResponse.data);
            
            if (verificationResponse.data.status === "success") {
              // Payment successfully verified by backend
              console.log("Payment verified successfully");
              resolve({
                success: true,
                data: {
                  ...response,
                  verification: verificationResponse.data
                }
              });
            } else {
              // Payment verification failed
              console.error("Payment verification failed:", verificationResponse.data);
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
        }
      };

      console.log("Creating Razorpay instance with options:", paymentOptions);
      console.log("Razorpay key available:", !!process.env.REACT_APP_RAZORPAY_KEY);
      
      const razorpayInstance = new window.Razorpay(paymentOptions);
      
      console.log("Razorpay instance created");
      
      // Monitor for the modal opening
      razorpayInstance.on('ready', function() {
        console.log("Razorpay modal is ready and displayed to user");
      });
      
      // Handle payment success via event listener (backup approach)
      razorpayInstance.on('payment.success', async function (response) {
        console.log("Razorpay payment.success event fired:", response);
        
        // If payment was already handled via handler, don't process again
        if (paymentHandled) {
          console.log("Payment already handled by handler, skipping event");
          return;
        }
        
        // Mark as handled to prevent duplicate processing
        paymentHandled = true;
        
        try {
          // Verification logic
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            order_id: options.orderDetails.order_id
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
          console.log("Verifying payment with backend (from event)...");
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
          console.error("Payment verification error (from event):", err);
          resolve({
            success: false,
            error: err.response?.data?.message || "Payment verification failed",
            data: response
          });
        }
      });
      
      // Handle payment failure
      razorpayInstance.on('payment.failed', function (response) {
        console.error("Razorpay payment failed:", response.error);
        resolve({
          success: false,
          error: response.error.description,
          data: response.error
        });
      });
      
      // Handle when checkout is manually closed by user
      razorpayInstance.on('modal.closed', function () {
        console.log("Razorpay modal closed by user");
        // Only resolve if payment wasn't already handled
        if (!paymentHandled) {
          resolve({
            success: false,
            error: "Payment cancelled by user",
            canceled: true
          });
        }
      });
      
      // Open Razorpay checkout modal
      try {
        console.log("Opening Razorpay modal");
        razorpayInstance.open();
        console.log("Razorpay open method called");
      } catch (error) {
        console.error("Error opening Razorpay modal:", error);
        resolve({
          success: false,
          error: "Failed to open payment window: " + error.message
        });
      }
    });
  } catch (error) {
    console.error("Razorpay initialization error:", error);
    return {
      success: false,
      error: error.message || "Failed to initialize payment"
    };
  }
};