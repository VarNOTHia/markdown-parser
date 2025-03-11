import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 将 import.meta.url 转换为文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 构造 example.md 文件的路径
async function readExampleFile(filename: string) {
  const filePath = join(__dirname, '../public/' + filename);

  try {
    const content: string = await readFile(filePath, 'utf-8');
    const htmlContent = markdownToHtml(content);
    console.log(htmlContent);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// 简单的 Markdown 到 HTML 转换
function markdownToHtml(markdown: string): string {
  // 处理标题（#）
  let html = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>'); // 匹配标题

  // 处理加粗 (**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // 匹配加粗文本

  // 处理斜体 (_)
  html = html.replace(/_(.*?)_/g, '<i>$1</i>'); // 匹配斜体文本

  // 将 Markdown 中的换行符转化为 HTML 中的 <p> 标签
  html = html.replace(/\n/g, '<br/>'); // 简单处理换行符

  return html;
}

readExampleFile('example.md');
