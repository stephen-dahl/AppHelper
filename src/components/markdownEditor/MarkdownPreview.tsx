import React, { Suspense } from "react";
import { lazy } from 'react';
const Editor = lazy(() => import('./Editor'));

interface Props {
  value: string;
  textAlign?: "left" | "center" | "right"
}

export function MarkdownPreview({ value: markdownString = "", textAlign }: Props) {
  return <Suspense fallback={<div>{markdownString || ""}</div>}>
    <Editor mode="preview" value={markdownString || ""} textAlign={textAlign} />
  </Suspense>
}
