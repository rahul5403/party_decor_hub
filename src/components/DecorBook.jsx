import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/DecorBook.css";
import SimilarProductSection from "./SimilarProductSection";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const DecorBook = () => {
    const { product_id } = useParams();

    const service_id = product_id;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    const [pincode, setPincode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [expandedSection, setExpandedSection] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [pincodeMessage, setPincodeMessage] = useState("");

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const response = await axios.get(`https://partydecorhub.com/api/services/${service_id}`);
                const serviceData = response.data;
                serviceData.images = serviceData.images.map(img => ({
                    ...img,
                    image: BASE_IMAGE_URL + img.image
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

    useEffect(() => {
        if (!service || !service.images || service.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % service.images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [service]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!service) {
        return <div>Service not found.</div>;
    }

    const images = service.images.map(img => img.image);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

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
            "110091", "110092", "110093", "110094", "110095", "110096", "110097", "110098", "110099", "110100",
        ];

        if (validPincodes.includes(pincode)) {
            setPincodeMessage("Service is available in your area!");
            toast.success("Service is available in your area!");
        } else {
            setPincodeMessage("Sorry, we only provide services in Delhi NCR.");
            toast.error("Sorry, we only provide services in Delhi NCR.");
        }
    };

    const handleBooking = async (e) => {

        e.preventDefault();

        if ( !startDate || !startTime || !endDate || !endTime || !customerName || !address || !email || !phone) {
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
                hour12: true 
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
            end_datetime: new Date(`${endDate}T${endTime}:00Z`).toISOString(),
        };

        try {
            const response = await axios.post(`https://partydecorhub.com/api/bookings`, bookingData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                toast.success(`Booking confirmed for ${service.name} from ${startDate} at ${startTime} to ${endDate} at ${endTime}.`);
                const whatsappMessage = `*New Booking Details*\n\n` +
                `➤  *Service:* ${service.name}\n` +
                `➤  *Customer Name:* ${customerName}\n` +
                `➤  *Address:* ${address}\n` +
                `➤  *Email:* ${email}\n` +
                `➤  *Phone:* ${phone}\n` +
                `➤  *Start Date:* ${formatDateTime(startDate, startTime)}\n` +
                `➤  *End Date:* ${formatDateTime(endDate, endTime)}`;
            

            const whatsappUrl = `https://wa.me/7011676961?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank");
            } else {
                toast.error("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="decoration-booking-section">
            <Toaster />
            <div className="booking-container">
                <div className="image-gallery">
                    <img
                        src={images[currentImageIndex]}
                        alt={service.name}
                        className="main-image"
                    />
                    {images.length > 1 && (
                        <div className="slider-dots">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`custom-dot ${index === currentImageIndex ? "active" : ""}`}
                                    onClick={() => goToImage(index)}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="booking-details">
                    <h1 className="booking-title">{service.name}</h1>
                    <div className="price-section">
                        <span className="discounted-price">₹{service.price}</span>
                    </div>

                    <label className="input-label">Check Pin Code Availability *</label>
                    <div className="pincode-check">
                        <input
                            type="text"
                            placeholder="Enter pin code"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="input-field"
                        />
                        <button className="check-availability-btn" onClick={handlePincodeCheck}>
                            Check Availability
                        </button>
                    </div>
                    {pincodeMessage && <p className={`pincode-message ${pincodeMessage.includes("available") ? "success" : "error"}`}>{pincodeMessage}</p>}

                    <form onSubmit={handleBooking}>
    <label className="input-label">Customer Name *</label>
    <input
        type="text"
        placeholder="Enter your name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="input-field"
        required
    />

    <label className="input-label">Address *</label>
    <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input-field"
        required
    />

    <label className="input-label">Email *</label>
    <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
        required
    />

    <label className="input-label">Phone *</label>
    <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
        required
    />

    <div className="flex flex-col gap-4">
        <div className="flex gap-4 start">
            <div>
                <label className="input-label">Start Date *</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field w-full"
                    required
                />
            </div>

            <div>
                <label className="input-label">Start Time *</label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input-field w-full"
                    required
                />
            </div>
        </div>

        <div className="flex gap-4 end">
            <div>
                <label className="input-label">End Date *</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-field w-full"
                    required
                />
            </div>

            <div>
                <label className="input-label">End Time *</label>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="input-field w-full"
                    required
                />
            </div>
        </div>
    </div>

    <button type="submit" className="book-now-btn">
        Book Now
    </button>
</form>


                    <div className="features">
                        <div className="feature-box">✔ Quality Products</div>
                        <div className="feature-box">⭐ 4.9/5 Google Ratings</div>
                        <div className="feature-box">📞 24/7 Customer Support</div>
                        <div className="feature-box">💳 Secure Payment</div>
                    </div>
                </div>
            </div>

            {[
                { title: "Inclusions", content: [service.inclusions] },
                { title: "Description", content: [service.description] },
                { title: "Must Know", content: [service.must_know] },
                { title: "Cancellation & Refund Policy", content: [service.cancellation_policy] },
            ].map((section, index) => (
                <div key={index} className="details-section">
                    <div className="section-header" onClick={() => toggleSection(index)}>
                        <h2 className="section-title">{section.title}</h2>
                        <span className="toggle-icon">{expandedSection === index ? "-" : "+"}</span>
                    </div>
                    {expandedSection === index && (
                        <ul className="details-list">
                            {section.content.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="similar-products">
                <SimilarProductSection products={[]} section={"You might also like"} />
            </div>
        </div>
    );
};

export default DecorBook;