import React from "react";
import HomeBanner from '../components/Home/HomeBanner/HomeBanner.js';
import HighlightsSection from '../components/Home/Products/FeaturedProducts.js';
import CollectionSection from '../components/Home/Collections/Collection.js';
import BenefitsSection from '../components/Home/services/benefitsSection.js';
import Title from "../components/Home/title/title.jsx";

const titles = [
  { 
    title: "Featured Products",
    description: "Discover our carefully curated collection of products designed to elevate your style and enhance your everyday life."
  },
  {
    title: "Explore Our Categories",
    description: "Discover the latest trends and timeless collections for all genders and ages.<br />Shop our exclusive range of clothing and accessories designed for every occasion."
  },
  {
    title: "Why Choose Us",
    description: "Experience the best shopping with our commitment to quality, fast delivery, and exceptional service."
  }
]

const categories = [
  { title: "Men", season: "Summer 2023", image: "man.png" },
  { title: "Women", season: "Spring 2018", image: "women.png" },
  { title: "Kids", season: "Winter 2024", image: "kid.png" },
];


const Home = () => {
  return (
    <>
      <HomeBanner />
      <Title
        title={titles[0].title}
        description={titles[0].description}
      />
      <HighlightsSection />
      <Title
        title={titles[1].title}
        description={titles[1].description}
      />
      <CollectionSection categories={categories} />
      <Title
        title={titles[2].title}
        description={titles[2].description}
      />
      <BenefitsSection />
    </>
  );
};

export default Home;

