import HeroSection from '../../components/categories/heroSection/hero.jsx';
import CategoryCard  from '../../components/Home/Collections/categoryCard';
import Title from '../../components/Home/title/title.jsx';
import Product from '../../components/Home/Products/product.jsx';
import { useStateContext } from '../../components/dashboard/productSection/stateContext';
import { useParams } from "react-router-dom";

const Categories = () => {
  const { categoryName } = useParams();
  const { state } = useStateContext(); 
  const { products, subcategories, categories } = state;
  const category = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  const subcategory = subcategories.filter((subcat) => subcat.category_id === category._id) ;
  const subcategoryIds = subcategory.map((subcat) => subcat._id);
  const featuredProducts = products
    .filter(
      (p) => p.isFeatured && subcategoryIds.includes(p.subcategory_id)
    )
    .slice(0, 4);

  // Handle invalid category
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <HeroSection
        category={category}
      />
      {subcategory && subcategory.length > 0 ? (
        <CategoryCard type='subcat' categories={subcategory} categoryName={category.name}/>
      ) : (
        <p className="text-secondary fst-italic d-flex justify-content-center">
          <div className="border rounded-5 p-2">
            <i class="bi bi-info-circle me-1"></i> No subcategories found
          </div>
        </p>
      )}
      <Title title="You might also like"/>
      <section className="container my-5">
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2 g-md-4">
            {featuredProducts.map((product) => (
              <Product product={product}/>
            ))}
          </div>
        ) : (
          <p className="text-secondary fst-italic d-flex justify-content-center">
            <div className="border rounded-5 p-2">
              <i class="bi bi-info-circle me-1"></i> No featured products found
            </div>
          </p>
        )}
     </section>
    </>
  );
}

export default Categories;
