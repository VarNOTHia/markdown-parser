import hljs from "highlight.js";

type className = 'className' | 'class';

const codeBlocks: string[] = []; // 存储代码块的数组

export const codeBlockRegex: RegExp = /```(\w+)\n([\s\S]*?)```/g;
// 处理大代码块（```...```）
export const generateCodePlaceholder = (text: string, className: className) => {
  return text.replace(codeBlockRegex, (match, lang, code) => {
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    const highlightedCode = hljs.highlight(code, { language: validLang }).value;

    const placeholder = `@@CODEBLOCK_${codeBlocks.length}@@`; // 生成唯一占位符
    codeBlocks.push(`<pre class="md-code-block"><code class="hljs language-${validLang}">${highlightedCode}</code></pre>`);

    return placeholder;
  });
};

export const restoreCodeBlock = (text: string) => {
  codeBlocks.forEach((block, index) => {
    text = text.replace(`@@CODEBLOCK_${index}@@`, block);
  });
  return text;
}