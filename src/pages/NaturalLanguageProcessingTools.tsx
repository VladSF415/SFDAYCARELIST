import { useState, useEffect } from 'react';
import type { Platform } from '../types';
import { LandingPageTemplate, type LandingPageContent } from '../components/LandingPageTemplate';
import UseCaseMatcher from '../components/UseCaseMatcher';

function NaturalLanguageProcessingTools() {
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
      const contentResponse = await fetch('/api/landing/natural-language-processing-tools');
      if (contentResponse.ok) {
        const landingContent = await contentResponse.json();
        setContent(landingContent);
      }

      // Fetch NLP platforms
      const platformsResponse = await fetch('/api/platforms?category=nlp&limit=100&sort=rating&order=desc');
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
      interactiveComponent={<UseCaseMatcher />}
      breadcrumbCategory="Resources"
    />
  );
}

export default NaturalLanguageProcessingTools;
