type className = 'className' | 'class';
const linkPlaceHolders: string[] = [];

export const linkRegex: RegExp = /(?<!!)\[(.*?)\]\((.*?)\)/g;

export const createLinkPlaceholder = (text: string, className: className) => {
  return text.replace(linkRegex, (match, content: string, href: string) => {
    const placeholder = `@@LINK@${linkPlaceHolders.length}@@`;
    linkPlaceHolders.push(`<a ${className}='md-link' href=${href}> ${content}</a>`);
    return placeholder;
  })
}

export const restoreLink = (text: string, className: className) => {
  linkPlaceHolders.forEach((link, index) => {
    text = text.replace(`@@LINK@${index}@@`, link);
  });
  return text;
}