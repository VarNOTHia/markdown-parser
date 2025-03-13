type className = 'className' | 'class';

export const paragraphRegex: RegExp = /([^\n]+(\n(?!\n))*)/g;

export const handleParagraph = (text: string, className: className) => {
  return text.replace(paragraphRegex, `<p ${className}='md-paragraph'>$1</p>`);
}