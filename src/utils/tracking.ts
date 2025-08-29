// Meta Pixel & Google Analytics event tracking utilities

declare global {
  interface Window {
    fbq: any;
    gtag: any;
  }
}

export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  // Meta Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, eventData);
  }
  
  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName.toLowerCase(), eventData);
  }
};

// Predefined event tracking functions
export const tracking = {
  // Lead generation events
  leadGenerated: (source: string) => {
    trackEvent('Lead', { 
      source,
      value: 50,
      currency: 'GEL'
    });
  },
  
  // Form events
  formStart: (formName: string) => {
    trackEvent('InitiateCheckout', { 
      content_name: formName,
      content_category: 'Form'
    });
  },
  
  formComplete: (formName: string, value: number = 0) => {
    trackEvent('CompleteRegistration', { 
      content_name: formName,
      value,
      currency: 'GEL'
    });
  },
  
  // Button clicks
  buttonClick: (buttonName: string, location: string) => {
    trackEvent('ViewContent', { 
      content_name: buttonName,
      content_category: 'CTA_Button',
      source: location
    });
  },
  
  // Pricing interactions
  pricingView: () => {
    trackEvent('ViewContent', { 
      content_name: 'Pricing_Section',
      content_category: 'Pricing'
    });
  },
  
  courseInterest: (courseType: string) => {
    trackEvent('AddToCart', { 
      content_name: courseType,
      content_category: 'Course',
      value: courseType === 'free-courses' ? 0 : 250,
      currency: 'GEL'
    });
  },
  
  // Engagement events
  scrollDepth: (percentage: number) => {
    trackEvent('ViewContent', { 
      content_name: `Scroll_${percentage}%`,
      content_category: 'Engagement'
    });
  },
  
  timeOnPage: (seconds: number) => {
    trackEvent('ViewContent', { 
      content_name: `TimeOnPage_${Math.floor(seconds/30)*30}s`,
      content_category: 'Engagement'
    });
  }
};