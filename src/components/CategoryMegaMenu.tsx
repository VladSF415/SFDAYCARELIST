import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryMegaMenu.css';

interface Category {
  slug: string;
  name: string;
  count: number;
}

interface CategoryGroup {
  icon: string;
  title: string;
  categories: Category[];
}

interface CategoryMegaMenuProps {
  categories: Category[];
  onCategorySelect?: (slug: string) => void;
}

export function CategoryMegaMenu({ categories, onCategorySelect }: CategoryMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Group categories by theme
  const groupedCategories: CategoryGroup[] = [
    {
      icon: '🤖',
      title: 'AI Infrastructure',
      categories: categories.filter(c =>
        ['ml-frameworks', 'llm-ops', 'llms', 'agent-platforms'].includes(c.slug)
      )
    },
    {
      icon: '🏭',
      title: 'Industry Solutions',
      categories: categories.filter(c =>
        ['healthcare-ai', 'legal-ai', 'enterprise-ai-platforms', 'customer-intelligence'].includes(c.slug)
      )
    },
    {
      icon: '🎨',
      title: 'Creative & Media',
      categories: categories.filter(c =>
        ['generative-ai', 'image-generation', 'video-generation', 'video-ai', 'audio-ai', 'design-creative'].includes(c.slug)
      )
    },
    {
      icon: '💻',
      title: 'Developer Tools',
      categories: categories.filter(c =>
        ['code-ai', 'developer-tools', 'testing-automation', 'no-code', 'vibe-coding'].includes(c.slug)
      )
    },
    {
      icon: '📊',
      title: 'Data & Analytics',
      categories: categories.filter(c =>
        ['analytics-bi', 'data-governance', 'data-analytics', 'search-ai'].includes(c.slug)
      )
    },
    {
      icon: '🎯',
      title: 'Computer Vision & NLP',
      categories: categories.filter(c =>
        ['computer-vision', 'nlp', 'seo-tools'].includes(c.slug)
      )
    },
    {
      icon: '🚀',
      title: 'Business Operations',
      categories: categories.filter(c =>
        ['workflow-automation', 'productivity', 'business-tools', 'sales-tools', 'hr-tools', 'customer-service'].includes(c.slug)
      )
    },
    {
      icon: '🛡️',
      title: 'Specialized',
      categories: categories.filter(c =>
        ['cybersecurity', 'research-ai', 'news-ai', 'marketplace-ai', 'ecommerce-ai', 'ai-search', 'code-assistant', 'ai-assistants'].includes(c.slug)
      )
    }
  ];

  const handleCategoryClick = (slug: string) => {
    setIsOpen(false);
    if (onCategorySelect) {
      onCategorySelect(slug);
    } else {
      navigate(`/category/${slug}`);
      window.scrollTo(0, 0);
    }
  };

  const totalCategories = categories.length;

  return (
    <div className="category-mega-menu" ref={menuRef}>
      <button
        className="category-mega-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Browse categories"
      >
        <span className="trigger-icon">📁</span>
        <span className="trigger-text">BROWSE CATEGORIES</span>
        <span className="trigger-count">({totalCategories})</span>
        <span className={`trigger-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="category-mega-menu-dropdown">
          <div className="mega-menu-header">
            <h3>Browse by Category</h3>
            <button
              className="mega-menu-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="mega-menu-grid">
            {groupedCategories.map((group, idx) => (
              group.categories.length > 0 && (
                <div key={idx} className="mega-menu-group">
                  <div className="mega-menu-group-header">
                    <span className="group-icon">{group.icon}</span>
                    <span className="group-title">{group.title}</span>
                  </div>
                  <ul className="mega-menu-list">
                    {group.categories.map((cat) => (
                      <li key={cat.slug}>
                        <button
                          className="mega-menu-item"
                          onClick={() => handleCategoryClick(cat.slug)}
                        >
                          <span className="item-name">{cat.name}</span>
                          <span className="item-count">{cat.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>

          <div className="mega-menu-footer">
            <button
              className="view-all-btn"
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById('all-categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View All {totalCategories} Categories →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
