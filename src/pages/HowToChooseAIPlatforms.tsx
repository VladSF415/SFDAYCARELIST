import { useState, useEffect } from 'react';
import type { Platform } from '../types';
import { LandingPageTemplate, type LandingPageContent } from '../components/LandingPageTemplate';
import PlatformSelectorQuiz from '../components/PlatformSelectorQuiz';
import '../styles/InteractiveComponents.css';

function HowToChooseAIPlatforms() {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch landing page content
      const contentResponse = await fetch('/api/landing/how-to-choose-ai-platforms');
      if (contentResponse.ok) {
        const landingContent = await contentResponse.json();
        setContent(landingContent);
      }

      // Fetch top-rated platforms across all categories
      const platformsResponse = await fetch('/api/platforms?limit=20&sort=rating&order=desc');
      const platformsData = await platformsResponse.json();
      setPlatforms(platformsData.platforms || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  return (
    <LandingPageTemplate
      content={content}
      platforms={platforms}
      loading={loading}
      interactiveComponent={<PlatformSelectorQuiz />}
      breadcrumbCategory="Resources"
    />
  );
}

export default HowToChooseAIPlatforms;
