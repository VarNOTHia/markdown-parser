type className = 'className' | 'class';

const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const inlineCodeRegex: RegExp = /`(.*?)`/g;
// 处理内联代码（`code`）
export const handleInlineCode = (text: string, className: className) => {
  return text.replace(inlineCodeRegex, (match, codeContent) => {
    const escapedCode = escapeHTML(codeContent);
    return `<code ${className}="md-inline-code">${escapedCode}</code>`;
  });
};