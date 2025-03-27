import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SimilarProductSection from "../components/SimilarProductSection";
import axios from "axios";
import { ShoppingCart, Truck, Shield, Clock, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import useSetCartItems from "../hooks/useSetCartItems";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Check } from 'lucide-react';

const BASE_IMAGE_URL = "https://partydecorhub.com";

const ProductDetails = () => {
  const { product_id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef(null);

  const addItemToCart = useSetCartItems();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://partydecorhub.com/api/products/${product_id}`
        );
        const productData = response.data;

        const updatedProduct = {
          ...productData,
          thumbnail: BASE_IMAGE_URL + productData.thumbnail,
          images: productData.images.map((img) => ({
            original: BASE_IMAGE_URL + img.image,
            thumbnail: BASE_IMAGE_URL + img.image,
          })),
        };

        setProduct(updatedProduct);
        setSelectedColor(updatedProduct.color || updatedProduct.available_colors?.[0] || "");
        setSelectedSize(updatedProduct.size || updatedProduct.available_sizes?.[0] || "");

        const allProductsResponse = await axios.get(
          "https://partydecorhub.com/api/products"
        );
        const filteredSimilarProducts = allProductsResponse.data
          .filter(
            (item) =>
              item.category === updatedProduct.category &&
              item.id !== updatedProduct.id
          )
          .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.category,
            image: BASE_IMAGE_URL + item.thumbnail,
            images: [BASE_IMAGE_URL + item.thumbnail],
          }));

        setSimilarProducts(filteredSimilarProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const handleAddToCart = () => {
    const item = [
      {
        id: product_id,
        product_id,
        quantity,
        color: selectedColor,
        size: selectedSize,
        price: product.price,
        name: product.name,
        thumbnail: product.thumbnail,
        images: product.images,
      },
    ];

    if (!accessToken) {
      dispatch(addToCart(item[0]));
    } else {
      addItemToCart(item);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    const image = imageRef.current.querySelector('img');
    if (image) {
      image.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false);
      const image = imageRef.current?.querySelector('img');
      if (image) {
        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(1)';
      }
    }
  };

  if (loading) return <h2 className="text-center p-8">Loading...</h2>;
  if (!product) return <h2 className="text-center p-8">Product not found</h2>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
          {/* Image Gallery Section */}
          <div className="md:col-span-3">
            <div 
              ref={imageRef}
              className={`relative aspect-square overflow-hidden rounded-xl bg-gray-100 border-2 border-gray-200 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              } max-w-3xl mx-auto transition-all duration-300 shadow-sm hover:shadow-md`}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.images[currentImageIndex]?.original}
                alt={product.name}
                className={`h-full w-full object-cover object-center transition-transform duration-200 ease-out ${
                  isZoomed ? 'scale-250' : 'scale-100'
                }`}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % product.images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="mt-4 flex justify-center flex-wrap gap-2 px-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                    currentImageIndex === index 
                      ? 'border-emerald-600 scale-105 shadow-sm' 
                      : 'border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  <img
                    src={image.original}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:col-span-3 flex flex-col px-2 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-emerald-600 text-base">
                {"★".repeat(4)}
                <span className="text-gray-300">☆</span>
              </div>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>

            <div className="mb-6">
              {product.discounted_price ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-emerald-700">
                    ₹{product.discounted_price}
                  </span>
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.price}
                  </span>
                </div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-emerald-700">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Color Selection */}
            {(product.color || product.available_colors?.length > 0) && (
              <div className="mb-4 w-4/5">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Color:</label>
                {product.color ? (
                  <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    {product.color}
                  </div>
                ) : (
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    {product.available_colors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Size Selection */}
            {(product.size || product.available_sizes?.length > 0) && (
              <div className="mb-6 w-4/5">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left" >Size:</label>
                {product.size ? (
                  <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    {product.size}
                  </div>
                ) : (
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    {product.available_sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Quantity:</label>
              <div className="flex items-center gap-2 w-4/5">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="w-10 h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all duration-200"
                >
                  -
                </button>
                <span className="w-16 h-10 flex items-center justify-center border border-emerald-200 bg-white text-gray-900 rounded-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="w-10 h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-all duration-300 
              shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-8"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Add to Cart</span>
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: "Fast Delivery" },
                { icon: Shield, text: "Secure Payment" },
                { icon: Clock, text: "24/7 Support" },
                { icon: RotateCcw, text: "Easy Returns" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-100 hover:border-emerald-100 
                  transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
{/* Description & Reviews */}
<div className="mt-12 space-y-4">
  {["Description", "Reviews"].map((section, index) => (
    <div 
      key={index}
      className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <div 
        className="p-3 cursor-pointer transition-colors duration-200 hover:bg-emerald-50 rounded-xl"
        onClick={() => toggleSection(index)}
      >
        <h3 className="font-semibold flex justify-between items-center text-gray-800">
          <span className="text-lg font-medium text-emerald-700">
            {section}
          </span>
          <span className="text-emerald-600 text-xl font-light">
            {expandedSection === index ? '−' : '+'}
          </span>
        </h3>
      </div>
      
      {expandedSection === index && (
        <div className="p-4 pt-2">
          {section === "Reviews" ? (
            reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">U</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">User {i+1}</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center">
                <p className="text-gray-500 italic">
                  Be the first to review this product
                </p>
              </div>
            )
          ) : (
            <div className="prose max-w-none text-gray-700">
              <p className="text-base leading-relaxed">
                {product.description}
              </p>
              {/* Dynamic features list from backend */}
              {product.features?.length > 0 && (
                <ul className="mt-4 space-y-2 pl-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  ))}
</div>

        {/* <SimilarProductSection 
          products={similarProducts} 
          section={"You might also like"} 
          className="mt-12"
        /> */}
      </div>
    </div>
  );
};

export default ProductDetails;