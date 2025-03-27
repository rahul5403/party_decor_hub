import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SimilarProductSection from "./SimilarProductSection";
import axios from "axios";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const DecorBook = () => {
  const { product_id } = useParams();
  const service_id = product_id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef(null);

  // Form states
  const [pincode, setPincode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [pincodeMessage, setPincodeMessage] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(
          `https://partydecorhub.com/api/services/${service_id}`
        );
        const serviceData = response.data;
        serviceData.images = serviceData.images.map((img) => ({
          original: BASE_IMAGE_URL + img.image,
          thumbnail: BASE_IMAGE_URL + img.image,
        }));
        setService(serviceData);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch service details.");
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [service_id]);

  const handlePincodeCheck = () => {
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
    setPincodeMessage(
      validPincodes.includes(pincode)
        ? "Service is available in your area!"
        : "Sorry, we only provide services in Delhi NCR."
    );
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
    if (isZoomed) {
      setIsZoomed(false);
      const image = imageRef.current?.querySelector('img');
      if (image) {
        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(1)';
      }
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (
      !startDate ||
      !startTime ||
      !customerName ||
      !address ||
      !email ||
      !phone
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formatDateTime = (date, time) => {
      const dateObj = new Date(`${date}T${time}:00`);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return dateObj.toLocaleString("en-US", options);
    };

    const bookingData = {
      decor_service_id: service.id,
      customer_name: customerName,
      address: address,
      email: email,
      phone: phone,
      start_datetime: new Date(`${startDate}T${startTime}:00Z`).toISOString(),
    };

    try {
      const response = await axios.post(
        `https://partydecorhub.com/api/bookings`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success(
          `Booking confirmed for ${service.name} from ${startDate} at ${startTime}`
        );
        const whatsappMessage =
          `*New Booking Details*\n\n` +
          `➤  *Service:* ${service.name}\n` +
          `➤  *Customer Name:* ${customerName}\n` +
          `➤  *Address:* ${address}\n` +
          `➤  *Email:* ${email}\n` +
          `➤  *Phone:* ${phone}\n` +
          `➤  *Start Date:* ${formatDateTime(startDate, startTime)}`;

        const whatsappUrl = `https://wa.me/7011676961?text=${encodeURIComponent(
          whatsappMessage
        )}`;
        window.open(whatsappUrl, "_blank");
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!service) return <div className="text-center p-8">Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
          {/* Image Gallery */}
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
                src={service.images[currentImageIndex]?.original}
                alt={service.name}
                className={`h-full w-full object-cover object-center transition-transform duration-200 ease-out ${
                  isZoomed ? "scale-250" : "scale-100"
                }`}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(
                    (prev) =>
                      (prev - 1 + service.images.length) % service.images.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(
                    (prev) => (prev + 1) % service.images.length
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex justify-center flex-wrap gap-2 px-2">
              {service.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                    currentImageIndex === index
                      ? "border-emerald-600 scale-105 shadow-sm"
                      : "border-gray-200 hover:border-emerald-400"
                  }`}
                >
                  <img
                    src={image.original}
                    alt={`Service ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-3 flex flex-col w-full px-2 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {service.name}
            </h1>
            <div className="mb-6">
              <span className="text-2xl md:text-3xl font-bold text-emerald-700">
                ₹{service.price}
              </span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 w-full max-w-full">
              {/* Pincode Check */}
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Check Pin Code Availability
                </label>
                <div className="flex gap-2 items-center w-full">
                  <input
                    type="text"
                    placeholder="Enter pin code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-[42px]"
                  />
                  <button
                    type="button"
                    onClick={handlePincodeCheck}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 h-[42px] whitespace-nowrap shrink-0"
                  >
                    Check Availability
                  </button>
                </div>
                {pincodeMessage && (
                  <p
                    className={`text-sm ${
                      pincodeMessage.includes("available")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {pincodeMessage}
                  </p>
                )}
              </div>

              {/* Form Fields */}
              {[
                {
                  label: "Customer Name",
                  type: "text",
                  value: customerName,
                  setter: setCustomerName,
                },
                {
                  label: "Address",
                  type: "text",
                  value: address,
                  setter: setAddress,
                },
                {
                  label: "Email",
                  type: "email",
                  value: email,
                  setter: setEmail,
                },
                { label: "Phone", type: "tel", value: phone, setter: setPhone },
              ].map((field, idx) => (
                <div key={idx} className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              ))}

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                <div className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              >
                Book Now
              </button>
            </form>

            {/* Features Grid */}
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
                    {feature.icon && (
                      <feature.icon className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
       {/* Expandable Sections - Updated Styling */}
       <div className="mt-12 space-y-4">
          {[
            { title: "Inclusions", content: service.inclusions },
            { title: "Description", content: service.description },
            { title: "Must Know", content: service.must_know },
            { title: "Cancellation Policy", content: service.cancellation_policy },
          ].map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div
                className="p-4 md:p-5 cursor-pointer transition-colors duration-200 hover:bg-emerald-50 rounded-xl"
                onClick={() =>
                  setExpandedSection(expandedSection === index ? null : index)
                }
              >
                <h3 className="font-semibold flex justify-between items-center text-gray-800">
                  <span className="text-lg md:text-xl font-medium text-emerald-700">
                    {section.title}
                  </span>
                  <span className="text-emerald-600 text-xl font-light">
                    {expandedSection === index ? "−" : "+"}
                  </span>
                </h3>
              </div>

              {expandedSection === index && (
                <div className="p-4 md:p-6 pt-0">
                  <div className="text-gray-700 space-y-3 text-base leading-relaxed text-left">
  {section.content?.split('\n').map((line, i) => (
    line.trim() && (
      <p key={i} className={`text-justify md:text-left ${line.startsWith("•") ? "block" : ""}`}>
        {line.trim()}
      </p>
    )
  ))}
</div>

                </div>
              )}
            </div>
          ))}
        </div>

        {/* <SimilarProductSection
          products={[]}
          section={"You might also like"}
          className="mt-12"
        /> */}
      </div>
    </div>
  );
};

export default DecorBook;
