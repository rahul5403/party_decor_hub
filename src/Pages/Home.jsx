// import React from "react";
// import HeroSection from "../components/HeroSection";
// import Services from "../components/Services";
// import BulkOrderSection from "../components/BulkOrderSection";
// import HomeProductSection from "../components/HomeProductSection";
// import { decorationData, disposalData, partyData } from "../data/data";
// import { Helmet, HelmetProvider } from "react-helmet-async";


// function Home() {
//     return (
//         <React.Fragment>
//             <Helmet>
//                 <title>Home | Party Decor Hub</title>
//                 <meta name="description" content="Discover premium home decor products at Party Decor Hub." />
//                 <meta name="keywords" content="home decor, party supplies, disposable items" />
//             </Helmet>
//             <HeroSection />
//             <Services />
//             <HomeProductSection  products={partyData} section={"Decoration Items"}/>
//             <HomeProductSection  products={decorationData} section={"Decoration Services"}/>
//             <HomeProductSection  products={disposalData} section={"Disposable Items"}/>
//             <BulkOrderSection />
//         </React.Fragment>
//     );
// }

// export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import { Helmet } from "react-helmet-async";
import { decorationData } from "../data/data";

const BASE_IMAGE_URL = "https://partydecorhub.com"; 

function Home() {
    const [partyData, setPartyData] = useState([]);
    const [disposalData, setDisposalData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://partydecorhub.com/api/products");
                const products = response.data.map(product => ({
                    id: product.product_id || product.id, 
                    name: product.name,
                    price: product.price,
                    originalPrice: product.price + 10,  
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
            <HomeProductSection products={decorationData} section={"Decoration Services"} /> 
            <HomeProductSection products={disposalData} section={"Disposable Items"} />
            <BulkOrderSection />
        </React.Fragment>
    );
}

export default Home;
