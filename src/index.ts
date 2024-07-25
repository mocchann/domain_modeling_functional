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

type UnitOrderQuantity1 = { type: "unitQuantity"; unitQuantity: number };
type KilogramOrderQuantity1 = {
  type: "kilogramQuantity";
  kilogramQuantity: number;
};

type OrderQuantity1 = UnitOrderQuantity1 | KilogramOrderQuantity1;

const anOrderQtyInUnits: OrderQuantity1 = {
  type: "unitQuantity",
  unitQuantity: 5,
};

const anOrderQtyInKg: OrderQuantity1 = {
  type: "kilogramQuantity",
  kilogramQuantity: 2.5,
};

const printQuantity = (aOrderQty: OrderQuantity1): string => {
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

type CheckNumber = { type: "checkNumber"; checkNumber: number };
type CardNumber = { type: "cardNumber"; cardNumber: number };
type CardType = "Visa" | "MasterCard";
type CreditCardInfo = {
  cardType: CardType;
  cardNumber: CardNumber;
};

type PaymentMethod =
  | "cash"
  | { type: "check"; check: CheckNumber }
  | { type: "card"; card: CreditCardInfo };
type PaymentAmount = { type: "paymentAmount"; paymentAmount: number };
type Currency = "USD" | "EUR";

type Payment = {
  amount: PaymentAmount;
  currency: Currency;
  method: PaymentMethod;
};

// UnpaidInvoice -> Payment -> PaidInvoice
type PayInvoice = (unpaidInvoice: any, payment: Payment) => "paidInvoice";
type ConvertPayentCurrency = (
  payment: Payment,
  currency: Currency
) => {
  payment: Payment;
};

/** 4.6
 * Modeling of Optional Values, Errors, and Collections
 */

/** 4.6.1
 * Modeling of Optional Values
 */

type Option<A> = { type: "some"; some: A } | undefined;

type PersonalName = {
  firstName: string;
  middleInitial: Option<string>;
  lastName: string;
};

type PersonalName2 = {
  firstName: string;
  middleInitial: string | undefined;
  lastName: string;
};

/** 4.6.2
 * Modeling of Errors
 */

type Result<S, F> = { type: "success"; ok: S } | { type: "failure"; error: F };

type PayInvoice2 = (
  unpaidInvoice: any,
  payment: Payment
) => Result<"paidInvoice", PaymentError>;

type PaymentError =
  | "CardTypeNotRecognized"
  | "PaymentRejected"
  | "PaymentProviderOffline";

/** 4.6.3
 * Modeling the absence of a value
 */

// SaveCustomer = Customer -> unit
type SaveCustomer = (customer: "Customer") => void;
// NextRandom = unit -> int
type NextRandom = () => number;

/** 4.6.4
 * List and Collection Modeling
 */

type Order = {
  orderId: "OrderId";
  Lines: "OrderLine"[];
};
const aList = [1, 2, 3];
const aNewList = [0, ...aList];

const printList = (aList: number[]): void => {
  switch (aList.length) {
    case 0:
      console.log("list is Empty");
      break;
    case 1:
      console.log(`list has one element: ${aList[0]}`);
      break;
    case 2:
      console.log(`list has two elements: ${aList[0]}, and ${aList[1]}`);
      break;
    default:
      console.log(`list has more than two elements`);
      break;
  }
};

/** 5.1
 * Review of domain model
 */

/** 5.3
 * Simple value modeling
 */

type CustomerId = { type: "customerId"; customerId: number };
type WidgetCode = { type: "widgetCode"; widgetCode: string };
type UnitOrderQuantity = { type: "unitQuantity"; unitQuantity: number };
type KilogramOrderQuantity = {
  type: "kilogramQuantity";
  kilogramQuantity: number;
};

/** 5.3.1
 * Use of Single Case Co-Use
 */

const CustomerId = (customerId: number): CustomerId => ({
  type: "customerId",
  customerId,
});

type OrderId = { type: "orderId"; orderId: number };

const OrderId = (orderId: number): { type: "orderId"; orderId: number } => ({
  type: "orderId",
  orderId,
});

//値を定義
const customerId = CustomerId(1);
const orderId = OrderId(1);

// 比較しようとするとコンパイルエラー
console.log(customerId === orderId);

// CustomerIdを引数に取る関数を定義
const processCustomerId = (id: CustomerId): void => {
  console.log(id);
};

// OrderIdを渡すとコンパイルエラー
processCustomerId(orderId);

// 構築
const customerId2 = CustomerId(42);
// 分解
const { customerId: innerValue } = customerId2;

console.log(innerValue); // 出力は42

// 分解
const processCustomerId2 = (customerId: CustomerId): void => {
  const { customerId: innerValue } = customerId;
  console.log(`${innerValue} is %i`);
};
// 関数のシグネチャ
// val processCustomerId2 : CustomerId -> unit

/** 5.3.3
 * Avoid performance problems due to simple types
 */
