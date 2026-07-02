import ShopProductCard from '@/components/shop/ProductCard';

export default function ProductCard({ product, onAddToCart }) {
  // Reuse the shop card to keep styling consistent between shop and home.
  return <ShopProductCard product={product} onAddToCart={onAddToCart} />;
}

