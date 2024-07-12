/** 4.1.1
 * Type signature
 */

let x: number = 1;
const add1 = (x: number): number => x + 1;

let y: number;

const add = (x: number, y: number): number => x + y;

// squarePlusOne : int -> int
const squarePlusOne = (x: number): number => {
  let square = x * x;
  return square + 1;
};

/** 4.1.2
 * Generic type function
 */

// areEqual : 'a -> 'a -> bool
const areEqual = <A>(x: A, y: A): boolean => x === y;
