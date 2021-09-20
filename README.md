# Compound parser
A fast and simple parser for chemical compounds. 

Converts a string representing a chemical compound (eg. "H2O") into a Map of the different atoms that make up that compound (eg. {"H" => 2, "O" => 1})

# Example Usage
```
const parse = require("compound-parser");

const water         = parse("H2O");              // Map {"H" => 2, "O" => 1}
const ironHydroxide = parse("Fe(OH)3");          // Map {"Fe" => 1, "O" => 3, "H" => 3}
const someCompound  = parse("H2((O2)2(Ca2)2)2"); // Map {"H" => 2, "O" => 8, "Ca" => 8}
```

# 
