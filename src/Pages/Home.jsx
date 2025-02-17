import React from "react";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BulkOrderSection from "../components/BulkOrderSection";
import HomeProductSection from "../components/HomeProductSection";
import { decorationData, disposalData, partyData } from "../data/data";
import { Helmet } from "react-helmet";


function Home() {
    return (
        <React.Fragment>
            <Helmet>
                <title>Home | Decor Hub</title>
                <meta name="description" content="Discover premium home decor products at Decor Hub." />
                <meta name="keywords" content="home decor, party supplies, disposable items" />
            </Helmet>
            <HeroSection />
            <Services />
            <HomeProductSection  products={partyData} section={"Party"}/>
            <HomeProductSection  products={decorationData} section={"Decoration"}/>
            <HomeProductSection  products={disposalData} section={"Disposable"}/>
            <BulkOrderSection />
        </React.Fragment>
    );
}

export default Home;
