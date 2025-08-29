import { useEffect } from 'react';

// A/B Test Configuration
export const AB_TESTS = {
  HERO_CTA: {
    name: 'hero_cta_test',
    variants: ['control', 'variant_a'],
    weights: [0.5, 0.5] // 50/50 split
  },
  PRICING_LAYOUT: {
    name: 'pricing_layout_test',
    variants: ['control', 'variant_a'],
    weights: [0.5, 0.5]
  },
  EXIT_POPUP_TIMING: {
    name: 'exit_popup_timing_test',
    variants: ['30s', '60s', '90s'],
    weights: [0.33, 0.33, 0.34]
  }
} as const;

// Event Types for Tracking
export type TrackingEvent = 
  | 'page_view'
  | 'lead_form_submit'
  | 'pricing_click'
  | 'exit_intent_trigger'
  | 'social_proof_click'
  | 'sticky_cta_click'
  | 'hero_cta_click'
  | 'testimonial_engagement';

interface ABTestVariant {
  testName: string;
  variant: string;
}

class ABTestTracker {
  private static instance: ABTestTracker;
  private userVariants: Map<string, string> = new Map();
  
  public static getInstance(): ABTestTracker {
    if (!ABTestTracker.instance) {
      ABTestTracker.instance = new ABTestTracker();
    }
    return ABTestTracker.instance;
  }

  // Get user's variant for a specific test
  public getVariant(testName: keyof typeof AB_TESTS): string {
    if (this.userVariants.has(testName)) {
      return this.userVariants.get(testName)!;
    }

    const test = AB_TESTS[testName];
    const variant = this.assignVariant(test.variants, test.weights);
    this.userVariants.set(testName, variant);
    
    // Store in localStorage for persistence
    localStorage.setItem(`ab_test_${testName}`, variant);
    
    // Track assignment
    this.track('variant_assignment', {
      test_name: testName,
      variant: variant,
      timestamp: Date.now()
    });

    return variant;
  }

  // Assign variant based on weights
  private assignVariant(variants: readonly string[], weights: readonly number[]): string {
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < variants.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return variants[i];
      }
    }
    
    return variants[0]; // fallback
  }

  // Load existing variants from localStorage
  public loadStoredVariants(): void {
    Object.keys(AB_TESTS).forEach(testName => {
      const stored = localStorage.getItem(`ab_test_${testName}`);
      if (stored) {
        this.userVariants.set(testName, stored);
      }
    });
  }

  // Track conversion events
  public track(event: TrackingEvent | 'variant_assignment', data: Record<string, any> = {}): void {
    const trackingData = {
      event,
      timestamp: Date.now(),
      user_id: this.getUserId(),
      variants: Object.fromEntries(this.userVariants),
      ...data
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 A/B Test Tracking:', trackingData);
    }

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(trackingData);
  }

  // Get or create anonymous user ID
  private getUserId(): string {
    let userId = localStorage.getItem('ab_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('ab_user_id', userId);
    }
    return userId;
  }

  // Send data to analytics service
  private sendToAnalytics(data: any): void {
    // Example implementations:
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', data.event, {
        custom_parameter_variants: JSON.stringify(data.variants),
        custom_parameter_timestamp: data.timestamp,
        ...data
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'AB_Test_Event', data);
    }

    // Custom API endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(err => console.error('Analytics tracking failed:', err));
    }

    // Store locally for batch sending
    const storedEvents = JSON.parse(localStorage.getItem('ab_events') || '[]');
    storedEvents.push(data);
    localStorage.setItem('ab_events', JSON.stringify(storedEvents.slice(-100))); // Keep last 100 events
  }

  // Get conversion stats for debugging
  public getStats(): any {
    const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
    return {
      totalEvents: events.length,
      variants: Object.fromEntries(this.userVariants),
      recentEvents: events.slice(-10)
    };
  }
}

// React Hook for A/B Testing
export function useABTest(testName: keyof typeof AB_TESTS) {
  const tracker = ABTestTracker.getInstance();
  const variant = tracker.getVariant(testName);
  
  return {
    variant,
    track: (event: TrackingEvent, data?: Record<string, any>) => {
      tracker.track(event, { test_name: testName, variant, ...data });
    }
  };
}

// React Component for A/B Test Initialization
export function ABTestProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const tracker = ABTestTracker.getInstance();
    tracker.loadStoredVariants();
    tracker.track('page_view');
    
    // Track page engagement time
    const startTime = Date.now();
    const trackEngagement = () => {
      const timeSpent = Date.now() - startTime;
      tracker.track('page_engagement', { time_spent_ms: timeSpent });
    };
    
    window.addEventListener('beforeunload', trackEngagement);
    return () => window.removeEventListener('beforeunload', trackEngagement);
  }, []);

  return <>{children}</>;
}

export default ABTestTracker;