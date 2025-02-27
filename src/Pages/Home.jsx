import React from "react";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import { decorationData, disposalData, partyData } from "../data/data";
import { Helmet, HelmetProvider } from "react-helmet-async";


function Home() {
    return (
        <React.Fragment>
            <Helmet>
                <title>Home | Party Decor Hub</title>
                <meta name="description" content="Discover premium home decor products at Party Decor Hub." />
                <meta name="keywords" content="home decor, party supplies, disposable items" />
            </Helmet>
            <HeroSection />
            <Services />
            <HomeProductSection  products={partyData} section={"Decoration Items"}/>
            <HomeProductSection  products={decorationData} section={"Decoration Services"}/>
            <HomeProductSection  products={disposalData} section={"Disposable Items"}/>
            <BulkOrderSection />
        </React.Fragment>
    );
}

export default Home;
