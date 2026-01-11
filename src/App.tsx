import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
import Navigation from './components/Navigation';
import ScrollButtons from './components/ScrollButtons';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import DaycareDetail from './pages/DaycareDetail';
import SubmitTool from './pages/SubmitTool';
import PlatformDetail from './pages/PlatformDetailRedesign';
import CategoryPage from './pages/CategoryPage';
import PillarPage from './pages/PillarPage';
import ComparisonPage from './pages/ComparisonPage';
import Comparisons from './pages/Comparisons';
import AlternativesPage from './pages/AlternativesPage';
import BestOfPage from './pages/BestOfPage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Methodology from './pages/Methodology';
import Guides from './pages/Guides';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import DMCA from './pages/legal/DMCA';
import Disclaimer from './pages/legal/Disclaimer';
import Footer from './components/Footer';

// Lazy load landing pages for better performance
const HowToChooseAIPlatforms = lazy(() => import('./pages/HowToChooseAIPlatforms'));
const MachineLearningToolsDirectory = lazy(() => import('./pages/MachineLearningToolsDirectory'));
const NaturalLanguageProcessingTools = lazy(() => import('./pages/NaturalLanguageProcessingTools'));
const ComputerVisionPlatforms = lazy(() => import('./pages/ComputerVisionPlatforms'));
const EnterpriseAISolutions = lazy(() => import('./pages/EnterpriseAISolutions'));

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
            <Route path="/" element={<Home />} />
            <Route path="/daycare/:slug" element={<DaycareDetail />} />
            <Route path="/submit" element={<SubmitTool />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/guide/:slug" element={<PillarPage />} />
            <Route path="/comparisons" element={<Comparisons />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            <Route path="/alternatives/:slug" element={<AlternativesPage />} />
            <Route path="/best/:slug" element={<BestOfPage />} />
            <Route path="/platform/:slug" element={<PlatformDetail />} />

            {/* SEO Landing Pages */}
            <Route path="/how-to-choose-ai-platforms" element={<HowToChooseAIPlatforms />} />
            <Route path="/machine-learning-tools-directory" element={<MachineLearningToolsDirectory />} />
            <Route path="/natural-language-processing-tools" element={<NaturalLanguageProcessingTools />} />
            <Route path="/computer-vision-platforms" element={<ComputerVisionPlatforms />} />
            <Route path="/enterprise-ai-solutions" element={<EnterpriseAISolutions />} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </Suspense>
        <ScrollButtons />
        <ChatWidget />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
