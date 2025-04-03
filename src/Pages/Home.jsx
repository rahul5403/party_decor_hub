import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import useGetCartItems from "../hooks/Cart/useGetCartItems.js";
import LazyLoadVertical from "../components/LazyLoadVertical";
import useHomeData from "../hooks/Home/useFetchData";

const PRODUCTS_PER_LOAD = 10;

function Home() {
    const {
        partyData,
        disposalData,
        decorationServices,
        loading
    } = useHomeData();

    const [visibleCounts, setVisibleCounts] = useState({
        decorationItems: PRODUCTS_PER_LOAD,
        disposableItems: PRODUCTS_PER_LOAD,
        bestSellers: PRODUCTS_PER_LOAD,
        neonLights: PRODUCTS_PER_LOAD
    });

    useGetCartItems();

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