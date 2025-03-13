import { fileURLToPath } from 'url';
import path, { dirname, join, extname } from 'path';

const htmlWrapper = (title: string, content: string, theme?: string) => {
  const themePath = join(dirname(fileURLToPath(import.meta.url)), '../public', 'theme', `${theme ? theme : 'default'}.css`);

  return `<!DOCTYPE html>
  <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css">
      <link rel="stylesheet" type="text/css" href=${themePath}>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
  </html>`;
};

export default htmlWrapper;