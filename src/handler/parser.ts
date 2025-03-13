type className = 'className' | 'class';

import { handleBold } from "../rules/bold.ts";
import { handleChart } from "../rules/chart.ts";
import { generateCodePlaceholder, restoreCodeBlock } from "../rules/codeBlock.ts";
import { generateImgPlaceholder, restoreImg } from "../rules/img.ts";
import { handleInlineCode } from "../rules/inlineCode.ts";
import { handleItalic } from "../rules/italic.ts";
import { handleParagraph } from "../rules/paragraph.ts";
import { handleTitle } from "../rules/title.ts";

const handlers = [handleTitle, 
  generateImgPlaceholder, 
  generateCodePlaceholder, 
  handleInlineCode, 
  handleChart, 
  handleBold, 
  handleItalic, 
  handleParagraph,
  restoreCodeBlock,
  restoreImg
];

const parseMarkdown = (text: string, isJSX: boolean) => {
  let className: className = isJSX ? 'className' : 'class';
  handlers.forEach(fn => {
    text = fn(text, className);
  });
  return text;
}

export default parseMarkdown;