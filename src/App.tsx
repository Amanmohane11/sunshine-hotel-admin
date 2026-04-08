import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
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
import BillingPage from "./pages/BillingPage";
import ReportsPage from "./pages/ReportsPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";
import { useAppSelector } from "./store";

const queryClient = new QueryClient();

/* Wrapper that redirects superadmin away from hotel pages */
const HotelOnly = ({ children }: { children: React.ReactNode }) => {
  const role = useAppSelector(s => s.auth.user?.role);
  if (role === 'superadmin') return <Navigate to="/super-admin" replace />;
  return <>{children}</>;
};

/* Wrapper that redirects hoteladmin away from super-admin pages */
const SuperOnly = ({ children }: { children: React.ReactNode }) => {
  const role = useAppSelector(s => s.auth.user?.role);
  if (role !== 'superadmin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  {/* Hotel Admin routes — blocked for superadmin */}
                  <Route path="/" element={<HotelOnly><HomePage /></HotelOnly>} />
                  <Route path="/dashboard" element={<HotelOnly><DashboardPage /></HotelOnly>} />
                  <Route path="/rooms" element={<HotelOnly><RoomsPage /></HotelOnly>} />
                  <Route path="/services" element={<HotelOnly><ServicesPage /></HotelOnly>} />
                  <Route path="/staff" element={<HotelOnly><StaffPage /></HotelOnly>} />
                  <Route path="/hr" element={<HotelOnly><HRPage /></HotelOnly>} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/inventory" element={<HotelOnly><InventoryPage /></HotelOnly>} />
                  <Route path="/inventory/create-bill" element={<HotelOnly><InventoryPage /></HotelOnly>} />
                  <Route path="/inventory/history" element={<HotelOnly><InventoryPage /></HotelOnly>} />
                  <Route path="/booking-history" element={<HotelOnly><BookingHistoryPage /></HotelOnly>} />
                  <Route path="/customers" element={<HotelOnly><GuestCRMPage /></HotelOnly>} />
                  <Route path="/billing" element={<HotelOnly><BillingPage /></HotelOnly>} />
                  <Route path="/reports" element={<HotelOnly><ReportsPage /></HotelOnly>} />
                  <Route path="/guest-crm" element={<HotelOnly><GuestCRMPage /></HotelOnly>} />
                  <Route path="/help" element={<HelpPage />} />

                  {/* Super Admin routes — blocked for hoteladmin */}
                  <Route path="/super-admin" element={<SuperOnly><SuperAdminPage /></SuperOnly>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
