const parseCompound = (compound) => {
    const parserState = {
        atomsMap: new Map(),
        stack: [],
    };
    const {atomsMap, stack} = parserState;

    formatCompound(compound).forEach((token) => {
        if (!isNaN(token)) {
            processBrackets(token, parserState);
            return;
        }
        if (token === "(" || token === ")") {
            stack.push(token);
            return;
        }
        if (stack.length === 0) {
            processElement(token, atomsMap);
            return;
        }
        stack.push(token);
    });

    return atomsMap;
};

const processElement = (element, atomsMap, scale = 1) => {
    const atoms = parseAtoms(element);
    const incAtom = (key, count = 0) =>
        atomsMap.set(key, (atomsMap.get(key) || 0) + count);

    atoms.forEach((atom, i) =>
        isNaN(atom) ? incAtom(atom) : incAtom(atoms[i - 1], parseInt(atom) * scale)
    );
};

const processBrackets = (context, {atomsMap, stack}) => {
    let scale = parseInt(context);
    let affected = [];
    let lastPopped;
    let deepness = 0;
    stack.pop();

    while ((lastPopped = stack.pop()) !== "(" || deepness !== 0) {
        if (lastPopped === ")") deepness++;
        if (lastPopped === "(") deepness--;
        affected.push(lastPopped);
    }

    if (stack.length === 0)
        affected.forEach((el) => processElement(el, atomsMap, scale));
    else scaleBracketedElements(affected, scale).forEach((e) => stack.push(e));
};

const scaleBracketedElements = (affected, scale) =>
    affected
        .map(parseAtoms)
        .map((atoms) =>
            atoms
                .map((atom) => (isNaN(atom) ? atom : parseInt(atom) * scale))
                .join("")
        );

const parseAtoms = (element) => element.match(/[A-Z][a-z]*|\d+/g) || [];

const formatCompound = (compound) => {
    const tokens = compound.match(/[A-Z][a-z]*\d*|[()]|\d+/g);

    return tokens.reduce((acc, comp, i) => {
        acc.push(comp);

        if (!isNaN(comp) || comp === "(") return acc;

        if (comp === ")") {
            if (isNaN(tokens[i + 1])) acc.push("1");
            return acc;
        }

        if ((comp.match(/\d+/g) || []).length === 0)
            acc[acc.length - 1] = comp + "1";

        return acc;
    }, []);
};

module.exports = parseCompound;
