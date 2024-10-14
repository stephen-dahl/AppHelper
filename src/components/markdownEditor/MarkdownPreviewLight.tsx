import {marked} from "marked";
import React from "react";

interface Props {
  value: string;
  textAlign?: "left" | "center" | "right"
}

export function MarkdownPreviewLight({ value: markdownString = "", textAlign }: Props) {
  const html = marked.parse(markdownString || "")
  const style = (textAlign) ? {textAlign} : {}
  return <div style={style} dangerouslySetInnerHTML={{__html: html}}></div>

}
