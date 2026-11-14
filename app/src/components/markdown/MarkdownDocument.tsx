"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import type {
  InlineNode,
  MarkdownBlock,
  TableAlignment,
} from "@/utils/markdown";

function renderInline(nodes: readonly InlineNode[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    switch (node.kind) {
      case "text":
        return node.value;

      case "code":
        return (
          <code
            key={key}
            className="font-mono bg-ground text-segaYellow border border-plateBorder px-1.5 py-0.5 text-[0.85em] break-words"
          >
            {node.value}
          </code>
        );

      case "strong":
        return (
          <strong key={key} className="text-iceWhite font-bold">
            {renderInline(node.children, key)}
          </strong>
        );

      case "emphasis":
        return (
          <em key={key} className="text-steelLight italic">
            {renderInline(node.children, key)}
          </em>
        );

      case "link": {
        const isExternal = node.href.startsWith("http://") || node.href.startsWith("https://");
        if (isExternal) {
          return (
            <a
              key={key}
              href={node.href}
              target="_blank"
              rel="noreferrer"
              className="text-segaYellow underline underline-offset-2 hover:text-white transition-colors"
            >
              {renderInline(node.children, key)}
            </a>
          );
        }
        return (
          <Link
            key={key}
            href={node.href}
            className="text-segaYellow underline underline-offset-2 hover:text-white transition-colors"
          >
            {renderInline(node.children, key)}
          </Link>
        );
      }
    }
  });
}

const ALIGN_CLASS: Record<TableAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function CodeBlock({
  language,
  value,
}: {
  readonly language: string | null;
  readonly value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="border-2 border-plateBorder bg-ground my-6 shadow-sega overflow-hidden relative">
      <div className="bg-plate border-b-2 border-plateBorder px-4 py-2 flex items-center justify-between text-xs font-mono uppercase text-segaYellow font-bold">
        <span>{language || "CODE"}</span>
        <button
          onClick={handleCopy}
          className="sega-btn sega-btn-dark !py-0.5 !px-2 !text-xs flex items-center gap-1.5 hover:text-segaYellow transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-segaGreen" />
              <span className="text-[10px] text-segaGreen font-mono">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-steel" />
              <span className="text-[10px] text-steel font-mono">COPY</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-iceWhite leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export function MarkdownDocument({ blocks }: { readonly blocks: readonly MarkdownBlock[] }) {
  return (
    <div className="min-w-0 space-y-4">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.kind) {
          case "heading": {
            const content = renderInline(block.children, key);
            if (block.depth === 1) {
              return (
                <h1
                  key={key}
                  id={block.id}
                  className="font-pixel text-3xl sm:text-4xl lg:text-5xl text-iceWhite uppercase tracking-wide leading-tight mb-4"
                >
                  {content}
                </h1>
              );
            }
            if (block.depth === 2) {
              return (
                <h2
                  key={key}
                  id={block.id}
                  className="font-pixel text-2xl sm:text-3xl text-segaYellow uppercase tracking-wide border-t-2 border-plateBorder pt-8 mt-12 scroll-mt-24"
                >
                  {content}
                </h2>
              );
            }
            if (block.depth === 3) {
              return (
                <h3
                  key={key}
                  id={block.id}
                  className="font-pixel text-xl sm:text-2xl text-iceWhite uppercase tracking-wide mt-8 scroll-mt-24"
                >
                  {content}
                </h3>
              );
            }
            return (
              <h4
                key={key}
                id={block.id}
                className="font-mono text-sm uppercase text-steel font-bold mt-6 scroll-mt-24"
              >
                {content}
              </h4>
            );
          }

          case "paragraph":
            return (
              <p key={key} className="text-steel text-sm sm:text-[15px] leading-relaxed font-sans">
                {renderInline(block.children, key)}
              </p>
            );

          case "blockquote":
            return (
              <div
                key={key}
                className="border-l-4 border-segaYellow bg-plate p-4 my-4 font-mono text-xs sm:text-sm text-iceWhite leading-relaxed"
              >
                {renderInline(block.children, key)}
              </div>
            );

          case "code":
            return <CodeBlock key={key} language={block.language} value={block.value} />;

          case "list": {
            const items = block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`} className="pl-1">
                {renderInline(item, `${key}-${itemIndex}`)}
              </li>
            ));

            if (block.ordered) {
              return (
                <ol
                  key={key}
                  start={block.start}
                  className="font-mono text-steel marker:text-segaYellow my-4 list-decimal space-y-2 pl-6 text-xs sm:text-sm leading-relaxed"
                >
                  {items}
                </ol>
              );
            }
            return (
              <ul
                key={key}
                className="text-steel marker:text-segaYellow my-4 list-disc space-y-2 pl-6 text-xs sm:text-sm leading-relaxed"
              >
                {items}
              </ul>
            );
          }

          case "table":
            return (
              <div
                key={key}
                className="border-2 border-plateBorder bg-plate my-6 overflow-x-auto shadow-sega"
              >
                <table className="w-full border-collapse font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-plateBorder bg-ground">
                      {block.header.map((cell, cellIndex) => (
                        <th
                          key={`${key}-h-${cellIndex}`}
                          className={`p-3 font-pixel text-base uppercase text-segaYellow tracking-wider ${
                            ALIGN_CLASS[block.align[cellIndex] ?? "left"]
                          }`}
                        >
                          {renderInline(cell, `${key}-h-${cellIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={`${key}-r-${rowIndex}`}
                        className="border-b border-plateBorder/60 hover:bg-plateHover transition-colors last:border-b-0"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${key}-r-${rowIndex}-${cellIndex}`}
                            className={`p-3 text-steel align-top leading-relaxed ${
                              ALIGN_CLASS[block.align[cellIndex] ?? "left"]
                            }`}
                          >
                            {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "rule":
            return <div key={key} className="border-b-2 border-plateBorder my-10" />;
        }
      })}
    </div>
  );
}
