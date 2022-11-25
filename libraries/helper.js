const rand = Math.random;

const randomFrom = (arr) => arr[~~(rand() * arr.length)];

const isString = (obj) => typeof obj === "string" || obj instanceof String;

function pad(num, digits) {
  while (num.toString().length < digits) num = `0${num}`;
  return num;
}

function displayTime(t) {
  const ms = pad(t % 1000, 3);
  t = (t - ms) / 1000;

  const s = pad(t % 60, 2);
  t = (t - s) / 60;

  const m = pad(t % 60, 2);
  t = (t - m) / 60;

  const h = pad(t % 24, 2);
  t = (t - h) / 24;

  return h > 1 ? `${h}:${m}:${s}` : `${m}:${s}.${ms}`;
}

class Timer {
  constructor() {
    this.start = new Date();
  }

  get time() {
    return displayTime(new Date() - this.start);
  }

  stop() {
    console.log(displayTime(new Date() - this.start));
  }
}
