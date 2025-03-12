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

// 处理大代码块（```...```），它将被包裹在 <pre><code> 中
const handleCodeBlock = (text: string, className: className) => {
  return text.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
    const escapedCode = escapeHTML(codeContent);
    // 使用 <pre><code> 标签包装代码块
    return `<pre ${className}="md-code-block"><code>${escapedCode}</code></pre>`;
  });
};

// 处理内联代码（`code`），用 <code> 标签包装
const handleInlineCode = (text: string, className: className) => {
  return text.replace(/`(.*?)`/g, (match, codeContent) => {
    const escapedCode = escapeHTML(codeContent);
    // 用 <code> 标签包装内联代码
    return `<code ${className}="md-inline-code">${escapedCode}</code>`;
  });
};

const handleChart = (text: string, className: className) => {
  return text.replace(
    /\n\|(.+)\|\n\|([-\s|]+)\|\n((?:\|.*\|\n)*)/g, // 匹配表格结构
    (match, headerLine, separatorLine, bodyLines) => {
      // 解析表头
      const headers = headerLine
        .split('|')
        .map((h: string) => h.trim())
        .filter(Boolean) // 移除空列
        .map((h: string) => `<th ${className}='md-table-header'>${h}</th>`)
        .join('');
  
      // 解析数据行
      const rows = (bodyLines || '') // 确保 bodyLines 存在
        .trim()
        .split('\n')
        .map((row: string) => {
          const cols = row
            .split('|')
            .map((c: string) => c.trim())
            .filter(Boolean) // 移除空列
            .map((c: string) => `<td ${className}='md-table-cell'>${c}</td>`)
            .join('');
          return `<tr ${className}='md-table-row'>${cols}</tr>`;
        })
        .join('');
  
      // 组合表格
      return `<table ${className}='md-table' border="1">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    }
  );  
}

const handleBold = (text: string, className: className) => {
  return text.replace(/\*\*(.*?)\*\*/g, `<b ${className}='md-bold'>$1</b>`);
}

const handleItalic = (text: string, className: className) => {
  return text.replace(/_(.*?)_/g, `<i ${className}='md-italic'>$1</i>`); // 匹配斜体文本
}


const handleContext = (text: string, className: className) => {
  // 提取所有大代码块，替换为占位符 @@CODEBLOCK@@
  const codeBlockRegex = /<pre (?:class|className)="[^"]*md-code-block"[\s\S]*?<\/pre>/g;
  let codeBlocks: string[] = [];
  text = text.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return '@@CODEBLOCK@@';
  });

  // [^\n]+ means paragraph, non EOL, + means more than 1.
  // (\n(?!\n))*) 代表 匹配一个换行符，而且它后面没有直接跟着一个换行符。
  // 这代表保留了换行的 \n。只有专门空行才能分段。它可以有 0 - n 个换行，所以后面跟 *
  // 两截外面的 () 就是第一个 $1，最后被批量替换成 <p>。
  text = text.replace(/([^\n]+(\n(?!\n))*)/g, `<p ${className}='md-paragraph'>$1</p>`);

  // 将占位符还原为原来的代码块内容
  codeBlocks.forEach((block) => {
    text = text.replace('@@CODEBLOCK@@', block);
  });

  return text;
}

const ruleSet = [handleTitle, handleCodeBlock, handleInlineCode, handleChart, handleBold, handleItalic, handleContext];

const rulesHandler = (text: string, isJSX: boolean) => {
  let className: className = isJSX ? 'className' : 'class';
  ruleSet.forEach(fn => {
    text = fn(text, className);
  });
  return text;
}

export default rulesHandler;
