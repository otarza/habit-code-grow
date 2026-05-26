import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts BitCamp's legacy video shortcodes to HTML
 * iframes at build time. Replaces a paragraph whose only child is a
 * shortcode text node:
 *
 *   {% youtube "https://youtu.be/abc" %}
 *   {% vimeo "https://vimeo.com/12345" %}
 *   {% video "https://cdn.example.com/clip.mp4" %}
 *   {% embed "https://example.com/iframe-url" %}
 *
 * Shortcodes outside their own paragraph (e.g. inline with other text) are
 * left untouched — the original content used them as block elements only.
 */
const SHORTCODE_RE = /^\{%\s*(youtube|vimeo|video|embed)\s+"([^"]+)"\s*%\}$/;

export function remarkVideoShortcodes() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index == null) return;
      if (!node.children || node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== 'text') return;
      const match = SHORTCODE_RE.exec(child.value.trim());
      if (!match) return;
      const [, type, url] = match;
      parent.children[index] = {
        type: 'html',
        value: renderEmbed(type, url),
      };
    });
  };
}

function renderEmbed(type, rawUrl) {
  const url = escapeAttr(rawUrl);
  if (type === 'youtube') {
    const id = extractYoutubeId(rawUrl);
    if (!id) return fallback(rawUrl);
    return `<div class="video-embed video-embed--youtube"><iframe src="https://www.youtube.com/embed/${escapeAttr(id)}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
  }
  if (type === 'vimeo') {
    const id = extractVimeoId(rawUrl);
    if (!id) return fallback(rawUrl);
    return `<div class="video-embed video-embed--vimeo"><iframe src="https://player.vimeo.com/video/${escapeAttr(id)}" title="Vimeo video" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  }
  if (type === 'video') {
    return `<div class="video-embed video-embed--file"><video src="${url}" controls preload="metadata"></video></div>`;
  }
  // embed = generic iframe
  return `<div class="video-embed video-embed--generic"><iframe src="${url}" loading="lazy" allowfullscreen></iframe></div>`;
}

function extractYoutubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#/]+)/);
  return m?.[1];
}

function extractVimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1];
}

function fallback(url) {
  return `<p><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></p>`;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
