// import React from "react";
// import ProductCard from "./ProductCard";

// const ProductSection = ({ products, section }) => {
//   return (
//     <div className="product-section">
//       <h2>{section}</h2>
//       <div className="product-grid">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} section={section} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductSection;
import React from "react";
import ProductCard from "./ProductCard"; // Make sure this import exists

// ProductSection.jsx
const ProductSection = ({ products, section }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{section}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} section={section} />
      ))}
    </div>
  </div>
);

export default ProductSection;
