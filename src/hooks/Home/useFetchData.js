import { useEffect, useState } from "react";
import axios from "axios";

const BASE_IMAGE_URL = process.env.REACT_APP_BASE_URL ;

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  if (array.length <= count) return [...array];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function useFetchData() {
    const [partyData, setPartyData] = useState([]);
    const [disposalData, setDisposalData] = useState([]);
    const [decorationServices, setDecorationServices] = useState([]);
    const [recommendedPartyItems, setRecommendedPartyItems] = useState([]);
    const [recommendedDisposalItems, setRecommendedDisposalItems] = useState([]);
    const [recommendedServices, setRecommendedServices] = useState([]);
    const [loading, setLoading] = useState({
        products: true,
        services: true
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, servicesRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products`),
                    axios.get(-`${process.env.REACT_APP_BASE_URL}/api/services`)
                ]);

                const products = productsRes.data.map(product => ({
                    id: product.product_id || product.id,
                    name: product.name,
                    discounted_price: product.discounted_price,
                    price: product.price,
                    description: product.category,
                    image: BASE_IMAGE_URL + product.thumbnail,
                    images: [BASE_IMAGE_URL + product.thumbnail],
                }));

                const services = servicesRes.data.map(service => ({
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    image: BASE_IMAGE_URL + service.thumbnail,
                }));

                const partyItems = products.filter(item => item.description === "Party Decor");
                const disposableItems = products.filter(item => item.description === "Disposable Items");
                
                setPartyData(partyItems);
                setDisposalData(disposableItems);
                setDecorationServices(services);
                
                // Create recommended items for each category
                setRecommendedPartyItems(getRandomItems(partyItems, 6));
                setRecommendedDisposalItems(getRandomItems(disposableItems, 6));
                setRecommendedServices(getRandomItems(services, 6));
                
                setLoading({ products: false, services: false });
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
                setLoading({ products: false, services: false });
            }
        };

        fetchData();
    }, []);

    return {
        partyData,
        disposalData,
        decorationServices,
        recommendedPartyItems,
        recommendedDisposalItems,
        recommendedServices,
        loading,
        error
    };
}