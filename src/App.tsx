import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkeletonPage from "@/components/SkeletonPage";
import Index from "./pages/Index";
const Products = lazy(() => import("./pages/Products"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const CargoTracking = lazy(() => import("./pages/CargoTracking"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const WarrantyReturn = lazy(() => import("./pages/WarrantyReturn"));
const PrivacyKVKK = lazy(() => import("./pages/PrivacyKVKK"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const PartFinder = lazy(() => import("./pages/PartFinder"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminSiteEdit = lazy(() => import("./pages/admin/AdminSiteEdit"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAuditLog = lazy(() => import("./pages/admin/AdminAuditLog"));
const AdminTVModels = lazy(() => import("./pages/admin/AdminTVModels"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<SkeletonPage />}>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/urunler" element={<Products />} />
                <Route path="/urun/:slug" element={<ProductPage />} />
                <Route path="/marka/:slug" element={<BrandPage />} />
                <Route path="/kargo-takip" element={<CargoTracking />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/sss" element={<FAQ />} />
                <Route path="/garanti-iade" element={<WarrantyReturn />} />
                <Route path="/gizlilik-kvkk" element={<PrivacyKVKK />} />
                <Route path="/cerez-politikasi" element={<CookiePolicy />} />
                <Route path="/parca-bulucu" element={<PartFinder />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/urunler" element={<AdminProducts />} />
                <Route path="/admin/markalar" element={<AdminBrands />} />
                <Route path="/admin/kategoriler" element={<AdminCategories />} />
                <Route path="/admin/seo" element={<AdminSEO />} />
                <Route path="/admin/site-duzenle" element={<AdminSiteEdit />} />
                <Route path="/admin/medya" element={<AdminMedia />} />
                <Route path="/admin/kullanicilar" element={<AdminUsers />} />
                <Route path="/admin/islem-kaydi" element={<AdminAuditLog />} />
                <Route path="/admin/tv-modelleri" element={<AdminTVModels />} />
                <Route path="/admin/mesajlar" element={<AdminMessages />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
