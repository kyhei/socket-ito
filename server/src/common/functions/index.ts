export function makeShuffledArray<T = number>(arg: number | T[]): T[] {
  let array: any[]
  if (typeof arg === 'number') {
    array = Array(arg).fill(null).map((item, index) => index)
  } else {
    array = arg.slice()
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  return array as T[]
}
