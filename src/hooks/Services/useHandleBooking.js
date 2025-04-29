import axios from "axios";
import { toast } from "react-toastify";

const useHandleBooking = (service, startDate, startTime, customerName, address, email, phone) => {
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!startDate || !startTime || !customerName || !address || !email || !phone) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formatDateTime = (date, time) => {
      const dateObj = new Date(`${date}T${time}:00`);
      return dateObj.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
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
      const response = await axios.post("https://partydecorhub.com/api/bookings", bookingData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success(`Booking confirmed for ${service.name} from ${startDate} at ${startTime}`);
        const productUrl = `https://partydecorhub.com/services/${service.id}`;
        const whatsappMessage = `*New Booking Details*\n\n` +
          `➤  *Service:* ${service.name}\n` +
          `➤  *Customer Name:* ${customerName}\n` +
          `➤  *Address:* ${address}\n` +
          `➤  *Email:* ${email}\n` +
          `➤  *Phone:* ${phone}\n` +
          `➤  *Start Date:* ${formatDateTime(startDate, startTime)}`+
          `➤  *Service Link:* ${productUrl}`;

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

  return { handleBooking };
};

export default useHandleBooking;
