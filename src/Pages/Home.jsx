import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import useGetCartItems from "../hooks/useGetCartItems";

const BASE_IMAGE_URL = "https://partydecorhub.com";

function Home() {
    const [partyData, setPartyData] = useState([]);
    const [disposalData, setDisposalData] = useState([]);
    const [decorationServices, setDecorationServices] = useState([]);
    useGetCartItems();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://partydecorhub.com/api/products");
                const products = response.data.map(product => ({
                    id: product.product_id || product.id,
                    name: product.name,
                    discounted_price: product.discounted_price,
                    price: product.price,
                    description: product.category,
                    image: BASE_IMAGE_URL + product.thumbnail,
                    images: [BASE_IMAGE_URL + product.thumbnail],
                }));
                setPartyData(products.filter(item => item.description === "Party Decor"));
                setDisposalData(products.filter(item => item.description === "Disposable Items"));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchDecorationServices = async () => {
            try {
                const response = await axios.get("https://partydecorhub.com/api/services");
                const services = response.data.map(service => ({
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    image: BASE_IMAGE_URL + service.thumbnail,
                }));
                setDecorationServices(services);
            } catch (error) {
                console.error("Error fetching decoration services:", error);
            }
        };

        fetchProducts();
        fetchDecorationServices();
    }, []);

    return (
        <React.Fragment>
            <HeroSection />
            <Services />
            <HomeProductSection products={partyData} section={"Decoration Items"} />
            <HomeProductSection products={decorationServices} section={"Decoration Services"} />
            <HomeProductSection products={disposalData} section={"Disposable Items"} />
            <HomeProductSection products={partyData} section={"Best Sellers"} />
            <HomeProductSection products={decorationServices} section={"Neon Lights"} />
            <BulkOrderSection />
        </React.Fragment>
    );
}

export default Home;