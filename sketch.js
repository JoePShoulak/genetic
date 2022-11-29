const genePool =
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()`-=[]\\;',./~_+{}|:\"<>? ";
const target = "When in the course of human events it becomes necessary...";
const geneCount = target.length;
const options = { mutationRate: 0.003, popCount: 175 };
const margin = 50;
const padding = 5;
const graphOffset = 3 / 4;

let world;
let history;
let timer;

const resizeText = () => {
  textSize((height - margin * 2) / 15);

  while (textWidth("Target: " + target) > width - 2 * margin)
    textSize(textSize() - 1);
};

const textPos = (n) => [margin, margin + n * textSize() + (n - 1) * padding];

function matchesWord(target) {
  return (cell) =>
    cell.dna.reduce((acc, val, i) => acc + (val === target[i]), 0);
}

const foundWord = (w) =>
  w.population.some((cell) => cell.dna.join("") === target);

const display = {
  status: () => {
    const progress = ~~((world.fittest.fitness * 100) / target.length);
    const calcRate = ~~((world.popCount * world.generation) / timer.seconds);

    text(`Target: ${target}`, ...textPos(1));
    text(`Guess:  ${world.fittest.dna.join("")}`, ...textPos(2));
    text(`Mutation Rate: ${world.mutationRate * 100}%`, ...textPos(4));
    text(`Population size: ${world.popCount}`, ...textPos(5));
    text(`Current fitness: ${progress}%`, ...textPos(6));
    text(`Generation count: ${world.generation}`, ...textPos(7));
    text(`Elapsed time: ${timer.formatted}`, ...textPos(8));
    text(`Guesses per second: ${calcRate}`, ...textPos(9));
  },

  graph: () => {
    stroke(128);
    line(0, height * graphOffset, width, height * graphOffset);
    stroke("white");

    history.slice(1).forEach((progress, i) => {
      const p0 = map(history[i - 1], 0, 1, height, height * graphOffset);
      const p1 = map(progress, 0, 1, height, height * graphOffset);

      line(i - 1, p0, i, p1);
    });
  },
};

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  resizeText();
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  fill("white");
  stroke("white");
  textFont("Courier");
  resizeText();

  world = new World(geneCount, genePool, matchesWord(target), options);
  history = Array(width).fill();
  timer = new Timer();
}

function draw() {
  if (foundWord(world)) {
    noLoop();
  } else {
    world.next();
    history.push(world.fittest.fitness / target.length);
  }

  while (history.length > width) history.shift();
  while (history.length < width) history.unshift(null);

  background(20);
  display.status();
  display.graph();
}
