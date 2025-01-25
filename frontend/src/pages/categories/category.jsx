import HeroSection from '../../components/categories/heroSection/hero.jsx';
import CategoriesSection  from '../../components/Home/Collections/Collection.js';
import Title from '../../components/Home/title/title.jsx';
import Product from '../../components/Home/Products/product.jsx';
import { useStateContext } from '../../components/dashboard/productSection/stateContext';
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
  const { categoryName } = useParams();
  const { state } = useStateContext(); 
  const { products, subcategories, categories } = state;
  const category = categories.find((cat) => cat.name.toLowerCase() === categoryName)
  const subcategory = subcategories.filter((subcat) => subcat.category_id === category._id) 
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  // Handle invalid category
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <HeroSection
        category={category}
      />
      <CategoriesSection categories={subcategory} />
      <Title title="You might also like"/>
      <section className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2 g-md-4">
          {featuredProducts.map((product) => (
            <Product product={product}/>
          ))}
        </div>
     </section>
    </>
  );
}

export default Categories;
