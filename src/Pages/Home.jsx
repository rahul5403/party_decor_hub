import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import { Helmet } from "react-helmet-async";

function Home() {
    const [partyData, setPartyData] = useState([]);
    const [disposalData, setDisposalData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://partydecorhub.com/api/products");
                const products = response.data; // Assuming API returns an array of products
                
                // Categorizing data
                const partyItems = products.filter(item => item.category === "Party Decor");
                const disposableItems = products.filter(item => item.category === "Disposable Items");

                setPartyData(partyItems);
                setDisposalData(disposableItems);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>Home | Party Decor Hub</title>
                <meta name="description" content="Discover premium home decor products at Party Decor Hub." />
                <meta name="keywords" content="home decor, party supplies, disposable items" />
            </Helmet>
            <HeroSection />
            <Services />
            <HomeProductSection products={partyData} section={"Decoration Items"} />
            <HomeProductSection products={[]} section={"Decoration Services"} /> {/* Static */}
            <HomeProductSection products={disposalData} section={"Disposable Items"} />
            <BulkOrderSection />
        </React.Fragment>
    );
}

export default Home;
