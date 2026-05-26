import { visit } from 'unist-util-visit';

/**
 * Rewrites relative-up paths (`../`, `../../`, etc.) on image and link nodes
 * to absolute paths from the site root. Solves the post-migration problem
 * where lesson markdown was written for `public/courses/{slug}/...` and used
 * `../../../media/...` to reach `public/media/...`. After moving lessons into
 * `src/content/`, those relative paths no longer resolve via Astro's asset
 * pipeline.
 *
 * By rewriting to absolute paths in the markdown AST *before* Astro's asset
 * resolver runs, the resolver treats them as plain URLs (it only optimizes
 * relative paths). The browser fetches them from the public root as expected.
 */
export function remarkAbsoluteAssets() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        (node.type === 'image' || node.type === 'link') &&
        typeof node.url === 'string' &&
        /^(\.\.\/)+/.test(node.url)
      ) {
        node.url = '/' + node.url.replace(/^(\.\.\/)+/, '');
      }
    });
  };
}
