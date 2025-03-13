type className = 'className' | 'class';
// 太可怕了，根本不是人能写出来的东西，太伟大了 Claude GPT DeepSeek Grok 😭
export const chartRegex: RegExp = /\n\|(.+)\|\n\|([-\s|]+)\|\n((?:\|.*\|\n)*)/g;
// 处理 Markdown 表格
export const handleChart = (text: string, className: className) => {
  return text.replace(chartRegex, (match, headerLine, separatorLine, bodyLines) => {
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