import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TechStackManager from "./pages/admin/TechStackManager";
import ServicesManager from "./pages/admin/ServicesManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import ClientReviewsManager from "./pages/admin/ClientReviewsManager";
import InquiriesManager from "./pages/admin/InquiriesManager";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectBrief from "./pages/ProjectBrief";
import Services from "./pages/Services";
import ScheduleConsultation from "./pages/ScheduleConsultation";

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/brief/:id" element={<ProjectBrief />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/schedule" element={<ScheduleConsultation />} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="techstack" element={<TechStackManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="reviews" element={<ClientReviewsManager />} />
            <Route path="inquiries" element={<InquiriesManager />} />
          </Route>
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}