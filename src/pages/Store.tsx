import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore, ShopifyProduct } from '@/stores/cartStore';
import { CartDrawer } from '@/components/CartDrawer';
import { storefrontApiRequest, PRODUCTS_QUERY } from '@/lib/shopify';
import { toast } from 'sonner';
import storeSealBlue from '@/assets/store-seal-blue.png';
import storeMerch1 from '@/assets/store-merch-1.png';
import storeMerch2 from '@/assets/store-merch-2.jpeg';
import storeMerch3 from '@/assets/store-merch-3.png';

const Store = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50 });
        setProducts(data?.data?.products?.edges || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success('Added to cart', { description: product.node.title });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4"
              >
                <ShoppingBag className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">{t('nav.store')}</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground"
              >
                Aladiah Academy Store
              </motion.h1>
            </div>
            <CartDrawer />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #5b9bb5 0%, #3a7d99 30%, #2a6a85 60%, #1d5570 100%)' }}>
              {/* Background merch images */}
              <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-[0.12]">
                <div className="overflow-hidden">
                  <img src={storeMerch1} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <img src={storeMerch2} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <img src={storeMerch3} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-16 lg:py-24 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-[75vw] max-w-[550px] mb-10"
                >
                  <img src={storeSealBlue} alt="Aladiah Academy Seal" className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.2)]" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-display font-bold text-white mb-3 text-center"
                >
                  Merchandise Coming Soon
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-lg max-w-md text-center"
                >
                  Official Aladiah Academy merchandise is on its way. Stay tuned!
                </motion.p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const image = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <motion.div
                    key={product.node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-soft hover:shadow-large transition-all duration-300"
                  >
                    <div className="aspect-square bg-muted overflow-hidden">
                      {image ? (
                        <img src={image.url} alt={image.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-foreground mb-1 truncate">{product.node.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.node.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="coral"
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
