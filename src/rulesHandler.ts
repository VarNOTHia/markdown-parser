import hljs from "highlight.js";

type className = 'className' | 'class';

// 辅助函数：转义 HTML 字符
const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const handleTitle = (text: string, className: className) => {
  return text.replace(/^(#{1,6}) (.*)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} ${className}='md-heading-${level}'>${content}</h${level}>`;
  });
}

const imgs: string[] = []; // 保护 img。
const imgIndex = 0;

const handleImg = (text: string, className: className) => {
  const rule: RegExp = /!\[([^\]]*)\]\(([^)]+)\)/g;
  return text.replace(rule, (match, alt: string, src: string) => {
    const placeholder = `@@IMG_${imgs.length}@@`;
    imgs.push(`<img ${className}='md-img' src=${src} alt=${alt}`);

    return placeholder;
  })
}

const codeBlocks: string[] = []; // 存储代码块的数组

// 处理大代码块（```...```）
const handleCodeBlock = (text: string) => {
  return text.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    const highlightedCode = hljs.highlight(code, { language: validLang }).value;

    const placeholder = `@@CODEBLOCK_${codeBlocks.length}@@`; // 生成唯一占位符
    codeBlocks.push(`<pre class="md-code-block"><code class="hljs language-${validLang}">${highlightedCode}</code></pre>`);

    return placeholder;
  });
};

// 处理内联代码（`code`）
const handleInlineCode = (text: string, className: className) => {
  return text.replace(/`(.*?)`/g, (match, codeContent) => {
    const escapedCode = escapeHTML(codeContent);
    return `<code ${className}="md-inline-code">${escapedCode}</code>`;
  });
};

// 处理 Markdown 表格
const handleChart = (text: string, className: className) => {
  return text.replace(/\n\|(.+)\|\n\|([-\s|]+)\|\n((?:\|.*\|\n)*)/g, (match, headerLine, separatorLine, bodyLines) => {
    const headers = headerLine
      .split('|')
      .map((h: string) => h.trim())
      .filter(Boolean)
      .map((h: any) => `<th ${className}='md-table-header'>${h}</th>`)
      .join('');

    const rows = (bodyLines || '')
      .trim()
      .split('\n')
      .map((row: string) => {
        const cols = row
          .split('|')
          .map((c: string) => c.trim())
          .filter(Boolean)
          .map((c: any) => `<td ${className}='md-table-cell'>${c}</td>`)
          .join('');
        return `<tr ${className}='md-table-row'>${cols}</tr>`;
      })
      .join('');

    return `<table ${className}='md-table' border="1">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  });
};

// 处理 **加粗** 和 _斜体_
const handleBold = (text: string, className: className) => {
  return text.replace(/\*\*(.*?)\*\*/g, `<b ${className}='md-bold'>$1</b>`);
};

const handleItalic = (text: string, className: className) => {
  return text.replace(/_(.*?)_/g, `<i ${className}='md-italic'>$1</i>`);
};

// 处理段落 <p> 以及还原代码块
const handleContext = (text: string, className: className) => {
  // 先替换所有大代码块，避免它们受到其他 Markdown 解析规则的影响
  text = handleCodeBlock(text);

  // 处理 **内联代码、表格、加粗、斜体**
  text = handleInlineCode(text, className);
  text = handleChart(text, className);
  text = handleBold(text, className);
  text = handleItalic(text, className);

  // 处理 <p> 段落包裹（只针对非代码块内容）
  text = text.replace(/([^\n]+(\n(?!\n))*)/g, `<p ${className}='md-paragraph'>$1</p>`);

  // 还原代码块占位符
  codeBlocks.forEach((block, index) => {
    text = text.replace(`@@CODEBLOCK_${index}@@`, block);
  });

  imgs.forEach((img, index) => {
    text = text.replace(`@@IMG_${index}@@`, img);
  })

  return text;
};


const ruleSet = [handleTitle, handleImg, handleCodeBlock, handleInlineCode, handleChart, handleBold, handleItalic, handleContext];

const rulesHandler = (text: string, isJSX: boolean) => {
  let className: className = isJSX ? 'className' : 'class';
  ruleSet.forEach(fn => {
    text = fn(text, className);
  });
  return text;
}

export default rulesHandler;
