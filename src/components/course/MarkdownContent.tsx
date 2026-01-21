import React from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:scroll-mt-20",
        // Inline code styling
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        // Link styling
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Image styling
        "prose-img:rounded-lg prose-img:shadow-md",
        // Blockquote styling
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/50",
        "prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4",
        "prose-blockquote:rounded-r-lg prose-blockquote:not-italic",
        "prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            const language = match ? match[1] : 'text';
            const codeString = String(children).replace(/\n$/, '');

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-lg !my-4 !bg-[#282c34] text-sm"
                showLineNumbers={codeString.split('\n').length > 3}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            );
          },
          pre({ children }) {
            // Let the code component handle everything
            return <>{children}</>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 bg-primary/5 py-3 px-5 my-4 rounded-r-lg">
                <div className="text-slate-700 dark:text-slate-300 [&>p]:m-0">
                  {children}
                </div>
              </blockquote>
            );
          },
          // Custom video embed support
          p({ children, ...props }) {
            // Extract text content from children properly
            const extractText = (node: React.ReactNode): string => {
              if (typeof node === 'string') return node;
              if (typeof node === 'number') return String(node);
              if (Array.isArray(node)) return node.map(extractText).join('');
              if (node && typeof node === 'object' && 'props' in node) {
                return extractText((node as React.ReactElement).props.children);
              }
              return '';
            };
            const childText = extractText(children);

            // YouTube embed
            const ytMatch = childText.match(/\{% youtube "([^"]+)" %\}/);
            if (ytMatch) {
              const videoId = extractYouTubeId(ytMatch[1]);
              if (videoId) {
                return (
                  <div className="aspect-video my-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                );
              }
            }

            // Vimeo embed
            const vimeoMatch = childText.match(/\{% vimeo "([^"]+)" %\}/);
            if (vimeoMatch) {
              const videoId = extractVimeoId(vimeoMatch[1]);
              if (videoId) {
                return (
                  <div className="aspect-video my-6">
                    <iframe
                      src={`https://player.vimeo.com/video/${videoId}`}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                );
              }
            }

            // Generic embed
            const embedMatch = childText.match(/\{% embed "([^"]+)" %\}/);
            if (embedMatch) {
              return (
                <div className="aspect-video my-6">
                  <iframe
                    src={embedMatch[1]}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              );
            }

            // Video embed
            const videoMatch = childText.match(/\{% video "([^"]+)" %\}/);
            if (videoMatch) {
              return (
                <div className="aspect-video my-6">
                  <video src={videoMatch[1]} controls className="w-full h-full rounded-lg" />
                </div>
              );
            }

            return <p {...props}>{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
