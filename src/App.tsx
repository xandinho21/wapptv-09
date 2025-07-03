import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import WhatsappConfig from "./pages/admin/WhatsappConfig";
import ButtonsConfig from "./pages/admin/ButtonsConfig";
import PlansConfig from "./pages/admin/PlansConfig";
import PricingConfig from "./pages/admin/PricingConfig";
import NotFound from "./pages/NotFound";
import TutorialsConfig from "./pages/admin/TutorialsConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<WhatsappConfig />} />
              <Route path="whatsapp" element={<WhatsappConfig />} />
              <Route path="buttons" element={<ButtonsConfig />} />
              <Route path="plans" element={<PlansConfig />} />
              <Route path="tutorials" element={<TutorialsConfig />} />
              <Route path="pricing" element={<PricingConfig />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
