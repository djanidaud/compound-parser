const parser = require("./index");

const createTest = (compound, shouldOutput) =>
  test(`Testing ${compound}`, () =>
    expect(Array.from(parser(compound)).sort()).toEqual(shouldOutput.sort()));

createTest("H2O", [
  ["H", 2],
  ["O", 1],
]);

createTest("Fe2OH3", [
  ["Fe", 2],
  ["O", 1],
  ["H", 3],
]);

createTest("AlC3H8C3H8OAl", [
  ["Al", 2],
  ["O", 1],
  ["C", 6],
  ["H", 16],
]);

createTest("Na(OH)2", [
  ["Na", 1],
  ["O", 2],
  ["H", 2],
]);

createTest("Na(OH2)2", [
  ["Na", 1],
  ["O", 2],
  ["H", 4],
]);

createTest("H22(O2)", [
  ["H", 22],
  ["O", 2],
]);

createTest("H22((O2)4)25", [
  ["H", 22],
  ["O", 200],
]);

createTest("H2((O2)2(Ca2)2)2", [
  ["H", 2],
  ["O", 8],
  ["Ca", 8],
]);

createTest("H2((O2))", [
  ["H", 2],
  ["O", 2],
]);

createTest("H2(H2(O2)2)2", [
  ["H", 6],
  ["O", 8],
]);

createTest("H(O)(O)2", [
  ["H", 1],
  ["O", 3],
]);
