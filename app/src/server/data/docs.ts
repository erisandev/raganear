import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { collectHeadings, firstParagraph, parseMarkdown } from "@/utils/markdown";
import type { InlineNode, MarkdownBlock, MarkdownHeading } from "@/utils/markdown";
import { DOCS, DocEntry } from "./docs-list";

export { DOCS };
export type { DocEntry };

function readDocFile(relPath: string): string {
  // Candidate 1: cwd is root
  const p1 = join(process.cwd(), relPath);
  if (existsSync(p1)) return readFileSync(p1, "utf8");

  // Candidate 2: cwd is app/
  const p2 = join(process.cwd(), "..", relPath);
  if (existsSync(p2)) return readFileSync(p2, "utf8");

  // Candidate 3: relative to module directory
  const p3 = join(__dirname, "..", "..", "..", "..", relPath);
  if (existsSync(p3)) return readFileSync(p3, "utf8");

  throw new Error(`Could not find document source for "${relPath}" at paths: ${p1}, ${p2}, ${p3}`);
}

/**
 * Rewrites internal relative links (e.g. docs/IMPLEMENTATION.md) to web routes (/docs/implementation).
 */
function siteHref(href: string): string {
  if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  const clean = href.replace(/^\.\//, "").replace(/\.md$/, "");
  const target = DOCS.find(
    (entry) =>
      entry.file === href ||
      entry.file.replace(/\.md$/, "") === clean ||
      entry.slug === clean ||
      `docs/${entry.slug}` === clean ||
      href.includes(entry.slug)
  );
  return target ? `/docs/${target.slug}` : href;
}

function rewriteInline(nodes: readonly InlineNode[]): InlineNode[] {
  return nodes.map((node) => {
    switch (node.kind) {
      case "text":
      case "code":
        return node;
      case "strong":
      case "emphasis":
        return { ...node, children: rewriteInline(node.children) };
      case "link":
        return { ...node, href: siteHref(node.href), children: rewriteInline(node.children) };
    }
  });
}

function rewriteBlocks(blocks: readonly MarkdownBlock[]): MarkdownBlock[] {
  return blocks.map((block) => {
    switch (block.kind) {
      case "heading":
      case "paragraph":
      case "blockquote":
        return { ...block, children: rewriteInline(block.children) };
      case "code":
      case "rule":
        return block;
      case "list":
        return { ...block, items: block.items.map(rewriteInline) };
      case "table":
        return {
          ...block,
          header: block.header.map(rewriteInline),
          rows: block.rows.map((row) => row.map(rewriteInline)),
        };
    }
  });
}

export interface DocPage {
  readonly entry: DocEntry;
  readonly blocks: readonly MarkdownBlock[];
  readonly headings: readonly MarkdownHeading[];
  readonly intro: string;
}

export function findDoc(slug: string): DocEntry | null {
  return DOCS.find((entry) => entry.slug === slug) ?? null;
}

export function loadDoc(entry: DocEntry): DocPage {
  const content = readDocFile(entry.file);
  const rawBlocks = parseMarkdown(content);
  const blocks = rewriteBlocks(rawBlocks);
  return {
    entry,
    blocks,
    headings: collectHeadings(blocks, 3),
    intro: firstParagraph(blocks),
  };
}
