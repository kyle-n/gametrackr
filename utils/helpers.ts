export function objectEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

export function rInt(a: number, b?: number) {
  let lower = a, upper = b;
  if (!upper) {
    lower = 0;
    upper = a;
  }
  return Math.floor(Math.random() * upper + lower);
}

export function nameList(): string {
  return 'list_' + Date.now();
}
