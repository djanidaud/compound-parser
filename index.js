/**
 * Takes a string representing a chemical compound (eg. "H2O")
 * and parses it into a Map containing the different atoms (and their count) that make up that compound (eg. [H:2, O:1])
 *
 * @param    {string} compound     String representing a chemical compound
 * @return   {Map<string, number>} Contains the different atoms (and their count) that make up that compound
 */
const parseCompound = (compound) => {
  const atomsMap = new Map();
  const stack = [];

  getTokens(compound).forEach((token) => {
    if (!isNaN(token)) return processBrackets(parseInt(token), atomsMap, stack);

    if (token === "(" || token === ")") return stack.push(token);

    if (stack.length === 0) return processElement(token, atomsMap);

    stack.push(token);
  });
  return atomsMap;
};

/**
 * Takes a string, representing a chemical compound
 * and returns an array of tokens that will be used to parse the compound
 *
 * eg
 *  "H2O"         would return ['H2','O1']
 *  "Fe(OH)3"     would return ['Fe1', '(', 'O1', 'H1', ')', '3']
 *  "K3(Al(OH)6)" would return ['K3', '(', 'Al1', '(', 'O1', 'H1', ')', '6', ')', '1']
 *
 * @param    {string} compound   A chemical compound
 * @return   {string[]}          Tokens
 */
const getTokens = (compound) => {
  const tokens = compound.match(/[A-Z][a-z]*\d*|[()]|\d+/g);

  return tokens.reduce((acc, token, i) => {
    acc.push(token);

    if (!isNaN(token) || token === "(") return acc;

    if (token === ")") {
      if (isNaN(tokens[i + 1])) acc.push("1");
      return acc;
    }

    if ((token.match(/\d+/g) || []).length === 0)
      acc[acc.length - 1] = token + "1";

    return acc;
  }, []);
};

/**
 * Processes the first bracketed term, that the stack contains
 *
 * If this is the last bracketed term, we process all of its elements with the processElement function
 * If this is not the last term, this means our bracketed term was nested within another one.
 * In such cases, we scale the contents, and then push them back to the stack
 *
 * The scale parameter is equal to the number that multiples the bracketed term
 *
 * eg.
 *  in the compound "Fe(OH)3":
 *      the stack would contain ['(', 'O', 'H', ')']
 *      the scale would be 3
 *      the stack has a single bracketed term, so we will process all of its elements using a scale of 3
 *      we update the atomsMap, and the stack is now empty
 *
 *  in the compound K3(Al(OH)6):
 *      the stack would contain ['(', 'Al', '(', 'O', 'H', ')'] (the outermost bracketed term still hasn't been closed)
 *      the scale would be 6
 *      the stack has 2 bracketed terms, so we will scale the contents of the first one ('O' and 'H'), and then push them back to the stack
 *      the stack would now look like ['(', 'Al', 'O6', 'H6']. The last bracketed term will be processed when we reach a ")"
 *
 *
 * @param    {number} scale                   The number which we use to scale (multiply) the contents of the brackets
 * @param    {Map<string, number>} atomsMap   The Map object stores the count of atoms
 * @param    {string[]}  stack                The stack, containing the contents of the brackets
 */
const processBrackets = (scale, atomsMap, stack) => {
  let bracketContents = [];
  let lastPopped;
  stack.pop();

  while ((lastPopped = stack.pop()) !== "(") bracketContents.push(lastPopped);

  if (stack.length === 0)
    bracketContents.forEach((el) => processElement(el, atomsMap, scale));
  else
    scaleBracketedElements(bracketContents, scale).forEach((e) =>
      stack.push(e)
    );
};

/**
 * Takes a string a simple chemical element (eg. "H2" or "Na") and counts the number of atoms it contains.
 * We store that count into our atomsMap object.
 *
 * The scale parameter is used when the element is nested withing brackets
 * (eg. in the compound "Fe(OH)3", the element "Fe" has a scale of 1 while "H" and "O" have a scale of 3)
 *
 * @param    {string} element                 String representing a simple chemical element
 * @param    {Map<string, number>} atomsMap   The Map object stores the count of atoms
 * @param    {number} scale                   Used when the element is nested within brackets
 */
const processElement = (element, atomsMap, scale = 1) => {
  const atoms = parseAtoms(element);
  const incAtom = (key, count = 0) =>
    atomsMap.set(key, (atomsMap.get(key) || 0) + count);

  atoms.forEach((atom, i) =>
    isNaN(atom) ? incAtom(atom) : incAtom(atoms[i - 1], parseInt(atom) * scale)
  );
};

/**
 * Multiples elements by a certain scale.
 *
 * eg.
 *  ["H2","Na"], scale=3 would return ["H6","Na3"]
 *
 * @param    {string[]} elements  The elements that we will scale
 * @param    {number} scale       The scale
 * @return   {string[]}           The scaled elements
 */
const scaleBracketedElements = (elements, scale) =>
  elements
    .map(parseAtoms)
    .map((atoms) =>
      atoms
        .map((atom) => (isNaN(atom) ? atom : parseInt(atom) * scale))
        .join("")
    );

/** Takes a simple element (eg "H2") and parses it into ["H", "2"]  */
const parseAtoms = (element) => element.match(/[A-Z][a-z]*|\d+/g) || [];

module.exports = parseCompound;
