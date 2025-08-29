import { useEffect } from 'react';

// Retargeting Pixel Configuration
interface PixelConfig {
  facebookPixelId?: string;
  googleAdsId?: string;
  tiktokPixelId?: string;
  customPixelEndpoints?: string[];
}

// Event Types for Retargeting
export type RetargetingEvent = 
  | 'page_view'
  | 'lead_form_start'
  | 'lead_form_complete'
  | 'pricing_view'
  | 'exit_intent'
  | 'time_on_page'
  | 'scroll_depth'
  | 'download_attempt';

interface RetargetingData {
  event: RetargetingEvent;
  value?: number;
  currency?: string;
  content_category?: string;
  content_ids?: string[];
  custom_parameters?: Record<string, any>;
}

class RetargetingPixelManager {
  private static instance: RetargetingPixelManager;
  private config: PixelConfig = {};
  private isInitialized = false;

  public static getInstance(): RetargetingPixelManager {
    if (!RetargetingPixelManager.instance) {
      RetargetingPixelManager.instance = new RetargetingPixelManager();
    }
    return RetargetingPixelManager.instance;
  }

  public initialize(config: PixelConfig) {
    this.config = config;
    this.initializeFacebookPixel();
    this.initializeGoogleAds();
    this.initializeTikTokPixel();
    this.isInitialized = true;
  }

  // Initialize Facebook Pixel
  private initializeFacebookPixel() {
    if (!this.config.facebookPixelId) return;

    // Facebook Pixel Code
    const facebookScript = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.config.facebookPixelId}');
    `;

    this.injectScript(facebookScript);
  }

  // Initialize Google Ads
  private initializeGoogleAds() {
    if (!this.config.googleAdsId) return;

    const googleScript = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.config.googleAdsId}');
    `;

    this.injectScript(googleScript);
  }

  // Initialize TikTok Pixel
  private initializeTikTokPixel() {
    if (!this.config.tiktokPixelId) return;

    const tiktokScript = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["track","page","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${this.config.tiktokPixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;

    this.injectScript(tiktokScript);
  }

  // Inject script into page
  private injectScript(scriptContent: string) {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.innerHTML = scriptContent;
    document.head.appendChild(script);
  }

  // Track retargeting events
  public track(data: RetargetingData) {
    if (!this.isInitialized) return;

    // Facebook Pixel tracking
    if (this.config.facebookPixelId && typeof (window as any).fbq !== 'undefined') {
      this.trackFacebookEvent(data);
    }

    // Google Ads tracking
    if (this.config.googleAdsId && typeof (window as any).gtag !== 'undefined') {
      this.trackGoogleEvent(data);
    }

    // TikTok Pixel tracking
    if (this.config.tiktokPixelId && typeof (window as any).ttq !== 'undefined') {
      this.trackTikTokEvent(data);
    }

    // Custom pixel endpoints
    this.trackCustomPixels(data);

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Retargeting Event:', data);
    }
  }

  private trackFacebookEvent(data: RetargetingData) {
    const fbq = (window as any).fbq;
    
    switch (data.event) {
      case 'page_view':
        fbq('track', 'PageView');
        break;
      case 'lead_form_start':
        fbq('track', 'InitiateCheckout', { 
          content_category: 'education',
          value: data.value || 230,
          currency: 'GEL'
        });
        break;
      case 'lead_form_complete':
        fbq('track', 'Lead', {
          content_category: 'education',
          value: data.value || 230,
          currency: 'GEL'
        });
        break;
      case 'pricing_view':
        fbq('track', 'ViewContent', {
          content_type: 'product',
          content_ids: ['pricing_page']
        });
        break;
      default:
        fbq('trackCustom', data.event, data.custom_parameters || {});
    }
  }

  private trackGoogleEvent(data: RetargetingData) {
    const gtag = (window as any).gtag;
    
    switch (data.event) {
      case 'page_view':
        gtag('event', 'page_view');
        break;
      case 'lead_form_complete':
        gtag('event', 'conversion', {
          send_to: this.config.googleAdsId,
          value: data.value || 230,
          currency: 'GEL'
        });
        break;
      default:
        gtag('event', data.event, data.custom_parameters || {});
    }
  }

  private trackTikTokEvent(data: RetargetingData) {
    const ttq = (window as any).ttq;
    
    switch (data.event) {
      case 'page_view':
        ttq.track('ViewContent');
        break;
      case 'lead_form_complete':
        ttq.track('SubmitForm', {
          value: data.value || 230,
          currency: 'GEL'
        });
        break;
      default:
        ttq.track('CustomEvent', { event_name: data.event, ...data.custom_parameters });
    }
  }

  private trackCustomPixels(data: RetargetingData) {
    if (!this.config.customPixelEndpoints?.length) return;

    this.config.customPixelEndpoints.forEach(endpoint => {
      // Create pixel image for simple tracking
      const img = new Image();
      const params = new URLSearchParams({
        event: data.event,
        value: data.value?.toString() || '',
        timestamp: Date.now().toString(),
        ...data.custom_parameters
      });
      
      img.src = `${endpoint}?${params.toString()}`;
    });
  }

  // Track user engagement patterns for retargeting
  public trackEngagement() {
    let scrollDepth = 0;
    let timeOnPage = Date.now();

    // Track scroll depth
    const trackScroll = () => {
      const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (currentScroll > scrollDepth && currentScroll % 25 === 0) {
        scrollDepth = currentScroll;
        this.track({
          event: 'scroll_depth',
          custom_parameters: { depth: scrollDepth }
        });
      }
    };

    // Track time on page milestones
    const trackTimeOnPage = () => {
      const timeSpent = Date.now() - timeOnPage;
      const secondsSpent = Math.floor(timeSpent / 1000);
      
      if ([30, 60, 120, 300].includes(secondsSpent)) {
        this.track({
          event: 'time_on_page',
          custom_parameters: { seconds: secondsSpent }
        });
      }
    };

    // Add event listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    const timeInterval = setInterval(trackTimeOnPage, 1000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('scroll', trackScroll);
      clearInterval(timeInterval);
    });
  }
}

// React Hook for Retargeting
export function useRetargeting() {
  const manager = RetargetingPixelManager.getInstance();
  
  return {
    track: (data: RetargetingData) => manager.track(data),
    trackEngagement: () => manager.trackEngagement()
  };
}

// React Component for Retargeting Initialization
export function RetargetingProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode; 
  config: PixelConfig;
}) {
  useEffect(() => {
    const manager = RetargetingPixelManager.getInstance();
    manager.initialize(config);
    
    // Track initial page view
    manager.track({ event: 'page_view' });
    
    // Start engagement tracking
    manager.trackEngagement();
  }, [config]);

  return <>{children}</>;
}