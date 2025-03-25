import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, section }) => {
  const navigate = useNavigate();

  const getButtonText = (section) => {
    switch (section) {
      case "Decoration Items":
      case "Disposable Items":
        return "Add to Cart";
      case "Decoration Services":
        return "Enquiry Now";
      default:
        return "Add to Cart";
    }
  };

  const handleNavigation = () => {
    if (section === "Decoration Services") {
      navigate(`/services/${product.id}`, { state: { product } });
    } else {
      navigate(`/products/${product.id}`, { state: { product } });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[250px] h-[420px] bg-white shadow-md rounded-lg p-4 transition-transform hover:scale-105"

  onClick={handleNavigation}
>

      {/* Image Covering 75% of Card */}
      <div className="w-full h-[85%] aspect-[4/3] overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.title || product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Title with Fixed Height */}
      <h3 className="mt-2 text-sm font-semibold text-center w-full h-[40px] overflow-hidden text-ellipsis whitespace-nowrap">
        {product.title || product.name}
      </h3>

      {/* Price Section */}
      <p className="text-gray-600 text-sm w-full text-center">
        {product.discounted_price ? (
          <>
            ₹{product.discounted_price}
            {product.price && (
              <span className="line-through text-gray-400 ml-2">
                ₹{product.price}
              </span>
            )}
          </>
        ) : product.price ? (
          `₹${product.price}`
        ) : (
          "Price not available"
        )}
      </p>

      {/* Button Section */}
      <button className="bg-green-900 text-white text-sm py-2 px-4 rounded-md mt-2 h-10 w-[80%] transition-all duration-200 transform hover:scale-[1.02]">
        {getButtonText(section)}
      </button>
    </div>
  );
};

export default ProductCard;
