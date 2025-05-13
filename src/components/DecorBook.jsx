import React, { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { useParams } from "react-router-dom";
import SimilarProductSection from "./SimilarProductSection";
import { ChevronLeft, ChevronRight, Clock, Shield, Truck, ZoomIn, ZoomOut, X } from "lucide-react";
import usePincode from "../hooks/Services/usePincode";
import useServiceDetails from "../hooks/Services/useServiceDetails";
import useHandleBooking from "../hooks/Services/useHandleBooking";
import useFetchData from "../hooks/Home/useFetchData";
import rehypeRaw from "rehype-raw";

const DecorBook = () => {
  const { product_id } = useParams();
  const service_id = product_id;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const imageRef = useRef(null);
  const [pincode, setPincode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const {pincodeMessage, handlePincodeCheck} = usePincode(pincode);
  const {service, loading} = useServiceDetails(service_id);
  const { handleBooking } = useHandleBooking(service, startDate, startTime, customerName, address, email, phone);
  const { recommendedServices} = useFetchData();
  
  const processMarkdown = (text) => {
    if (!text) return '';
    
    // Replace literal "\r\n" strings with actual line breaks
    let processed = text
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n');
      
    return processed;
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const image = imageRef.current.querySelector("img");
    if (image) {
      image.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleMouseLeave = () => {
    if (isZoomed && !isFullscreenZoom) {
      setIsZoomed(false);
      const image = imageRef.current?.querySelector('img');
      if (image) {
        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(1)';
      }
    }
  };

  const toggleFullscreenZoom = () => {
    if (isFullscreenZoom) {
      setIsFullscreenZoom(false);
      setIsZoomed(false);
      const image = imageRef.current?.querySelector('img');
      if (image) {
        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(1)';
      }
    } else {
      setIsFullscreenZoom(true);
      setIsZoomed(true);
      const image = imageRef.current?.querySelector('img');
      if (image) {
        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(2)';
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!service) return <div className="text-center p-8">Service not found</div>;

  const hasMultipleImages = service.images.length > 1;

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreenZoom ? 'overflow-hidden' : ''}`}>
      {isFullscreenZoom && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0">
          <button
            onClick={toggleFullscreenZoom}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <img
              src={service.images[currentImageIndex]?.original}
              alt={service.name}
              className="h-full w-full object-contain object-center"
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 ${isFullscreenZoom ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
          <div className="md:col-span-3">
            <div
              ref={imageRef}
              className={`relative aspect-square overflow-hidden rounded-xl bg-gray-100 border-2 border-gray-200 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              } max-w-3xl mx-auto transition-all duration-300 shadow-sm hover:shadow-md group`}
              onClick={() => !isFullscreenZoom && setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={service.images[currentImageIndex]?.original}
                alt={service.name}
                className={`h-full w-full object-cover object-center transition-transform duration-200 ease-out ${
                  isZoomed ? "scale-250" : "scale-100"
                }`}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreenZoom();
                  }}
                  className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
                >
                  {isFullscreenZoom ? (
                    <ZoomOut className="w-5 h-5 text-gray-700" />
                  ) : (
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
              {hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="mt-4 flex justify-center flex-wrap gap-2 px-2">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                      currentImageIndex === index ? "border-emerald-600 scale-105 shadow-sm" : "border-gray-200 hover:border-emerald-400"
                    }`}
                  >
                    <img src={image.original} alt={`Service ${index + 1}`} className="h-full w-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-3 flex flex-col w-full px-2 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
            <div className="mb-6">
              <span className="text-2xl md:text-3xl font-bold text-emerald-700">₹{service.price}</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 w-full max-w-full">
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 text-left">Check Pin Code Availability</label>
                <div className="flex gap-2 items-center w-full">
                  <input type="text" placeholder="Enter pin code" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-[42px] m-0" />
                  <button type="button" onClick={handlePincodeCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 h-[42px] whitespace-nowrap shrink-0" > Check Availability </button>
                </div>
                {pincodeMessage && (
                  <p className={`text-sm ${pincodeMessage.includes("available") ? "text-emerald-600" : "text-red-600"}`}>
                    {pincodeMessage}
                  </p>
                )}
              </div>

              {[
                { label: "Customer Name", type: "text", value: customerName, setter: setCustomerName },
                { label: "Address", type: "text", value: address, setter: setAddress },
                { label: "Email", type: "email", value: email, setter: setEmail },
                { label: "Phone", type: "tel", value: phone, setter: setPhone },
              ].map((field, idx) => (
                <div key={idx} className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700 text-left">{field.label}</label>
                  <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" required/>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                <div className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500" required/>
                </div>
                <div className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500" required/>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md font-medium">Book Now</button>
            </form>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { icon: Shield, text: "Quality Products" },
                { icon: Truck, text: "Fast Delivery" },
                { icon: Clock, text: "24/7 Support" },
                { text: "4.9/5 Google Ratings" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-100 hover:border-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    {feature.icon && <feature.icon className="w-5 h-5 text-emerald-600" />}
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4">
  {[
    { title: "Inclusions", content: service.inclusions },
    { title: "Description", content: service.description },
    { title: "Must Know", content: service.must_know },
    { title: "Cancellation Policy", content: service.cancellation_policy },
  ].map((section, index) => (
    <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
      <div
        className="p-4 md:p-5 cursor-pointer transition-colors duration-200 hover:bg-emerald-50 rounded-xl"
        onClick={() => setExpandedSection(expandedSection === index ? null : index)}
      >
        <h3 className="font-semibold flex justify-between items-center text-gray-800">
          <span className="text-lg md:text-xl font-medium text-emerald-700">{section.title}</span>
          <span className="text-emerald-600 text-xl font-light">{expandedSection === index ? "-" : "+"}</span>
        </h3>
      </div>

      {expandedSection === index && (
        <div className="p-4 md:p-6 pt-0">
          <div className="text-gray-700 text-base leading-relaxed text-left prose prose-p:my-1 prose-li:my-1 max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
  {processMarkdown(section.content || "")}
</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  ))}
</div>

        {/* <SimilarProductSection products={[]} section={"You might also like"} className="mt-12" /> */}

        {recommendedServices.length > 0 && (
        <SimilarProductSection 
          products={recommendedServices} 
          section={"Recommended Services"} 
          className="mt-12" 
        />
      )}

      </div>
    </div>
  );
};

export default DecorBook;