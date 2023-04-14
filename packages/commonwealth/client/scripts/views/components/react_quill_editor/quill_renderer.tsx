import React, { useMemo } from 'react';
import { QuillFormattedText } from './quill_formatted_text';
import { MarkdownFormattedText } from './markdown_formatted_text';
import type { DeltaStatic } from 'quill';

export type QuillRendererProps = {
  doc: string;
  hideFormatting?: boolean;
  openLinksInNewTab?: boolean;
  searchTerm?: string;
  cutoffLines?: number;
};

type RichTextDocInfo = { format: 'richtext'; content: DeltaStatic };
type MarkdownDocInfo = { format: 'markdown'; content: string };
type UnknownDocInfo = { format: 'unknown'; content: null };
type DocInfo = RichTextDocInfo | MarkdownDocInfo | UnknownDocInfo;

export const QuillRenderer = ({
  doc,
  searchTerm,
  hideFormatting,
  cutoffLines,
}: QuillRendererProps) => {
  const docInfo: DocInfo = useMemo(() => {
    let decodedText: string;
    try {
      decodedText = decodeURIComponent(doc);
    } catch (e) {
      decodedText = doc;
    }

    try {
      // if JSON with ops, it's richtext
      const delta = JSON.parse(decodedText) as DeltaStatic;
      if (!delta.ops) {
        console.error('parsed doc as JSON but has no ops');
        return {
          format: 'unknown',
          content: null,
        } as UnknownDocInfo;
      }
      return {
        format: 'richtext',
        content: delta,
      } as RichTextDocInfo;
    } catch (err) {
      // otherwise it's a markdown string
      return {
        format: 'markdown',
        content: decodedText,
      } as MarkdownDocInfo;
    }
  }, [doc]);

  switch (docInfo.format) {
    case 'richtext':
      return (
        <QuillFormattedText
          hideFormatting={hideFormatting}
          doc={docInfo.content}
          searchTerm={searchTerm}
          cutoffLines={cutoffLines}
        />
      );
    case 'markdown':
      return (
        <MarkdownFormattedText
          hideFormatting={hideFormatting}
          doc={docInfo.content}
          searchTerm={searchTerm}
          cutoffLines={cutoffLines}
        />
      );
    default:
      return <>N/A</>;
  }
};
