type className = 'className' | 'class';

export const boldRegex: RegExp = /\*\*(.*?)\*\*/g;
export const handleBold = (text: string, className: className) => {
  return text.replace(boldRegex, `<b ${className}='md-bold'>$1</b>`);
};