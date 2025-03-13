import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path, { dirname, join, extname } from 'path';
import htmlWrapper from './htmlWrapper.ts';
import parseMarkdown from './handler/parser.ts';
// 将 import.meta.url 转换为文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 构造 example.md 文件的路径
async function htmlGenerator(filename: string) {
  const filePath = join(__dirname, '../public/__posts/' + filename);
  // 构造输出的 HTML 文件的路径
  const outputFilePath = join(__dirname, '../out', filename.replace(extname(filename), '.html'));

  try {
    const content: string = await readFile(filePath, 'utf-8');
    const htmlContent = markdownToHtml(content);
    await writeFile(outputFilePath, htmlContent);
    // console.log(htmlContent);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}


// 简单的 Markdown 到 HTML 转换
function markdownToHtml(markdown: string): string {
  let mdContent = parseMarkdown(markdown, false);
  return htmlWrapper('myPage', mdContent);
}

export default htmlGenerator;