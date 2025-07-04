
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAdminProvider } from "./contexts/SupabaseAdminContext";
import { PublicDataProvider } from "./components/PublicDataProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import WhatsappConfig from "./pages/admin/WhatsappConfig";
import ButtonsConfig from "./pages/admin/ButtonsConfig";
import PlansConfig from "./pages/admin/PlansConfig";
import PricingConfig from "./pages/admin/PricingConfig";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import TutorialsConfig from "./pages/admin/TutorialsConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PublicDataProvider>
          <SupabaseAdminProvider>
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
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SupabaseAdminProvider>
        </PublicDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
