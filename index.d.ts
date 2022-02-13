declare module 'compound-parser' {
  const parseFormula: (formula: string) => Map<string, number>;
  export default parseFormula;
}
