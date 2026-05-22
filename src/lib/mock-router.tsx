import React, { ReactNode } from 'react';

// Mock Link component that uses standard <a> tags
export const Link = ({ to, children, className, ...props }: any) => {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
};

// Mock hooks
export const useNavigate = () => {
  return (path: string) => {
    window.location.href = path;
  };
};

export const useLocation = () => {
  if (typeof window !== 'undefined') {
    return window.location;
  }
  return { pathname: '/', search: '', hash: '' };
};

export const useSearchParams = () => {
  if (typeof window !== 'undefined') {
    return [new URLSearchParams(window.location.search), () => {}];
  }
  return [new URLSearchParams(), () => {}];
};

export const useParams = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'courses' || parts[0] === 'learn') {
      return {
        courseSlug: parts[1],
        topicSlug: parts[2],
        lessonSlug: parts[3]
      };
    }
  }
  return {};
};

// Mock elements
export const BrowserRouter = ({ children }: { children: ReactNode }) => <>{children}</>;
export const Routes = ({ children }: { children: ReactNode }) => <>{children}</>;
export const Route = () => null;
