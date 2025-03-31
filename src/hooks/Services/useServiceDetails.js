import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useServiceDetails = (service_id) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_IMAGE_URL = "https://partydecorhub.com";

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
  return { service, loading };
};

export default useServiceDetails;
