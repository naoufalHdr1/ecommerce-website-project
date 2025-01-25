import { useState } from "react";
import FilterSidebar from "./filterSidebar.jsx";
import ProductsGrid from "./productsGrid.jsx";
import Product from '../../Home/Products/product';
import { useStateContext } from '../../dashboard/productSection/stateContext';
import { useParams } from "react-router-dom";

const CategoryProductsPage = () => {
  const { id } = useParams();
  const { state } = useStateContext();
  const { products, subcategories, categories} = state;
  const productsBySub = products.filter((p) => p.subcategory_id === id);
  const [filters, setFilters] = useState({
    category: ["Shirts", "Jumpers", "Jackets"],
    size: ["S", "M", "L", "XL"],
    color: ["Red", "Blue", "Green", "Black"],
  });

  const handleFilterChange = (selectedFilters) => {
    console.log("Selected Filters: ", selectedFilters);
    // Add filtering logic here
  };

  return (
    <div className="category-products-page d-md-flex">
      <div className="filter-sidebar-container">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <section className="container my-5">
        {productsBySub && productsBySub.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2 g-md-4">
            {productsBySub.map((product) => (
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

    </div>
  );
};

export default CategoryProductsPage;
