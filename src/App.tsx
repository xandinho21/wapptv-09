
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PublicDataProvider } from "./contexts/PublicDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import WhatsappConfig from "./pages/admin/WhatsappConfig";
import ButtonsConfig from "./pages/admin/ButtonsConfig";
import PlansConfig from "./pages/admin/PlansConfig";
import PricingConfig from "./pages/admin/PricingConfig";
import AdminSettings from "./pages/admin/AdminSettings";
import SiteConfig from "./pages/admin/SiteConfig";
import SeoConfig from "./pages/admin/SeoConfig";
import NotFound from "./pages/NotFound";
import TutorialsConfig from "./pages/admin/TutorialsConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PublicDataProvider>
          <AdminProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<WhatsappConfig />} />
                  <Route path="whatsapp" element={<WhatsappConfig />} />
                  <Route path="buttons" element={<ButtonsConfig />} />
                  <Route path="plans" element={<PlansConfig />} />
                  <Route path="tutorials" element={<TutorialsConfig />} />
                  <Route path="pricing" element={<PricingConfig />} />
                  <Route path="seo" element={<SeoConfig />} />
                  <Route path="site" element={<SiteConfig />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </PublicDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
