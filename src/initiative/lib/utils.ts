export const wrapType = (str: string, typeName?: string) => {
  return `\`\`\`TypeScript
  
${typeName ? `\t${typeName}: ` : ""}${str}
\`\`\``;
};

export const stateDescription = (
  state?: object,
  title = "Current State:",
  sep = "\n\t"
) => {
  if (!state) return "";
  return `${title}${Object.values(state).join(sep)}\n`
};
