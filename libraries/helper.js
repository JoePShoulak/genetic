const rand = Math.random;
const floor = Math.floor;

const randomFrom = (arr) => arr[floor(rand() * arr.length)];

const isString = (obj) => typeof obj === "string" || obj instanceof String;
