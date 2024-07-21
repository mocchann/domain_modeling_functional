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

// someInputType -> Fruit
type Fruit = "Apple" | "Banana" | "Orange";
const someFunction4 = (x: someInputType[]): Fruit => "Apple";

// someInputType -> Fruit -> Fruit
type FruitToFruit = (x: Fruit) => Fruit;
const someFunction5 = (x: someInputType[]): FruitToFruit => {
  return (x: Fruit): Fruit => x;
};

/** 4.3
 * Type composition
 */

/** 4.3.1
 * Type "AND"
 */

type FruitSalad = {
  Apple: AppleVariety;
  Banana: BananaVariety;
  Cherries: CherryVariety;
};

/** 4.3.2
 * Type "OR"
 */

type FruitSnack = AppleVariety | BananaVariety | CherryVariety;

type AppleVariety = "Fuji" | "Granny Smith" | "Golden Delicious";
type BananaVariety = "Cavendish" | "GrosMichel" | "Manzano";
type CherryVariety = "Montmorency" | "Bing";

/** 4.3.3
 * Simple Type
 */

type ProductCodes = { productCode: string };

/** 4.3.4
 * Algebraic type systems
 */

/** 4.4
 * Handling F# types
 */

type PersonType = {
  First: string;
  Last: string;
};

const personValue: PersonType = {
  First: "Alex",
  Last: "Adams",
};

const { First, Last } = personValue;
const first = personValue.First;
const last = personValue.Last;

type UnitOrderQuantity = { type: "unitQuantity"; unitQuantity: number };
type KilogramOrderQuantity = {
  type: "kilogramQuantity";
  kilogramQuantity: number;
};

type OrderQuantity = UnitOrderQuantity | KilogramOrderQuantity;

const anOrderQtyInUnits: OrderQuantity = {
  type: "unitQuantity",
  unitQuantity: 5,
};

const anOrderQtyInKg: OrderQuantity = {
  type: "kilogramQuantity",
  kilogramQuantity: 2.5,
};

const printQuantity = (aOrderQty: OrderQuantity): string => {
  switch (aOrderQty.type) {
    case "unitQuantity":
      return `Order quantity is ${aOrderQty.unitQuantity} units`;
    case "kilogramQuantity":
      return `Order quantity is ${aOrderQty.kilogramQuantity} kg`;
  }
};

/** 4.5
 * Domain model construction by type synthesis
 */
