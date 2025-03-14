type className = 'className' | 'class';
const imgPlaceHolders: string[] = [];

export const imgRegex: RegExp = /!\[([^\]]*)\]\(([^)]+)\)/g;

export const generateImgPlaceholder = (text: string, className: className) => {
  return text.replace(imgRegex, (match, alt: string, src: string) => {
    const placeholder = `@@IMG@${imgPlaceHolders.length}@@`;
    imgPlaceHolders.push(`<img ${className}='md-img' src=${src} alt=${alt}`);
    return placeholder;
  })
}

export const restoreImg = (text: string, className: className) => {
  imgPlaceHolders.forEach((img, index) => {
    text = text.replace(`@@IMG@${index}@@`, img);
  });
  return text;
}
