import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { ItemListSchema } from '../components/ItemListSchema';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';
import { FAQSchema, VisualFAQ } from '../components/FAQSchema';
import { categoryFAQs } from '../data/categoryFAQs';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { ComparisonTable } from '../components/ComparisonTable';
import { categoryComparisons } from '../data/categoryComparisons';
import './CategoryPage.css';

function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedGuide, setRelatedGuide] = useState<any>(null);

  useEffect(() => {
    fetchPlatforms();
    fetchRelatedGuide();
  }, [category]);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/platforms?category=${category}&limit=1000`);
      const data = await response.json();
      setPlatforms(data.platforms);
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
    setLoading(false);
  };

  const getCategoryPillarSlug = (cat: string): string | null => {
    const mapping: Record<string, string> = {
      'computer-vision': 'computer-vision',
      'ml-frameworks': 'ml-frameworks',
      'code-ai': 'code-ai',
      'llms': 'llms',
      'generative-ai': 'generative-ai',
      'nlp': 'nlp',
      'image-generation': 'image-generation',
      'analytics-bi': 'analytics-bi',
      'video-ai': 'video-ai',
      'video-generation': 'video-generation',
      'agent-platforms': 'agent-platforms',
    };
    return mapping[cat] || null;
  };

  const fetchRelatedGuide = async () => {
    const pillarSlug = getCategoryPillarSlug(category || '');
    if (!pillarSlug) return;

    try {
      const response = await fetch(`/api/pillar/${pillarSlug}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedGuide(data);
      }
    } catch (error) {
      console.error('Failed to fetch related guide:', error);
    }
  };

  const getCategoryName = (cat: string): string => {
    const categoryMap: Record<string, string> = {
      'computer-vision': 'Computer Vision',
      'ml-frameworks': 'ML Frameworks',
      'code-ai': 'Code AI',
      'llms': 'Large Language Models',
      'generative-ai': 'Generative AI',
      'nlp': 'Natural Language Processing',
      'image-generation': 'Image Generation',
      'analytics-bi': 'Analytics & BI',
      'video-ai': 'Video AI',
      'video-generation': 'Video Generation',
      'search-ai': 'Search AI',
      'agent-platforms': 'Agent Platforms',
    };
    return categoryMap[cat || ''] || cat?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown';
  };

  const getCategoryDescription = (cat: string): string => {
    const descriptions: Record<string, string> = {
      'computer-vision': 'Discover the best computer vision AI tools for image recognition, object detection, facial analysis, and visual AI applications. Compare features, pricing, and use cases.',
      'ml-frameworks': 'Explore top machine learning frameworks and platforms for building, training, and deploying ML models. From TensorFlow to PyTorch and beyond.',
      'code-ai': 'Find the best AI coding assistants and tools to boost developer productivity. From GitHub Copilot alternatives to AI code completion and generation.',
      'llms': 'Compare the best large language models (LLMs) including ChatGPT, Claude, GPT-4, and open-source alternatives. Features, pricing, and capabilities.',
      'generative-ai': 'Explore cutting-edge generative AI tools for content creation, image generation, video synthesis, and creative applications.',
      'nlp': 'Discover natural language processing tools for text analysis, sentiment detection, entity extraction, and language understanding.',
      'image-generation': 'Compare the best AI image generators from text-to-image tools like Midjourney and DALL-E to specialized art AI platforms.',
      'analytics-bi': 'Find AI-powered analytics and business intelligence tools for data analysis, visualization, and automated insights.',
      'video-ai': 'Explore AI video editing, enhancement, and production tools for content creators and video professionals.',
      'video-generation': 'Discover AI video generation platforms that create videos from text, images, or simple prompts.',
      'search-ai': 'Find AI-powered search engines and answer tools that provide intelligent, cited results.',
      'agent-platforms': 'Explore AI agent platforms for building autonomous AI workflows and task automation.',
    };
    return descriptions[cat || ''] || `Explore the best ${getCategoryName(cat).toLowerCase()} AI tools and platforms.`;
  };

  const categoryName = getCategoryName(category || '');

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    { name: categoryName, url: `https://aiplatformslist.com/category/${category}` },
  ];

  if (loading) {
    return (
      <div className="category-page">
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '100vh' }}>
          <div className="loading" style={{ color: '#000', fontSize: '1.5rem', fontWeight: '900' }}>
            Loading {categoryName} tools...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={`Best ${categoryName} AI Tools 2026 - Compare Top Platforms`}
        description={getCategoryDescription(category || '')}
        url={`https://aiplatformslist.com/category/${category}`}
        type="website"
      />

      {/* Schema Markup */}
      <ItemListSchema platforms={platforms} category={category || ''} categoryName={categoryName} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="category-hero">
        <div className="container">
          <button onClick={() => navigate('/')} className="back-link-btn">
            ← BACK TO DIRECTORY
          </button>

          <VisualBreadcrumb items={breadcrumbItems} />

          <h1 className="category-title">
            Best {categoryName} AI Tools 2026
          </h1>

          <p className="category-description">
            {getCategoryDescription(category || '')}
          </p>

          <div className="category-stats">
            <div className="category-stat">
              <span className="category-stat-number">{platforms.length}</span>
              <span className="category-stat-label">AI Tools</span>
            </div>
            <div className="category-stat">
              <span className="category-stat-number">
                {platforms.filter(p => p.pricing?.toLowerCase().includes('free')).length}
              </span>
              <span className="category-stat-label">Free Tools</span>
            </div>
            <div className="category-stat">
              <span className="category-stat-number">
                {platforms.filter(p => p.featured).length}
              </span>
              <span className="category-stat-label">Featured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Guide Banner */}
      {relatedGuide && (
        <div style={{
          background: '#000',
          borderTop: '5px solid #000',
          borderBottom: '5px solid #000',
          padding: '40px 0'
        }}>
          <div className="container">
            <div
              onClick={() => navigate(`/guide/${getCategoryPillarSlug(category || '')}`)}
              style={{
                border: '4px solid #fff',
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: '#000',
                color: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '8px 8px 0 #fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '10px',
                    opacity: 0.8
                  }}>
                    📚 COMPREHENSIVE GUIDE
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>
                    {relatedGuide.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    opacity: 0.9,
                    marginBottom: '15px'
                  }}>
                    {relatedGuide.metaDescription}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '16px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  Read Full Guide →
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container category-content">
        {/* SEO Content Block */}
        <div className="category-seo-content">
          <h2>What are {categoryName} AI Tools?</h2>
          <p>
            {categoryName} AI tools are specialized artificial intelligence platforms designed to {getCategoryUseCases(category || '')}.
            These tools leverage advanced machine learning models and algorithms to provide powerful capabilities for {getCategoryTargetUsers(category || '')}.
          </p>

          <h3>Popular Use Cases</h3>
          <ul className="category-use-cases">
            {getCategoryUseCaseList(category || '').map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>

          <h3>How to Choose the Right {categoryName} AI Tool</h3>
          <p>
            When selecting a {categoryName.toLowerCase()} AI tool, consider factors like pricing, ease of use, integration capabilities,
            output quality, and customer support. Below you'll find {platforms.length} platforms to compare.
          </p>
        </div>

        {/* Comparison Table */}
        {category && categoryComparisons[category] && (
          <ComparisonTable
            title={categoryComparisons[category].title}
            description={categoryComparisons[category].description}
            platforms={categoryComparisons[category].platforms}
            features={categoryComparisons[category].features}
          />
        )}

        {/* Platforms Grid */}
        <h2 className="category-platforms-heading">
          All {categoryName} AI Tools ({platforms.length})
        </h2>

        <div className="platforms-grid">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="platform-card"
              onClick={() => navigate(`/platform/${platform.slug || platform.id}`)}
            >
              <div className="platform-card-header">
                <h3 className="platform-card-title">{platform.name}</h3>
                {platform.featured && <span className="platform-badge-featured">⭐ FEATURED</span>}
              </div>

              <p className="platform-card-description">
                {platform.description?.substring(0, 150)}
                {(platform.description?.length || 0) > 150 ? '...' : ''}
              </p>

              {platform.pricing && (
                <div className="platform-card-pricing">
                  💰 {platform.pricing}
                </div>
              )}

              {platform.tags && platform.tags.length > 0 && (
                <div className="platform-card-tags">
                  {platform.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="platform-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {platforms.length === 0 && (
          <div className="category-empty">
            <p>No {categoryName.toLowerCase()} AI tools found yet. Check back soon!</p>
          </div>
        )}

        {/* FAQ Section */}
        {category && categoryFAQs[category] && (
          <>
            <FAQSchema faqs={categoryFAQs[category]} />
            <VisualFAQ faqs={categoryFAQs[category]} />
          </>
        )}

        {/* Newsletter Signup */}
        <NewsletterSignup
          variant="inline"
          title={`Stay Updated on ${categoryName} AI Tools`}
          description={`Get weekly updates on new ${categoryName.toLowerCase()} tools, comparison guides, and exclusive insights. Join 10,000+ AI enthusiasts.`}
        />
      </div>
    </div>
  );
}

// Helper functions for dynamic content
function getCategoryUseCases(category: string): string {
  const useCases: Record<string, string> = {
    'computer-vision': 'analyze images, detect objects, recognize faces, and process visual data',
    'ml-frameworks': 'build, train, and deploy machine learning models at scale',
    'code-ai': 'generate code, autocomplete functions, debug issues, and accelerate software development',
    'llms': 'understand and generate human-like text, answer questions, and assist with complex reasoning tasks',
    'generative-ai': 'create original content including text, images, videos, and audio',
    'nlp': 'process and understand human language, extract insights from text, and enable conversational AI',
    'image-generation': 'create stunning visuals from text descriptions or transform existing images',
    'analytics-bi': 'analyze data, generate insights, and create visualizations automatically',
    'video-ai': 'edit videos, enhance quality, generate subtitles, and automate production workflows',
    'video-generation': 'create professional videos from text prompts, images, or simple inputs',
    'search-ai': 'find information with intelligent search and get accurate, cited answers',
    'agent-platforms': 'build autonomous AI agents that can execute complex multi-step workflows',
  };
  return useCases[category] || 'solve complex problems with artificial intelligence';
}

function getCategoryTargetUsers(category: string): string {
  const users: Record<string, string> = {
    'computer-vision': 'developers, researchers, and businesses working with visual data',
    'ml-frameworks': 'data scientists, ML engineers, and AI researchers',
    'code-ai': 'software developers, engineers, and programming teams',
    'llms': 'businesses, researchers, and developers building AI applications',
    'generative-ai': 'creators, marketers, designers, and content producers',
    'nlp': 'developers, analysts, and businesses processing text data',
    'image-generation': 'designers, artists, marketers, and content creators',
    'analytics-bi': 'business analysts, data teams, and decision makers',
    'video-ai': 'video editors, content creators, and media professionals',
    'video-generation': 'marketers, filmmakers, and content creators',
    'search-ai': 'researchers, students, and professionals seeking accurate information',
    'agent-platforms': 'developers, automation engineers, and businesses',
  };
  return users[category] || 'professionals and teams';
}

function getCategoryUseCaseList(category: string): string[] {
  const useCases: Record<string, string[]> = {
    'computer-vision': [
      'Object detection and tracking',
      'Facial recognition and analysis',
      'Image classification and tagging',
      'Optical character recognition (OCR)',
      'Quality inspection and defect detection',
    ],
    'code-ai': [
      'Code completion and suggestions',
      'Bug detection and fixing',
      'Code documentation generation',
      'Refactoring and optimization',
      'Unit test generation',
    ],
    'llms': [
      'Content generation and writing',
      'Question answering and research',
      'Code generation and debugging',
      'Translation and summarization',
      'Conversational AI and chatbots',
    ],
    'generative-ai': [
      'Text-to-image generation',
      'Content creation and copywriting',
      'Music and audio synthesis',
      'Video generation and editing',
      '3D model creation',
    ],
    'image-generation': [
      'Marketing visuals and ads',
      'Product mockups and prototypes',
      'Art and illustration',
      'Social media content',
      'Concept art and ideation',
    ],
    'video-ai': [
      'Automated video editing',
      'Subtitle generation and translation',
      'Video enhancement and upscaling',
      'Scene detection and analysis',
      'Background removal and replacement',
    ],
  };
  return useCases[category] || [
    'Automation and workflow optimization',
    'Data analysis and insights',
    'Content creation and generation',
    'Research and development',
    'Business process improvement',
  ];
}

export default CategoryPage;
