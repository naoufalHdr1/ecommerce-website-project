import React from "react";
import HomeBanner from '../components/Home/HomeBanner/HomeBanner.js';
import HighlightsSection from '../components/Home/Products/FeaturedProducts.js';
import CollectionSection from '../components/Home/Collections/Collection.js';
import BenefitsSection from '../components/Home/services/benefitsSection.js';


const Home = () => {
  return (
    <>
      <HomeBanner />
      <HighlightsSection />
      <CollectionSection />
      <BenefitsSection />
    </>
  );
};

export default Home;

