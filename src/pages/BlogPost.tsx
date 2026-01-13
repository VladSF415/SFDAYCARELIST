import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import ReactMarkdown from 'react-markdown';
import './legal/LegalPage.css';

interface BlogPostData {
  title: string;
  slug: string;
  metaDescription: string;
  excerpt: string;
  keywords: string[];
  category: string;
  content: string;
  readTime: string;
  publishedDate: string;
  author: string;
  featured: boolean;
  reviewedBy?: string;
  methodology?: string;
  lastUpdated?: string;
  nextReview?: string;
  sources?: string[];
  toolsAnalyzed?: number;
  dataCurrent?: string;
  trustScore?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Blog post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="legal-page">
        <div className="legal-container">
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            fontFamily: "'Courier New', monospace"
          }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/blog" className="back-link">← Back to Blog</Link>
            <h1>Post Not Found</h1>
          </div>
          <div className="legal-content">
            <p>Sorry, we couldn't find the blog post you're looking for.</p>
            <Link to="/blog" style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#000000',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: "'Courier New', monospace",
              fontWeight: '900'
            }}>
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <SocialMetaTags
        title={`${post.title} - SF Daycare List Blog`}
        description={post.metaDescription}
        url={`https://aiplatformslist.com/blog/${post.slug}`}
        type="article"
        author={post.author}
        publishedTime={post.publishedDate}
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/blog" className="back-link">← Back to Blog</Link>

            {/* Category badge */}
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#FFFF00',
              color: '#000000',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.75rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem'
            }}>
              {post.category}
            </div>

            <h1>{post.title}</h1>

            {/* Meta information */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.875rem',
              color: '#666',
              marginTop: '1rem'
            }}>
              <div>
                <strong>By:</strong> {post.author}
              </div>
              <div>
                <strong>Published:</strong> {publishDate}
              </div>
              <div>
                <strong>Read time:</strong> {post.readTime}
              </div>
            </div>

            <p className="last-updated" style={{ marginTop: '1rem' }}>
              {post.excerpt}
            </p>
          </div>

          {/* Trust Signals Section */}
          {(post.methodology || post.lastUpdated || post.sources || post.toolsAnalyzed) && (
            <div style={{
              margin: '2rem auto',
              maxWidth: '900px',
              padding: '1.5rem',
              background: '#f8f9fa',
              border: '3px solid #000',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.85rem'
            }}>
              <div style={{
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                📊 Research Transparency
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {post.lastUpdated && (
                  <div>
                    <strong>Last Updated:</strong> {new Date(post.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}

                {post.reviewedBy && (
                  <div>
                    <strong>Reviewed By:</strong> {post.reviewedBy}
                  </div>
                )}

                {post.toolsAnalyzed && (
                  <div>
                    <strong>Tools Analyzed:</strong> {post.toolsAnalyzed} platforms
                  </div>
                )}

                {post.dataCurrent && (
                  <div>
                    <strong>Data Current As Of:</strong> {post.dataCurrent}
                  </div>
                )}

                {post.methodology && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '2px solid #ddd' }}>
                    <strong>Methodology:</strong> {post.methodology}
                  </div>
                )}

                {post.sources && post.sources.length > 0 && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '2px solid #ddd' }}>
                    <strong>Sources:</strong>
                    <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                      {post.sources.map((source, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="legal-content">
            {/* Blog content with markdown rendering */}
            <div style={{
              fontFamily: "'Courier New', monospace",
              lineHeight: '1.8',
              fontSize: '0.95rem'
            }}>
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginTop: '2.5rem',
                      marginBottom: '1rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '900',
                      marginTop: '2rem',
                      marginBottom: '0.75rem'
                    }}>
                      {children}
                    </h3>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      style={{
                        color: '#000000',
                        textDecoration: 'underline',
                        textDecorationThickness: '2px',
                        fontWeight: '900'
                      }}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.5rem' }}>
                      {children}
                    </li>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Keywords/Tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div style={{
                marginTop: '3rem',
                padding: '1.5rem',
                background: '#f5f5f5',
                border: '4px solid #000000'
              }}>
                <h4 style={{
                  fontFamily: "'Courier New', monospace",
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  Topics:
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {post.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        background: '#ffffff',
                        border: '2px solid #000000',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.75rem',
                        fontWeight: '900'
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#FFFF00',
              border: '4px solid #000000',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontFamily: "'Courier New', monospace",
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginTop: 0
              }}>
                Browse Daycares
              </h3>
              <p style={{ fontFamily: "'Courier New', monospace", marginBottom: '1.5rem' }}>
                Browse our comprehensive directory of 866+ AI tools and platforms.
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#000000',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  border: '4px solid #000000',
                  marginRight: '1rem'
                }}
              >
                Explore Platforms
              </Link>
              <Link
                to="/blog"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#ffffff',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  border: '4px solid #000000'
                }}
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
