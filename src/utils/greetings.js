const getTimeOfDay = (hour = new Date().getHours()) => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour <= 21) return 'evening';
  else return 'night';
};

const greetings = {
  morning: ['Good morning!', 'Top of the morning to you!'],
  afternoon: ['Good afternoon!', 'Jolly afternoon!'],
  evening: ['Good evening!'],
  night: ['Good night!'],
};
// TODO: add more greeting variants

const rng = (min = 0, max = 1) => Math.floor(Math.random() * (max - min) + min);

const greet = (time = getTimeOfDay()) => {
  const category = greetings[time];
  return category[rng(0, greetings[time].length)];
};

export default greet;

// let tries = 10;
// while (tries) {
//   console.log(rng(0, 5), greet());
//   tries--;
// }
