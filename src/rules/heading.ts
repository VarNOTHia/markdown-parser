type className = 'className' | 'class';

export const headingRegex: RegExp = /^(#{1,6}) (.*)$/gm;

export const handleHeading = (text: string, className: className) => {
  return text.replace(headingRegex, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} ${className}='md-heading-${level}'>${content}</h${level}>`;
  });
}