type className = 'className' | 'class';

export const italicRegex: RegExp = /_(.*?)_/g;
export const handleItalic = (text: string, className: className) => {
  return text.replace(/_(.*?)_/g, `<i ${className}='md-italic'>$1</i>`);
};