import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
import Navigation from './components/Navigation';
import ScrollButtons from './components/ScrollButtons';
// import ChatWidget from './components/ChatWidget'; // REMOVED - AI Platforms leftover
import Home from './pages/Home';
import DaycareDetail from './pages/DaycareDetail';
import SubmitTool from './pages/SubmitTool';
import PillarPage from './pages/PillarPage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import DMCA from './pages/legal/DMCA';
import Disclaimer from './pages/legal/Disclaimer';
import Footer from './components/Footer';

// Lazy load neighborhood page
const NeighborhoodPage = lazy(() => import('./pages/NeighborhoodPage'));

// Track page views on route change
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <PageViewTracker />
      <div className="app-container">
        <Navigation />
        <Suspense fallback={<div className="loading" style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/daycare/:slug" element={<DaycareDetail />} />
            <Route path="/submit" element={<SubmitTool />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />

            {/* Neighborhood Pages */}
            <Route path="/neighborhood/:slug" element={<NeighborhoodPage />} />

            {/* Parent Resource Pages (to be built) */}
            <Route path="/choosing-a-daycare" element={<PillarPage />} />
            <Route path="/licensing-information" element={<PillarPage />} />
            <Route path="/financial-aid" element={<PillarPage />} />
            <Route path="/preschool-readiness" element={<PillarPage />} />

            {/* Legacy redirects - keep for SEO */}
            <Route path="/category/:category" element={<NeighborhoodPage />} />
            <Route path="/platform/:slug" element={<DaycareDetail />} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </Suspense>
        <ScrollButtons />
        {/* <ChatWidget /> */} {/* REMOVED - AI Platforms leftover */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
