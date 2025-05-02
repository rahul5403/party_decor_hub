import React from 'react';

const DeliveryBanner = () => {
  return (
    <div className="mx-8">
      <div className="w-full py-2.5 mt-2 bg-gradient-to-r from-green-500 via-emerald-600 to-green-400 text-white text-center shadow-xl rounded-xl relative overflow-hidden border border-green-300/20">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgb(255,255,255)_0%,transparent_10%)] opacity-10"></div>
        
        {/* Shine effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-green-100/20 to-transparent opacity-30 animate-[shine_4s_ease-in-out_infinite] -skew-x-12"></div>
        
        <div className="flex items-center justify-center space-x-3 relative z-10 px-4">
          <div className="relative flex items-center justify-center bg-white/10 p-1.5 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" 
              />
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-300 rounded-full shadow-sm shadow-yellow-300/50 animate-pulse"></div>
          </div>
          
          <div className="inline-flex items-center">
            <span className="font-semibold text-sm md:text-base tracking-wide">
              <span className="uppercase tracking-wider">Free Delivery</span>
              <span className="mx-1 text-green-200">•</span>
              <span>on all orders above ₹500!</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default DeliveryBanner;