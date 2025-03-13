type className = 'className' | 'class';

export const titleRegex: RegExp = /^(#{1,6}) (.*)$/gm;

export const handleTitle = (text: string, className: className) => {
  return text.replace(titleRegex, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} ${className}='md-heading-${level}'>${content}</h${level}>`;
  });
}
