import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "./components/AdminLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import ServicesPage from "./pages/ServicesPage";
import StaffPage from "./pages/StaffPage";
import HRPage from "./pages/HRPage";
import NotificationsPage from "./pages/NotificationsPage";
import InventoryPage from "./pages/InventoryPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import GuestCRMPage from "./pages/GuestCRMPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/hr" element={<HRPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/booking-history" element={<BookingHistoryPage />} />
            <Route path="/guest-crm" element={<GuestCRMPage />} />
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
