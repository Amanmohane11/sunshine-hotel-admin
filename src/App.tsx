import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordGate from "./components/PasswordGate";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import ServicesPage from "./pages/ServicesPage";
import StaffPage from "./pages/StaffPage";
import HRPage from "./pages/HRPage";
import NotificationsPage from "./pages/NotificationsPage";
import AllProductsPage from "./pages/inventory/AllProductsPage";
import CreateBillPage from "./pages/inventory/CreateBillPage";
import BillHistoryPage from "./pages/inventory/BillHistoryPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import GuestCRMPage from "./pages/GuestCRMPage";
import SADashboardPage from "./pages/super-admin/SADashboardPage";
import SAHotelsPage from "./pages/super-admin/SAHotelsPage";
import SAQueriesPage from "./pages/super-admin/SAQueriesPage";
import SASubscriptionsPage from "./pages/super-admin/SASubscriptionsPage";
import BillingPage from "./pages/BillingPage";
import ReportsPage from "./pages/ReportsPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFound from "./pages/NotFound";
import { useAppSelector } from "./store";

const queryClient = new QueryClient();

const HotelOnly = ({ children }: { children: React.ReactNode }) => {
  const role = useAppSelector(s => s.auth.user?.role);
  if (role === 'superadmin') return <Navigate to="/super-admin" replace />;
  return <>{children}</>;
};

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
                  {/* Hotel Admin routes */}
                  <Route path="/" element={<HotelOnly><HomePage /></HotelOnly>} />
                  <Route path="/dashboard" element={<HotelOnly><PasswordGate pageName="Dashboard"><DashboardPage /></PasswordGate></HotelOnly>} />
                  <Route path="/rooms" element={<HotelOnly><RoomsPage /></HotelOnly>} />
                  <Route path="/services" element={<HotelOnly><ServicesPage /></HotelOnly>} />
                  <Route path="/staff" element={<HotelOnly><StaffPage /></HotelOnly>} />
                  <Route path="/hr" element={<HotelOnly><PasswordGate pageName="HR & Payroll"><HRPage /></PasswordGate></HotelOnly>} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/inventory" element={<HotelOnly><AllProductsPage /></HotelOnly>} />
                  <Route path="/inventory/create-bill" element={<HotelOnly><CreateBillPage /></HotelOnly>} />
                  <Route path="/inventory/history" element={<HotelOnly><BillHistoryPage /></HotelOnly>} />
                  <Route path="/booking-history" element={<HotelOnly><BookingHistoryPage /></HotelOnly>} />
                  <Route path="/customers" element={<HotelOnly><GuestCRMPage /></HotelOnly>} />
                  <Route path="/billing" element={<HotelOnly><BillingPage /></HotelOnly>} />
                  <Route path="/reports" element={<HotelOnly><PasswordGate pageName="Reports"><ReportsPage /></PasswordGate></HotelOnly>} />
                  <Route path="/guest-crm" element={<HotelOnly><GuestCRMPage /></HotelOnly>} />
                  <Route path="/help" element={<HotelOnly><HelpPage /></HotelOnly>} />
                  <Route path="/settings" element={<HotelOnly><SettingsPage /></HotelOnly>} />
                  <Route path="/subscription" element={<HotelOnly><SubscriptionPage /></HotelOnly>} />

                  {/* Super Admin routes */}
                  <Route path="/super-admin" element={<SuperOnly><SADashboardPage /></SuperOnly>} />
                  <Route path="/super-admin/hotels" element={<SuperOnly><SAHotelsPage /></SuperOnly>} />
                  <Route path="/super-admin/queries" element={<SuperOnly><SAQueriesPage /></SuperOnly>} />
                  <Route path="/super-admin/subscriptions" element={<SuperOnly><SASubscriptionsPage /></SuperOnly>} />

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
