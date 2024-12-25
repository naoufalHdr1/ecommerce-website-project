import HeroSection from '../../components/categories/heroSection/hero.jsx';
import CategoriesSection  from '../../components/Home/Collections/Collection.js';
import Title from '../../components/Home/title/title.jsx';
import FeaturedProducts from '../../components/Home/Products/FeaturedProducts.js';
import { useParams } from "react-router-dom";

// Sample data for each category
const categoryData = {
  men: {
    title: "Explore Men’s Categories",
    description: "Find the perfect fit for every occasion. Discover our exclusive range of men’s clothing and accessories designed to elevate your style.",
    banner: ["/manCategory/Banner1.jpg", "/manCategory/Banner2.jpg"],
    categories: [
      {
        title: "Shirts",
        image: "/manCategory/shirts.png",
      },
      {
        title: "Jumpers",
        image: "/manCategory/jumpers.png",
      },
      {
        title: "Jackets",
        image: "/manCategory/jackets.png",
      },
    ]
  },
  women: {
    title: "Explore Women’s Categories",
    description: "Embrace elegance and comfort for every moment. Discover our curated selection of women’s clothing and accessories crafted to inspire confidence and style.",
    banner: ["/womenCategory/Banner1.jpg", "/womenCategory/Banner2.jpg"],
    categories: [
      {
        title: "Shirts",
        image: "/womenCategory/shirts.png",
      },
      {
        title: "Jumpers",
        image: "/womenCategory/jumpers.png",
      },
      {
        title: "Jackets",
        image: "/womenCategory/jackets.png",
      },
    ]
  },
  kids: {
    title: "Explore Kids’ Categories",
    description: "Make every day special for the little ones. Explore our playful and stylish collection of kids’ clothing and accessories designed for all occasions.",
    banner: [],
    categories: [],
  },
};
const categories = [
  { title: "Shirts", image: "/shirts.png" },
  { title: "Jumpers", image: "/jumpers.png" },
  { title: "Jackets", image: "/jackets.png" },
];

const Categories = () => {
  const { category } = useParams();

  const data = categoryData[category];

  // Handle invalid category (optional)
  if (!data) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <HeroSection
        title={data.title}
        description={data.description}
        banner={data.banner}
        category={category}
      />
      <CategoriesSection categories={data.categories} />
      <Title title="You might also like"/>
      <FeaturedProducts />
    </>
  );
}

export default Categories;
