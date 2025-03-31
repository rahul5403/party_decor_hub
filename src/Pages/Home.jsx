// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import HeroSection from "../components/HeroSection";
// import Services from "../components/Services";
// import BulkOrderSection from "../components/BulkOrderSection";
// import HomeProductSection from "../components/HomeProductSection";
// import useGetCartItems from "../hooks/cart/useGetCartItems";

// const BASE_IMAGE_URL = "https://partydecorhub.com";

// function Home() {
//     const [partyData, setPartyData] = useState([]);
//     const [disposalData, setDisposalData] = useState([]);
//     const [decorationServices, setDecorationServices] = useState([]);
//     useGetCartItems();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get("https://partydecorhub.com/api/products");
//                 const products = response.data.map(product => ({
//                     id: product.product_id || product.id,
//                     name: product.name,
//                     discounted_price: product.discounted_price,
//                     price: product.price,
//                     description: product.category,
//                     image: BASE_IMAGE_URL + product.thumbnail,
//                     images: [BASE_IMAGE_URL + product.thumbnail],
//                 }));
//                 setPartyData(products.filter(item => item.description === "Party Decor"));
//                 setDisposalData(products.filter(item => item.description === "Disposable Items"));
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             }
//         };

//         const fetchDecorationServices = async () => {
//             try {
//                 const response = await axios.get("https://partydecorhub.com/api/services");
//                 const services = response.data.map(service => ({
//                     id: service.id,
//                     name: service.name,
//                     price: service.price,
//                     image: BASE_IMAGE_URL + service.thumbnail,
//                 }));
//                 setDecorationServices(services);
//             } catch (error) {
//                 console.error("Error fetching decoration services:", error);
//             }
//         };

//         fetchProducts();
//         fetchDecorationServices();
//     }, []);

//     return (
//         <React.Fragment>
//             <HeroSection />
//             <Services />
//             <HomeProductSection products={partyData} section={"Decoration Items"} />
//             <HomeProductSection products={decorationServices} section={"Decoration Services"} />
//             <HomeProductSection products={disposalData} section={"Disposable Items"} />
//             <HomeProductSection products={partyData} section={"Best Sellers"} />
//             <HomeProductSection products={decorationServices} section={"Neon Lights"} />
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
import useGetCartItems from "../hooks/cart/useGetCartItems";
import LazyLoadVertical from "../components/LazyLoadVertical";

const BASE_IMAGE_URL = "https://partydecorhub.com";
const PRODUCTS_PER_LOAD = 10;

function Home() {
    const [partyData, setPartyData] = useState([]);
    const [disposalData, setDisposalData] = useState([]);
    const [decorationServices, setDecorationServices] = useState([]);
    const [loading, setLoading] = useState({
        products: true,
        services: true
    });
    const [visibleCounts, setVisibleCounts] = useState({
        decorationItems: PRODUCTS_PER_LOAD,
        disposableItems: PRODUCTS_PER_LOAD,
        bestSellers: PRODUCTS_PER_LOAD,
        neonLights: PRODUCTS_PER_LOAD
    });

    useGetCartItems();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, servicesRes] = await Promise.all([
                    axios.get("https://partydecorhub.com/api/products"),
                    axios.get("https://partydecorhub.com/api/services")
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

                setPartyData(products.filter(item => item.description === "Party Decor"));
                setDisposalData(products.filter(item => item.description === "Disposable Items"));
                setDecorationServices(services);
                setLoading({ products: false, services: false });
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading({ products: false, services: false });
            }
        };

        fetchData();
    }, []);

    const handleScrollEnd = (section) => {
        setVisibleCounts(prev => ({
            ...prev,
            [section]: prev[section] + PRODUCTS_PER_LOAD
        }));
    };

    return (
        <React.Fragment>
            {/* Hero Section - Load immediately (above the fold) */}
            <HeroSection />
            
            {/* Services - Vertical Lazy Loading */}
            <LazyLoadVertical height="400px">
                <Services />
            </LazyLoadVertical>
            
            {/* Decoration Items - Vertical Lazy Loading + Horizontal Lazy Loading */}
            <LazyLoadVertical height="300px">
                <HomeProductSection 
                    products={partyData.slice(0, visibleCounts.decorationItems)} 
                    section={"Decoration Items"} 
                    isLoading={loading.products}
                    onScrollEnd={() => handleScrollEnd('decorationItems')}
                />
            </LazyLoadVertical>
            
            {/* Decoration Services - Vertical Lazy Loading */}
            <LazyLoadVertical height="300px">
                <HomeProductSection 
                    products={decorationServices} 
                    section={"Decoration Services"} 
                    isLoading={loading.services}
                />
            </LazyLoadVertical>
            
            {/* Disposable Items - Vertical + Horizontal Lazy Loading */}
            <LazyLoadVertical height="300px">
                <HomeProductSection 
                    products={disposalData.slice(0, visibleCounts.disposableItems)} 
                    section={"Disposable Items"} 
                    isLoading={loading.products}
                    onScrollEnd={() => handleScrollEnd('disposableItems')}
                />
            </LazyLoadVertical>
            
            {/* Best Sellers - Vertical + Horizontal Lazy Loading */}
            <LazyLoadVertical height="300px">
                <HomeProductSection 
                    products={partyData.slice(0, visibleCounts.bestSellers)} 
                    section={"Best Sellers"} 
                    isLoading={loading.products}
                    onScrollEnd={() => handleScrollEnd('bestSellers')}
                />
            </LazyLoadVertical>
            
            {/* Neon Lights - Vertical + Horizontal Lazy Loading */}
            <LazyLoadVertical height="300px">
                <HomeProductSection 
                    products={decorationServices.slice(0, visibleCounts.neonLights)} 
                    section={"Neon Lights"} 
                    isLoading={loading.services}
                    onScrollEnd={() => handleScrollEnd('neonLights')}
                />
            </LazyLoadVertical>
            
            {/* Bulk Order Section - Vertical Lazy Loading */}
            <LazyLoadVertical height="500px">
                <BulkOrderSection />
            </LazyLoadVertical>
        </React.Fragment>
    );
}

export default Home;