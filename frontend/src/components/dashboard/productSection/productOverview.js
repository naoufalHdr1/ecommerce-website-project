import ProductSection from './productSection';
import CategorySection from './categorySection';
import AAA from './a';
import { StateProvider } from './stateContext';

const ProductOverview = () => {
  return (
    <StateProvider>
      <hr/>
      <ProductSection />
      <hr/>
      <CategorySection />
      <hr/>
      <AAA />
    </StateProvider>
  );
};

export default ProductOverview;
