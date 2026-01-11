import { useState, useEffect } from 'react';
import type { Platform } from '../types';
import { LandingPageTemplate, type LandingPageContent } from '../components/LandingPageTemplate';
import ComparisonWidget from '../components/ComparisonWidget';

function MachineLearningToolsDirectory() {
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
      const contentResponse = await fetch('/api/landing/machine-learning-tools-directory');
      if (contentResponse.ok) {
        const landingContent = await contentResponse.json();
        setContent(landingContent);
      }

      // Fetch ML platforms from multiple categories
      const categories = ['ml-frameworks', 'llm-ops', 'data-governance'];
      const categoryQuery = categories.map(c => `category=${c}`).join('&');
      const platformsResponse = await fetch(`/api/platforms?${categoryQuery}&limit=100&sort=rating&order=desc`);
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
      interactiveComponent={<ComparisonWidget />}
      breadcrumbCategory="Resources"
    />
  );
}

export default MachineLearningToolsDirectory;
