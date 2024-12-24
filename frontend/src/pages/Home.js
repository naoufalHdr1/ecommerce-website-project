import React from "react";
import HomeBanner from '../components/Home/HomeBanner/HomeBanner.js';
import HighlightsSection from '../components/Home/Products/FeaturedProducts.js';
import CollectionSection from '../components/Home/Collections/Collection.js';

const Home = () => {
  return (
    <>
      <HomeBanner />
      <HighlightsSection />
      <CollectionSection />
    </>
  );
};

export default Home;

