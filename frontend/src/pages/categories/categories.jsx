import HeroSection from '../../components/categories/heroSection/hero.jsx';
import CategoriesSection  from '../../components/Home/Collections/Collection.js';
import Title from '../../components/Home/title/title.jsx';
import FeaturedProducts from '../../components/Home/Products/FeaturedProducts.js';

const categories = [
  { title: "Shirts", image: "shirts.png" },
  { title: "Jumpers", image: "jumpers.png" },
  { title: "Jackets", image: "jackets.png" },
];


const Categories = () => {
  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <Title title="You might also like"/>
      <FeaturedProducts />
    </>
  );
}

export default Categories;
