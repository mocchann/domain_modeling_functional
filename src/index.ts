/** 4.1.1
 * Type signature
 */

const x: number = 1;
const add1 = (x: number): number => x + 1;

const y: number = 0;

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

/** 4.2
 * Type and Function
 */

// int16 -> someOutputType
type int16 = -32768 | -32767 | -2 | -1 | 0 | 1 | 2 | 32767 | 32768;
type someOutputType = string | number | boolean;
const someFunction = (x: int16[]): someOutputType => y;

// someInputType -> string
const z: string = "other string";
type someInputType = string | number | boolean;
const someFunction2 = (x: someInputType[]): string => z;

//Person -> someOutputType
type Person = {
  name: string;
  age: number;
};
const someFunction3 = (x: Person[]): someOutputType => y;

