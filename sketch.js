function findWord(target) {
  return function (cell) {
    const dna = cell.dna;

    const matches = dna.reduce((acc, val, i) => acc + (val === target[i]), 0);

    return matches;
  };
}

function foundWord(world) {
  return world.population.some((cell) => cell.dna.join("") === target);
}

const genePool =
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()`-=[]\\;',./~_+{}|:\"<>? ";
const target = "News Night With Will McAvoy";
const geneCount = target.length;

let world;
let history;
const margin = 50;
const padding = 5;

const options = { mutationRate: 0.01, popCount: 100 };

const resizeText = () => {
  textSize((height - margin * 2) / 15);

  while (textWidth("Target: " + target) > width - 2 * margin)
    textSize(textSize() - 1);
};

const display = {
  text: () => {
    text(`Target: ${target}`, margin, margin + textSize());
    text(
      `Guess:  ${world.fittest.dna.join("")}`,
      margin,
      margin + 2 * textSize() + padding
    );
    text(
      `Mutation Rate: ${world.mutationRate * 100}%`,
      margin,
      margin + 4 * textSize() + 2 * padding
    );
    text(
      `Population size: ${world.popCount}`,
      margin,
      margin + 5 * textSize() + 3 * padding
    );
    text(
      `Current fitness: ${floor(
        (world.fittest.fitness * 100) / target.length
      )}%`,
      margin,
      margin + 6 * textSize() + 4 * padding
    );
    text(
      `Generation count: ${world.generation}`,
      margin,
      margin + 7 * textSize() + 5 * padding
    );
  },

  graph: () => {
    stroke(128);
    line(0, height - 100, width, height - 100);
    stroke("white");
    history.slice(1).forEach((progress, i) => {
      line(
        i,
        map(progress, 0, 1, height, height - 100),
        i - 1,
        map(history[i - 1], 0, 1, height, height - 100)
      );
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

  world = new World(geneCount, genePool, findWord(target), options);
  history = Array(width).fill();
}

function draw() {
  if (foundWord(world)) {
    noLoop();
    console.log(world.generation);
  } else {
    world.next();
    history.push(world.fittest.fitness / target.length);
  }

  while (history.length > width) history.shift();
  while (history.length < width) history.unshift(null);

  background(20);
  display.text();
  display.graph();
}
