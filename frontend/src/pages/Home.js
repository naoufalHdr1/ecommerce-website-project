import React from "react";
import HomeBanner from '../components/Home/HomeBanner/HomeBanner.js';
import Product from '../components/Home/Products/product.jsx';
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

const featuredProducts = [
  { id: 1, name: "Nike Free RN 2019 iD", category: "Shoes", price: 120, image: "/product1.jpg", rating: 4 },
  { id: 2, name: "Leather Handbag", category: "Bags", price: 200, image: "/product2.jpg", rating: 5 },
  { id: 3, name: "Summer Hat", category: "Accessories", price: 50, image: "/product3.jpg", rating: 3 },
  { id: 4, name: "Adidas Running Shoes", category: "Shoes", price: 140, image: "/product4.jpg", rating: 5 },
];

const Home = () => {
  return (
    <>
      <HomeBanner />
      <Title
        title={titles[0].title}
        description={titles[0].description}
      />
      <section className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2 g-md-4">
          {featuredProducts.map((product) => (
            <Product product={product}/>
          ))}
        </div>
     </section>

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

