/* == Classes == */
class World {
  constructor(
    geneCount,
    genePool,
    fitnessFunction,
    { popCount = 10, selectionOffset = 1, mutationRate = 0.01 } = {}
  ) {
    this.geneCount = geneCount;
    this.genePool = genePool;
    this.fitness = fitnessFunction;

    this.popCount = popCount;
    this.selectionOffset = selectionOffset;
    this.mutationRate = mutationRate;

    this.generation = 1;
    this.population = Array(this.popCount)
      .fill()
      .map((_) => new Cell(this, this.randomDNA()));
  }

  get fittest() {
    return this.population.reduce((acc, val) =>
      val.fitness > acc.fitness ? val : acc
    );
  }

  randomCell() {
    const n = this.selectionOffset;
    const totalFitness = this.population.reduce((a, v) => a + v.fitness + n, 0);

    let f = floor(rand() * totalFitness);
    let i = 0;
    while (f > 0) {
      f -= this.population[i].fitness + n;
      if (f < 0) break;
      i++;
    }

    return this.population[i];
  }

  randomGene() {
    return randomFrom(this.genePool);
  }

  randomDNA() {
    return Array(this.geneCount)
      .fill()
      .map((_) => this.randomGene());
  }

  next() {
    this.generation++;
    this.population = Array(this.popCount)
      .fill()
      .map((_) => {
        const p1 = this.randomCell();
        const p2 = this.randomCell();

        return p1.breed(p2);
      });
  }
}

class Cell {
  constructor(world, dna = null) {
    this.world = world;
    if (dna) {
      this.dna = isString(dna) ? dna.split("") : dna;
    } else {
      this.dna = this.world.randomDNA();
    }
  }

  // Selection
  get fitness() {
    return this.world.fitness(this);
  }

  // Variance
  mutate() {
    this.dna = this.dna.map((_, i) =>
      rand() < this.world.mutationRate ? this.world.randomGene() : this.dna[i]
    );

    return this;
  }

  // Heredity
  breed(partner) {
    const newDNA = this.dna.map((v, i) => (rand() < 0.5 ? v : partner.dna[i]));

    const child = new Cell(this.world, newDNA);

    return child.mutate();
  }
}
