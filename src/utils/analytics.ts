// Google Analytics event tracking utility

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventNameOrConfig: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-87QJXFEQQD', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Predefined event trackers
export const analytics = {
  // Track platform view
  viewPlatform: (platformName: string, platformId: string) => {
    trackEvent('view_platform', {
      platform_name: platformName,
      platform_id: platformId,
    });
  },

  // Track platform click (external visit)
  clickPlatform: (platformName: string, platformId: string, url: string) => {
    trackEvent('click_platform', {
      platform_name: platformName,
      platform_id: platformId,
      destination_url: url,
    });
  },

  // Track search
  search: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  // Track category filter
  filterCategory: (category: string) => {
    trackEvent('filter_category', {
      category: category,
    });
  },

  // Track tool submission start
  startSubmission: () => {
    trackEvent('begin_tool_submission');
  },

  // Track tool submission complete
  completeSubmission: (toolName: string, featured: boolean) => {
    trackEvent('complete_tool_submission', {
      tool_name: toolName,
      featured: featured,
    });
  },
};
