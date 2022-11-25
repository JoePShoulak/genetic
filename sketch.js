function findWord(target) {
  return function (cell) {
    const dna = cell.dna;

    const matches = dna.reduce((acc, val, i) => acc + (val === target[i]), 0);

    return matches;
  };
}

const genePool =
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()`-=[]\\;',./~_+{}|:\"<>? ";
const target = "What's next?";
const geneCount = target.length;

function foundWord(world) {
  return world.population.some((cell) => cell.dna.join("") === target);
}

let w;

const options = { mutationRate: 0.01, popCount: 100 };

function setup() {
  createCanvas(innerWidth, innerHeight);
  textAlign(CENTER, CENTER);
  noStroke();
  fill("white");
  textSize(50);

  w = new World(geneCount, genePool, findWord(target), options);
}

function draw() {
  background(20);

  w.next();

  text(w.fittest.dna.join(""), width / 2, height / 2);
  text(
    floor((100 * w.fittest.fitness) / target.length) + "%",
    width / 2,
    height / 2 + textSize()
  );

  if (foundWord(w)) {
    noLoop();
    console.log(w.generation);
  }
}
