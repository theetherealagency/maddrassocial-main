import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import AboutUs from "./pages/AboutUs";
import TastingEvent from "./pages/TastingEvent";
import Reservations from "./pages/Reservations";
import GiftCards from "./pages/GiftCards";
import BrunchTasting from "./pages/BrunchTasting";
import Events from "./pages/Events";
// Careers page hidden
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import RouteSeo from "./seo/RouteSeo";
import RouteTracker from "./components/RouteTracker";
import EngagementTracker from "./components/EngagementTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteSeo />
        <RouteTracker />
        <EngagementTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/newsletter" element={<TastingEvent />} />
          <Route path="/brunch-tasting" element={<BrunchTasting />} />
          <Route path="/catering" element={<Events />} />
          {/* Careers route hidden */}
          <Route path="/contact" element={<Contact />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
