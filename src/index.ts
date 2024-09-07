import { describe, mock } from "node:test";

namespace Chapter_4 {
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

  type Result<S, F> =
    | { type: "success"; ok: S }
    | { type: "failure"; error: F };

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

  type Order1 = {
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
}

namespace Chapter_5 {
  /** 5.1
   * Review of domain model
   */

  /** 5.3
   * Simple value modeling
   */

  type CustomerId = { type: "customerId"; customerId: number };
  type WidgetCode1 = { type: "widgetCode"; widgetCode: string };
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

  type UnitOrderQuantity2 = number;

  // [Strict]
  type UnitQuantity1 = { type: "unitQuantity"; unitQuantity: number };
  type UnitQuantities = { type: "unitQuantities"; unitQuantities: number[] };

  /** 5.4
   * Modeling of complex data
   */

  /** 5.4.1
   * Modeling by record type
   */

  type Order = {
    customerInfo: CustomerInfo;
    shippingAddress: ShippingAddress;
    billingAddress: BillingAddress;
    orderLines: OrderLine[];
    amountToBill: AmountToBill;
  };

  /** 5.4.2
   * Modeling of unknown types
   */

  type Undefined = undefined;

  type CustomerInfo = Undefined;
  type ShippingAddress = Undefined;
  type BillingAddress = Undefined;
  // type OrderLine = Undefined;
  type AmountToBill = Undefined;

  /** 5.4.3
   * Modeling by choise type
   */

  type WidgetCode = string;
  type GizmoCode = string;
  type ProductCode =
    | { type: "Widget"; code: WidgetCode }
    | { type: "Gizmo"; code: GizmoCode };

  type UnitQuantity = number;
  type kilogramQuantity = number;
  type OrderQuantity =
    | { type: "Unit"; quantity: UnitQuantity }
    | { type: "Kilogram"; quantity: kilogramQuantity };

  /** 5.5
   * Workflow modeling with functions
   */

  // type ValidateOrder = (unValidateOrder: UnvalidateOrder) => Result<ValidatedOrder, Error>;

  /** 5.5.1
   * Organize complex inputs and outputs
   */

  type PlaceOrderEvents = {
    AcknowledgmentSent: AcknowledgmentSent;
    OrderPlaced: OrderPlaced;
    BillableOrderPlaced: BillableOrderPlaced;
  };

  type PlaceOrder = (unValidateOrder: UnvalidateOrder) => PlaceOrderEvents;

  type EnvelopeContents = { type: "EnvelopeContents"; contents: string };
  type CategorizeMail =
    | { type: "Quote"; form: QuoteForm }
    | { type: "Order"; form: OrderForm };

  type CateforizeInboundMail = (
    envelopeContents: EnvelopeContents
  ) => CategorizeMail;

  // type CalculatePrices = (
  //   orderForm: OrderForm,
  //   productCatalog: ProductCatalog
  // ) => PricedOrder;

  // type CalculatePricesInputs = {
  //   orderForm: OrderForm;
  //   productCatalog: ProductCatalog;
  // }
  // type CalculatePrices = (inputs: CalculatePricesInputs) => PricedOrder;

  /** 5.2.2
   * Document effects with function signatures
   */

  // type ValidateOrder = (
  //   unValidateOrder: UnvalidateOrder
  // ) => Promise<Result<ValidatedOrder, ValidationError[]>>;

  type ValidationError = {
    fieldName: string;
    ErrorDescription: string;
  };

  type ValidationResponse<A> = Promise<Result<A, ValidationError[]>>;

  type ValidateOrder = (
    unValidatedOrder: UnValidatedOrder
  ) => ValidationResponse<ValidatedOrder>;

  /** 5.6
   * Identity Considerations: Value Objects
   */

  const widgetCode1: WidgetCode = "W1234";
  const widgetCode2: WidgetCode = "W1234";
  console.log(widgetCode1 === widgetCode2); // true

  const name1 = { firstName: "Alex", lastName: "Adams" };
  const name2 = { firstName: "Alex", lastName: "Adams" };
  console.log(name1 === name2); // true

  const address1 = {
    streetAddress: "123 Main St",
    city: "New York",
    zip: "90001",
  };
  const address2 = {
    streetAddress: "123 Main St",
    city: "New York",
    zip: "90001",
  };
  console.log(address1 === address2); // true

  /** 5.7
   * Identity Considerations: Entity Objects
   */

  /** 5.7.1
   * Entity identifier
   */

  type ContactId1 = { type: "contactId"; contactId: number };
  type Contact1 = {
    contactId: ContactId;
    phoneNumber: PhoneNumber;
    emailAddress: EmailAddress;
  };

  /** 5.7.2
   * Adding Identifiers to Data Definitions
   */

  // 未払いのケースの情報(ID無し)
  // type UnpaidInvoice = ...;

  // 払い済みのケースの情報(ID無し)
  // type PaidInvoice = ...;

  // 統合された情報(ID無し)
  type InvoiceInfo =
    | { type: "Unpaid"; invoice: UnpaidInvoice }
    | { type: "Paid"; invoice: PaidInvoice };

  // 請求書ID
  // type InvoiceId = ...;

  // トップレベルの請求書型
  type Invoice = {
    invoiceId: InvoiceId; // 子のケースの「外側」
    invoiceInfo: InvoiceInfo;
  };

  type UnpaidInvoice = {
    InvoiceId: InvoiceId; // 「内側」に保持するID
    // 未払いのケースのその他の情報
  };

  type PaidInvoice = {
    InvoiceId: InvoiceId; // 「内側」に保持するID
    // 払い済みのケースのその他の情報
  };

  // トップレベルの請求書型
  type Invoice =
    | { type: "Unpaid"; invoice: UnpaidInvoice }
    | { type: "Paid"; invoice: PaidInvoice };

  // const invoice: Invoice = ...;

  // この型ならパターンマッチのときにIDも含めて、すべてのデータに一度にアクセス可能
  // IDを共通で持つと以下のようにswitch文を書いてもIDにはアクセスできない
  // switch (invoice.type) {
  //   case "Unpaid":
  //     console.log(invoice.invoice.invoiceId);
  //     break;
  //   case "Paid":
  //     console.log(invoice.invoice.invoiceId);
  //     break;
  // }

  /** 5.7.3
   * Implementing Equivalence for Entities
   */

  type ContactId = number;
  type PhoneNumber = string;
  type EmailAddress = string;

  type ContactIdType = { type: "contactId"; contactId: number };

  class Contact {
    contactId: ContactId;
    phoneNumber: PhoneNumber;
    emailAddress: EmailAddress;

    constructor(
      contactId: ContactId,
      phoneNumber: PhoneNumber,
      emailAddress: EmailAddress
    ) {
      this.contactId = contactId;
      this.phoneNumber = phoneNumber;
      this.emailAddress = emailAddress;
    }

    equals(obj: any): boolean {
      return obj.contactId === this.contactId;
    }

    getHashCode(): number {
      return this.hashString(this.contactId.toString());
    }

    private hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return hash;
    };
  }

  const contactId: ContactIdType = { type: "contactId", contactId: 1 };

  const contact1 = {
    contactId: contactId.contactId,
    phoneNumber: "123-456-7890",
    emailAddress: "bob@example.com",
  };

  const contact2 = {
    contactId: contactId.contactId,
    phoneNumber: "123-456-7890",
    emailAddress: "robert@example.com",
  };

  const objContact = new Contact(
    contact1.contactId,
    contact1.phoneNumber,
    contact1.emailAddress
  );

  console.log(objContact.equals(contact2)); // true

  /** 5.7.4
   * Immutability and Identity
   */

  const initialPerson = {
    personId: 42,
    name: "Joseph",
  };

  const updatedPerson = {
    ...initialPerson,
    name: "Joe",
  };

  // type UpdateName = (person: Person, newName: string) => void;
  type UpdateName = (person: Person, newName: string) => Person;

  /** 5.8
   * aggregating
   */

  type OrderLine = {
    orderLineId: number;
    price: number;
  };

  const changeOrderLinePrice = (
    order: Order,
    orderLineId: OrderLine["orderLineId"],
    newPrice: OrderLine["price"]
  ) => {
    const targetOrderLine = order.orderLines.find(
      (orderLine) => orderLine.orderLineId === orderLineId
    );

    const newOrderLine = {
      ...targetOrderLine,
      price: newPrice,
    };

    const newOrderLines = order.orderLines.map((orderLine) => {
      if (orderLine.orderLineId === orderLineId) {
        return newOrderLine;
      }
      return orderLine;
    });

    const newOrder = {
      ...order,
      orderLines: newOrderLines,
    };

    return newOrder;
  };

  /** 5.8.1
   * Guarantee of consistency and invariant conditions through aggregations
   */

  /** 5.8.2
   * Aggregate Reference
   */

  // bad
  // type Order = {
  //   orderId: OrderId;
  //   customer: Customer; // 関連する顧客に関する情報
  //   orderLines: OrderLine[];
  // };

  // good
  // type Order = {
  //   orderId: OrderId;
  //   customerId: CustomerId; // 関連する顧客に対する参照
  //   orderLines: OrderLine[];
  // };

  /** 5.9
   * Combine all
   */

  namespace OrderTaking.Domain {
    // 製品コード関連
    type WidgetCode = { type: "widgetCode"; widgetCode: string };
    // 制約: 先頭が"W" + 数字4桁
    type GizmoCode = { type: "gizmoCode"; gizmoCode: string };
    // 制約: 先頭が"G" + 数字4桁
    type ProductCode = WidgetCode | GizmoCode;
    // 注文数量関連
    type UnitOrderQuantity = { type: "unitQuantity"; unitQuantity: number };
    type KilogramOrderQuantity = {
      type: "kilogramQuantity";
      kilogramQuantity: number;
    };
    type OrderQuantity = UnitOrderQuantity | KilogramOrderQuantity;

    // 上記は値オブジェクトのため、識別子(id)は不要

    // 注文は変更されてもアイデンティティが維持されるため、idを使ってモデル化する
    // 現時点ではidがstring or number or Guidかはわからないが、必要なことはわかっているためundefinedでモデル化する
    type OrderId = undefined;
    type OrderLineId = undefined;
    type CustomerId = undefined;

    type CustomerInfo = undefined;
    type ShippingAddress = undefined;
    type BillingAddress = undefined;
    type Price = undefined;
    type BillingAmount = undefined;

    type OrderLine = {
      id: OrderLineId;
      orderId: OrderId;
      productCode: ProductCode;
      orderQuantity: OrderQuantity;
      price: Price;
    };

    type Order = {
      id: OrderId; // エンティティのID
      customerId: CustomerId; // 顧客の参照
      shippingAddress: ShippingAddress;
      billingAddress: BillingAddress;
      orderLines: OrderLine[];
      amountToBill: BillingAmount;
    };

    // 最後にワークフロー全体を定義する
    // ワークフローの入力であるUnvalidateOrder<未検証の注文>は注文書からそのまま作成されるため
    // numberやstringなどプリミティブな型しか含まない
    type UnvalidatedOrder = {
      orderId: OrderId;
      customerInfo: CustomerInfo;
      shippingAddress: ShippingAddress;
      billingAddress: BillingAddress;
      orderLines: OrderLine[];
      amountToBill: BillingAmount;
    };
    // ↑じゃあorderLinesはどうする？？？ここよくわからん

    // ワークフローの出力には2つの型が必要
    // 1: ワークフローが成功したときのイベント型
    type PlaceOrderEvents = {
      acknowledgmentSent: AcknowledgmentSent;
      orderPlaced: OrderPlaced;
      billableOrderPlaced: BillableOrderPlaced;
    };
    // 2: ワークフローが失敗したときのエラー型
    type ValidationError = {
      fieldName: string;
      errorDescription: string;
    };

    type PlaceOrderError =
      | { type: "validationError"; error: ValidationError[] }
      | { type: "otherError"; error: OtherError[] };

    // 最後に注文確定のワークフローを表すトップレベルの関数を定義する
    // 「注文確定」プロセス
    type PlaceOrder = (
      unvalidatedOrder: UnvalidatedOrder
    ) => Result<PlaceOrderEvents, PlaceOrderError>;
  }
}

namespace Chapter_6 {
  /** 6.1
   * Simple value completeness
   */

  type UnitQuantity = { type: "unitQuantity"; unitQuantity: number };

  const createUnitQuantity = (() => {
    let unitQuantity: UnitQuantity | null;

    return (args: number): UnitQuantity => {
      if (unitQuantity === null) {
        unitQuantity = { type: "unitQuantity", unitQuantity: args };
      }
      return unitQuantity;
    };
  })();

  const UnitQuantity = () => {
    type Result<S, F> =
      | { type: "success"; ok: S }
      | { type: "failure"; error: F };

    const value = (unit: UnitQuantity): number => {
      return unit.unitQuantity;
    };

    const create = (qty: number): Result<UnitQuantity, string> => {
      if (qty < 1) {
        throw new Error("UnitQuantity can not be negative");
      } else if (qty > 1000) {
        throw new Error("UnitQuantity can not be more than 1000");
      } else {
        return {
          type: "success",
          ok: { type: "unitQuantity", unitQuantity: qty },
        };
      }
    };

    return { value, create };
  };

  const result = UnitQuantity().create(1);

  switch (result.type) {
    case "success":
      console.log(`Success. Value is ${result.ok}`);
      const innerValue = UnitQuantity().value(result.ok);
      console.log(`Inner value is ${innerValue}`);
      break;
    case "failure":
      console.log(result.error);
      break;
  }

  /** 6.2
   * Measurement Unit
   */

  type Kg = "kg";
  type M = "m";

  type Brand<T, U> = T & { __brand: U };
  type Weight = Brand<number, Kg>;
  type Meter = Brand<number, M>;

  const fiveKilos: Weight = 5.0 as Weight;
  const fiveMeters: Meter = 5.0 as Meter;

  // fiveKilos = fiveMeters; // コンパイルエラー
  // const listOfWeights: Weight[] = [fiveKilos, fiveMeters]; // コンパイルエラー

  type KilogramOrderQuantity = {
    type: "kilogramQuantity";
    kilogramQuantity: Weight;
  };

  const quantity: KilogramOrderQuantity = {
    type: "kilogramQuantity",
    kilogramQuantity: fiveKilos,
  };

  /** 6.3
   * Enforcement of invariant conditions by type systems
   */

  type NotEmptyList<A> = {
    first: A;
    rest: A[];
  };

  type Order = {
    customerInfo: CustomerInfo;
    shippingAddress: ShippingAddress;
    billingAddress: BillingAddress;
    orderLines: NotEmptyList<OrderLine>; // 1つの注文には少なくとも1つの注文明細行が必要
    amountToBill: AmountToBill;
  };

  /** 6.4
   * Representing business rules in type systems
   */

  // フラグを使って検証済みかどうかを表現する方法(これではフラグの目的・更新はいつどんな状況でするのかわからない)
  type CustomerEmail = {
    emailAddress: EmailAddress;
    isVerrified: boolean;
  };

  // 検証済み・未検証は別々のものとしてモデル化するべき
  type CustomerEmail =
    | { type: "unverified"; emailAddress: EmailAddress }
    | { type: "verified"; emailAddress: VerifiedEmailAddress }; // Emailの型も別で作る

  type SendPasswordResetEmail = (email: VerifiedEmailAddress) => void;

  // 顧客に連絡を取るというビジネスルール。顧客は「email」または「郵便のアドレス」を持っている必要がある。
  // モデル化するが、以下は正しくない。
  type Contact = {
    name: Name;
    email: EmailContactInfo;
    address: PostalContactInfo;
  };

  // これも正しくない。emailとaddressの両方持っていない可能性もあるため、ビジネスルールに反している
  type Contact = {
    name: Name;
    email?: EmailContactInfo;
    address?: PostalContactInfo;
  };

  // これが正しいモデル化(今回の場合、メールのみ/住所のみ/両方持つの3パターンである)
  type BothContactMethods = {
    email: EmailContactInfo;
    address: PostalContactInfo;
  };

  // 選択型
  type ContactInfo =
    | { type: "emailOnly"; emailContactInfo: EmailContactInfo }
    | { type: "postalOnly"; postalContactInfo: PostalContactInfo }
    | { type: "emailAndAddr"; bothContactMethods: BothContactMethods };

  // 上記を使ってContact型を定義
  type Contact = {
    name: Name;
    contactInfo: ContactInfo;
  };

  /** 6.5
   * Integrity
   */

  /** 6.5.1
   * Consistency within one aggregate
   */

  const changeOrderLinePrice = (
    order: Order,
    orderLineId: OrderLine["orderLineId"],
    newPrice: OrderLIne["price"]
  ): Order => {
    const targetOrderLine = order.orderLines.rest.find(
      (orderLine) => orderLine.orderLineId === orderLineId
    );

    if (!targetOrderLine) {
      throw new Error("Order line not found");
    }

    const newOrderLine = {
      ...targetOrderLine,
      price: newPrice,
    };

    const newOrderLines = order.orderLines.rest.map((orderLine) => {
      if (orderLine.orderLineId === orderLineId) {
        return newOrderLine;
      }
      return orderLine;
    });

    const newAmountToBill = newOrderLines.reduce(
      (sum, line) => sum + line.price,
      0
    );

    const newOrder = {
      ...order,
      orderLines: {
        first: newOrderLines[0],
        rest: newOrderLines,
      },
      amountToBill: newAmountToBill,
    };

    return newOrder;
  };

  /** 6.5.2
   * Consistency between different contexts
   */

  /** 6.5.3
   * Consistency between aggregates in the same context
   */

  // 口座間送金の場合、口座がAccount<口座>集約で表現
  // このケースではトランザクションが独自の識別子を持っていることが多く、トランザクション自体がDDDのエンティティであることを意味する
  type MoneyTransfer = {
    id: MoneyTransferId;
    toAccount: AccountId;
    fromAccount: AccountId;
    Amount: Money;
  };

  /** 6.5.4
   * Multiple aggregates acting on the same data
   */
}

namespace Chapter_7 {
  /** 7.1
   * Input Workflow
   */

  type UnvalidatedOrder = {
    orderId: string;
    customerInfo: UnvalidatedCustomerInfo;
    shippingAddress: UnvalidatedShippingAddress;
    billingAddress: UnvalidatedBillingAddress;
    orderLines: UnvalidatedOrderLine[];
    amountToBill: UnvalidatedAmountToBill;
  };

  /** 7.1.1
   * Commands as input
   */

  type PlaceOrder = {
    orderForm: UnvalidatedOrder;
    timestamp: Date;
    userId: string;
    // etc...
  };

  /** 7.1.2
   * Sharing common structures through generics
   */

  type Command<Data> = {
    data: Data;
    timestamp: Date;
    userId: string;
    // etc...
  };

  type PlaceOrder = Command<UnvalidatedOrder>;

  /** 7.1.3
   * Combine multiple commands into one type
   */

  type OrderTakingCommand =
    | { type: "place"; placeOrder: PlaceOrder }
    | { type: "change"; changeOrder: ChangeOrder }
    | { type: "cancel"; cancelOrder: CancelOrder };

  /** 7.2
   * Modeling orders by sets of states
   */

  // 状態をすべて別々のフラグで表現する
  type Order = {
    orderId: OrderId;
    // ...
    isValidated: boolean; // 検証時に設定される
    isPriced: boolean; // 価格計算時に設定される
    amountToBill?: number; // 価格計算時に設定される
  };
  // これではいろんなドメインを表現するのが難しく、不必要なフラグが増え、条件分岐が乱立する複雑なコードになる
  // ドメインをモデル化するより良い方法は、注文の各状態に対して新しい型を作成すること

  // 検証済みの注文
  type ValidatedOrder = ValidatedCustomerInfo &
    ValidatedShippingAddress &
    ValidatedBillingAddress &
    ValidatedOrderLine[];

  // 検証済みの注文に対応する型定義
  type ValidatedOrder = {
    orderId: OrderId;
    customerInfo: ValidatedCustomerInfo;
    shippingAddress: ValidatedShippingAddress;
    billingAddress: ValidatedBillingAddress;
    orderLines: ValidatedOrderLine[];
  };

  // 価格計算済みの注文の型
  type PricedOrder = {
    orderId: OrderId;
    customerInfo: ValidatedCustomerInfo;
    shippingAddress: ValidatedShippingAddress;
    billingAddress: ValidatedBillingAddress;
    // 検証済みの注文明細行とは異なり、OrderLine→PricedOrderLineに変更
    orderLines: PricedOrderLine[];
    amountToBill: BillingAmount;
  };

  // とりうる状態をすべて作成したら、トップレベルの型を作成する
  type Order =
    | { type: "unvalidatedOrder"; unvalidatedOrder: UnvalidatedOrder }
    | { type: "validatedOrder"; validatedOrder: ValidatedOrder }
    | { type: "pricedOrder"; pricedOrder: PricedOrder };
  // etc...

  /** 7.3
   * State Machine
   */

  /** 7.3.1
   * Why use state machines?
   */

  /** 7.3.2
   * How to implement a simple state machine in F#
   */

  type Item = {
    name: string;
    price: number;
    // etc...
  };
  type EmptyCart = { type: "emptyCart" };
  type ActiveCartData = { unpaidItems: Item[] };
  type PaidCartData = { paidItems: Item[]; Payment: number };

  type ShoppingCart =
    | EmptyCart
    | { type: "activeCart"; activeCart: ActiveCartData }
    | { type: "paidCart"; paidCart: PaidCartData };

  const addItem = (cart: ShoppingCart, item: Item): ShoppingCart => {
    switch (cart.type) {
      case "emptyCart":
        return { type: "activeCart", activeCart: { unpaidItems: [item] } };
      case "activeCart":
        return {
          type: "activeCart",
          activeCart: { unpaidItems: [...cart.activeCart.unpaidItems, item] },
        };
      case "paidCart":
        return cart;
    }
  };

  const makePayment = (cart: ShoppingCart, payment: number): ShoppingCart => {
    switch (cart.type) {
      case "activeCart":
        return {
          type: "paidCart",
          paidCart: {
            paidItems: cart.activeCart.unpaidItems,
            Payment: payment,
          },
        };
      case "emptyCart":
        return cart;
      case "paidCart":
        return cart;
    }
  };

  /** 7.4.1
   * Steps in verification
   */

  type CheckProductCodeExists = (productCode: ProductCode) => boolean;
  type CheckedAddress = { type: "checkedAddress"; address: UnvalidatedAddress };
  type AddressValidationError = {
    type: "addressValidationError";
    error: string;
  };
  type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => Result<CheckedAddress, AddressValidationError>;

  type Result<T, E> =
    | { success: true; value: T }
    | { success: false; error: E };

  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists
  ) => (
    checkAddressExists: CheckAddressExists
  ) => (
    unvalidatedOrder: UnvalidatedOrder
  ) => Result<ValidatedOrder, ValidationError>;

  /** 7.4.2
   * Steps in pricing
   */

  type GetProductPrice = (productCode: ProductCode) => Price;

  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (validatedOrder: ValidateOrder) => PriceOrder;

  /** 7.4.3
   * Steps in Order Confirmation
   */

  type HtmlString = { type: "htmlString"; html: string };
  type OrderAcknowledgment = {
    emailAddress: EmailAddress;
    letter: HtmlString;
  };

  type CreateOrderAcknowledgmentLetter = (priceOrder: PriceOrder) => HtmlString;

  type SendOrderAcknowledgment = (
    orderAcknowledgment: OrderAcknowledgment
  ) => (orderAcknowledgment: OrderAcknowledgment) => void;

  // 確認注文書が送られたら、<注文確認を送った>イベントを返したい。そこですぐ重つくのはbooleanを返すことだが、真偽値では情報量が少ない
  // type SendOrderAcknowledgment = (
  //   orderAcknowledgment: OrderAcknowledgment
  // ) => boolean;

  // そこで、真偽値ではなく、成功したかどうかを表すResult型を使うか?
  type SendResult = Sent | NotSent;
  type SendOrderAcknowledgment = (
    orderAcknowledgment: OrderAcknowledgment
  ) => SendResult;

  // あるいは、サービス自体が省略可能なOrderAcknowledgmentSentイベントを返すようにするか?
  type SendOrderAcknowledgment = (
    orderAcknowledgment: OrderAcknowledgment
  ) => OrderAcknowlegmentSent | undefined;

  // 注文確認ステップの出力
  type OrderAcknowledgmentSent = {
    orderId: OrderId;
    emailAddress: EmailAddress;
  };

  // これらのステップを組み合わせてこのステップの関数型を定義する
  type AcknowledgeOrder = (
    createOrderAcknowledgmentLetter: CreateOrderAcknowledmentLetter
  ) => (
    sendOrderAcknowledgment: SendOrderAcknowledgment
  ) => (priceOrder: PriceOrder) => OrderAcknowledgmentSent | undefined;

  /** 7.4.4
   * Create an event to return
   */

  type OrderPlaced = PricedOrder;
  type BillableOrderPlaced = {
    orderId: OrderId;
    billingAddress: Address;
    amountToBill: BillingAmount;
  };

  // 実際にイベントを返すにはこれらのイベントを保持する専用の型を作成する方法もある
  type PlacedOrderResult = {
    orderPlaced: OrderPlaced;
    billableOrderPlaced: BillableOrderPlaced;
    orderAcknowledgmentSent: OrderAcknowledgmentSent | undefined;
  };

  // しかし、このワークフローに新しいイベントを追加していく可能性が高いため、↑のようなレコード型を定義してしまうと変更が難しくなる
  // そこでワークフローがイベントのリストを返すことにする
  type PlaceOrderEvent =
    | { type: "orderPlaced"; orderPlaced: OrderPlaced }
    | { type: "billableOrderPlaced"; billableOrderPlaced: BillableOrderPlaced }
    | {
        type: "orderAcknowledgment";
        orderAcknowledgment: OrderAcknowledgmentSent;
      };

  // そしてワークフローの最終ステップで↑のイベントのリストを発行する
  type CreateEvents = (pricedOrder: PricedOrder) => PlaceOrderEvent[];

  /** 7.5
   * Documentation of effects
   */

  /** 7.5.1
   * Effects in the verification step
   */

  // type CheckProductCodeExists = (productCode: ProductCode) => boolean;

  type AsyncResult<S, F> = Promise<Result<S, F>>;

  type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => AsyncResult<CheckedAddress, AddressValidationError>;

  // AsyncResultはそれを含むすべてのコードに伝染するため、Result→AsyncResultに変更が必要
  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists
  ) => (
    checkAddressExists: CheckAddressExists
  ) => (
    unvalidatedOrder: UnvalidatedOrder
  ) => AsyncResult<ValidatedOrder, ValidationError>;

  /** 7.5.2
   * Effects in the pricing step
   */

  type PricingError = { type: "pricingError"; error: string };
  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (validateOrder: ValidateOrder) => Result<PricedOrder, PricingError>;

  /** 7.5.3
   * Effects in the confirmation step
   */

  type SendOrderAcknowledgment = (
    orderAcknowledgment: OrderAcknowledgment
  ) => Promise<SendResult>;

  type AcknowledgeOrder = (
    createOrderAcknowledgmentLetter: CreateOrderAcknowledmentLetter
  ) => (
    sendOrderAcknowledgment: SendOrderAcknowledgment
  ) => (priceOrder: PriceOrder) => Promise<OrderAcknowledgmentSent | undefined>;

  /** 7.6
   * Synthesising workflows from steps
   */

  // 依存関係を取り除いた入力と出力だけの全体のステップ
  // 各typeの出力と入力の型が一致していないのはあとで修正が必要

  type ValidateOrder = (
    unvalidatedOrder: UnvalidatedOrder // 入力
  ) => AsyncResult<ValidatedOrder, ValidationError>; // 出力

  type PriceOrder = (
    validatedOrder: ValidatedOrder // 入力
  ) => Result<PricedOrder, PricingError>; // 出力

  type AcknowledgeOrder = (
    pricedOrder: PriceOrder // 入力
  ) => Promise<OrderAcknowledgmentSent | undefined>; // 出力

  type CreateEvents = (
    pricedOrder: PricedOrder // 入力
  ) => PlaceOrderEvent[]; // 出力

  /** 7.7
   * Are dependencies part of the design?
   */

  // 依存関係を明確にするために、各サブステップの設計で追加パラメータを導入した

  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists // 明示的な依存関係
  ) => (
    checkAddressExists: CheckAddressExists // 明示的な依存関係
  ) => (
    unvalidatedOrder: UnvalidatedOrder // 入力
  ) => AsyncResult<ValidatedOrder, ValidationError[]>;

  type PriceOrder = (
    getProductPrice: GetProductPrice // 明示的な依存関係
  ) => (
    validatedOrder: ValidatedOrder // 入力
  ) => Result<PricedOrder, PricingError>; // 出力

  // プロセスが目的を達成するためにどのようなシステムと連携する必要があるのか、本当に気にするべきか？
  // ↑の視点に立つなら、プロセスの定義はインプットとアウトプットのみに簡略化され次のようになる

  type ValidateOrder = (
    unvalidatedOrder: UnvalidatedOrder // 入力
  ) => AsyncResult<ValidatedOrder, ValidationError[]>; // 出力

  type PriceOrder = (
    validatedOrder: ValidatedOrder // 入力
  ) => Result<PricedOrder, PricingError>; // 出力

  // どちらのアプローチが良いのかは以下ガイドラインに沿って考える
  // - パブリックAPIで公開される関数っ→依存関係の情報を呼び出し元から隠す
  // - 内部で使用される関数→依存関係を明示する

  // トップレベルのPlaceOrder<注文確定>ワークフロー関数は呼び出し側が依存関係を知る必要がないので非公開
  type PlaceOrderWorkflow = (
    placeOrder: PlaceOrder // 入力
  ) => AsyncResult<PlaceOrderEvent[], PlaceOrderError>; // 出力
  // ワークフロー内部の各ステップが実際に必要とするものを文書化できるため依存関係を明示する

  /** 7.8
   * Completion of the pipeline
   */

  // -----------------
  // 入力データ
  // -----------------

  type UnvalidatedOrder = {
    orderId: string;
    customerInfo: UnvalidatedCustomer;
    shippingAddress: UnvalidatedAddress;
  } & UnvalidatedCustomer = {
    name: string;
    email: string;
  } & UnvalidateedAddress = {
    // ...
  };

  // -----------------
  // 入力コマンド
  // -----------------

  type Command<Data> = {
    data: Data;
    timestamp: Date;
    userId: string;
    // etc
  };

  type PlaceOrderCommand = Command<UnvalidatedOrder>;

  // 次はアウトプットとワークフロー本体の定義

  // -----------------
  // パブリックAPI
  // -----------------

  /// 受注確定ワークフローの成功出力
  type OrderPlaced = "...";
  type BillableOrderPlaced = "...";
  type OrderAcknowledgmentSent = "...";
  type PlaceOrderEvent =
    | { type: "orderPlaced"; orderPlaced: OrderPlaced }
    | { type: "billableOrderPlaced"; billableOrderPlaced: BillableOrderPlaced }
    | { type: "orderAcknowledgmentSent"; acknowledgmentSent :OrderAcknowledgmentSent };

  // 受注確定ワークフローの失敗出力
  type PlaceOrderError = "...";

  type PlaceOrderWorkflow = (
    placeOrderCommand: PlaceOrderCommand // 入力コマンド
  ) => AsyncResult<PlaceOrderEvent[], PlaceOrderError>; // 出力イベント

  /** 7.8.1
   * internal step
   */

  // ドメインをAPIモジュールから型を持ってくる
  import DomainApi from "./domain";

  // -----------------
  // 注文のライフサイクル
  // -----------------

  // 検証済みの状態
  type ValidatedOrderLine = "...";
  type ValidatedOrder = {
    orderId: OrderId;
    customerInfo: CustomerInfo;
    shippingAddress: Address;
    billingAddress: Address;
    orderLines: ValidatedOrderLine[];
  }
  & OrderId = undefined
  & CustomerId = undefined
  & Address = undefined;

  // 価格計算済みの状態
  type PricedOrderLine = "...";
  type PricedOrder = "...";

  // 全状態の結合
  type Order =
    | { type: "unvalidated"; unvalidatedOrder: UnvalidatedOrder }
    | { type: "validated"; validatedOrder: ValidatedOrder }
    | { type: "priced"; pricedOrder: PricedOrder };
    // etc

  // -----------------
  // 内部ステップの定義
  // -----------------

  // ---- 注文の検証 ----

  // 注文の検証が使用するサービス
  type CheckProductCodeExists = (productCode: ProductCode) => boolean;

  type AddressValidationError = "...";
  type CheckedAddress = "...";
  type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => AsyncResult<CheckedAddress, AddressValidationError>;

  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists // 依存関係
  ) => (
    checkAddressExists: CheckAddressExists // 依存関係
  ) => (
    unvalidatedOrder: UnvalidatedOrder // 入力
  ) => AsyncResult<ValidatedOrder, AddressValidationError[]> // 出力
  & ValidationError = "...";

  // ---- 注文の価格計算 ----

  // 注文の価格計算が使用するサービス
  type GetProductPrice = (productCode: ProductCode) => Price;

  type PricingError = "...";

  type PriceOrder = (
    getProductPrice: GetProductPrice // 依存関係
  ) => (
    validatedOrder: ValidatedOrder // 入力
  ) => Result<PricedOrder, PricingError>; // 出力

  // etc
}

namespace Chapter_8 {
  /** 8.2.1
   * treat a function as a thing
   */

  const plus3 = (x: number): number => x + 3;
  const times2 = (x: number): number => x * 2;
  const square = (x: number): number => x * x;
  const addThree = plus3;

  // listOfFunctions : (int -> int) list
  const listOfFunctions = [addThree, times2, square];

  // リストをループして各関数を順番に評価できる
  for (const f of listOfFunctions) {
    const result = f(100);
    console.log(`If 100 is the input, the output is ${result} result`);
  }

  /** 8.2.2
   * Function as input
   */

  const evalWith5ThenAdd2 = (fn: (x: number) => number) => fn(5) + 2;

  // 関数をパラメータとして渡せる
  const add1 = (x: number): number => x + 1;
  evalWith5ThenAdd2(add1); // return 8

  // squareの場合も同様に渡せる
  evalWith5ThenAdd2(square); // return 27

  /** 8.2.3
   * Function as output
   */

  const add2 = (x: number): number => x + 2;
  const add3 = (x: number): number => x + 3;

  // 似たような関数の重複を解消するため、加算する数が組み込まれた「加算」関数を返す関数を作る
  const adderGenerator = (numberToAdd: number): ((x: number) => number) => {
    return (x: number): number => numberToAdd + x;
  };

  // 結果は以下のようになる
  const ad1 = adderGenerator(1);
  ad1(2); // return 3

  const ad100 = adderGenerator(100);
  ad100(2); // return 102

  /** 8.2.4
   * conversion to curry
   */

  // 複数の引数を取る関数をカリー化する
  const add = (x: number, y: number): number => x + y;
  // 新しい関数を返すことで1パラメータの関数に変換できる
  const addGenerator = (x: number) => (y: number) => x + y;

  /** 8.2.5
   * partial application
   */

  const sayGreeting = (greeting: string, name: string): void =>
    console.log(`${greeting}, ${name}!`);

  // greetingパラメータを1つだけ渡すと、それが組み込まれた新しい関数をいくつも作ることができる
  const sayHello = (name: string): void => sayGreeting("Hello", name);
  const sayGoodbye = (name: string): void => sayGreeting("Goodbye", name);

  sayHello("John"); // return "Hello, John!"
  sayGoodbye("John"); // return "Goodbye, John!"

  /** 8.3
   * global function
   */

  const twelveDividedBy = (n: NonZeroInteger) => {
    switch (n.value) {
      case 6:
        return 2;
      case 5:
        return 2;
      case 4:
        return 3;
      case 3:
        return 4;
      case 2:
        return 6;
      case 1:
        return 12;
      case 0:
        throw new Error("Division by zero");
      default:
        console.log("Default case");
    }
  };

  // 関数へのすべての入力は有効な出力を持ち、例外がないようにしたい
  // そこで1つの手法として、入力を制限して不正な値を排除するというものがある(※元コードがF#なのでintegerという命名をしている)

  type NonZeroInteger = { type: "nonZeroInteger"; value: number };
  const createNonZeroInteger = (n: number): NonZeroInteger => {
    if (n === 0) {
      throw new Error("Zero is not allowed");
    }
    return { type: "nonZeroInteger", value: n };
  };

  // もう1つの手法としては、出力を拡張すること
  // 入力として0を受け付けるが、出力を「何かある」「何もない」のOption型に変更する

  /** 8.4.1
   * function synthesis
   */

  const add1ThenSquare = (x: number): number => square(add1(x));
  add1ThenSquare(5); // return 36

  const isEven = (x: number): boolean => x % 2 === 0;
  const printBool = (x: boolean): string => `value is ${x}`;
  const isEvenThenPrint = (x: number): string => printBool(isEven(x));

  /** 8.4.3
   * Challenges in synthesizing functions
   */

  class Some<T> {
    constructor(public value: T) {}
  }

  class None {
    // Noneは値を持たない
  }

  type Option<T> = Some<T> | None;

  const some = <T>(value: T): Option<T> => new Some(value);
  const none = (): Option<never> => new None();

  const printOption = (x: Option<number>) => {
    switch (true) {
      case x instanceof Some:
        console.log(`The int is ${x.value}`);
        break;
      case x instanceof None:
        console.log("No value");
        break;
    }
  };

  printOption(some(add1(5))); // return "The int is 6"
}

namespace Chapter_9 {
  /** 9.1
   * Dealing with simple types
   */

  namespace Domain {
    type OrderId = {
      readonly value: string;
    };

    // OrderId生成関数
    const create = (str: string): OrderId => {
      if (!str || str.length === 0) {
        throw new Error("OrderId must not be null or empty");
      } else if (str.length > 50) {
        throw new Error("OrderId must not be more than 50 chars");
      }
      return { value: str };
    };

    // OrderIdから値を取得する関数
    const value = (orderId: OrderId): string => {
      return orderId.value;
    };

    /** 9.2
     * deriving an implementation from the type of a function
     */

    const validateOrder = (checkProductCodeExists: CheckProductCodeExists) => (
      checkAddressExists: CheckAddressExists
    ) => (unvalidatedOrder: UnvalidatedOrder): Result<ValidatedOrder, ValidationError[]> => {
      // ...
    };

    type Param1 = any;
    type Param2 = any;
    type Param3 = any;
    type MyFunctionSignature = (param1: Param1) => (param2: Param2) => (param3: Param3) => Result;

    // このシグネチャを使って関数を実装する
    const myFunc: MyFunctionSignature = (param1) => (param2) => (param3) => {
      // ...
    }

    // この手法を使ってvalidateOrder関数を実装すると以下のようになる
    const validateOrder: ValidateOrder = (
      checkProductCodeExists: CheckProductCodeExists // 依存関係
    ) => (
      checkAddressExists: CheckAddressExists // 依存関係
    ) => (
      unvalidatedOrder: UnvalidatedOrder // 入力
    ) => {
      // ...
    }

    /** 9.3
     * Implementation of verification steps
     */

    // 前章では以下のように型定義をしていた
    type CheckAddressExists = (
      unvalidatedAddress: UnvalidatedAddress
    ) => AsyncResult<CheckedAddress, AddressValidationError>;

    type ValidateOrder = (
      checkProductCodeExists: CheckProductCodeExists // 依存関係
    ) => (
      checkAddressExists: CheckAddressExists // AsyncResultを返す依存関係
    ) => (
      unvalidatedOrder: UnvalidatedOrder // 入力
    ) => AsyncResult<ValidatedOrder, ValidationError[]>; // 出力

    // 本章ではエフェクトを排除するので、AsyncResultを削除する
    type CheckAddressExists = (unvalidatedAddress: UnvalidatedAddress) => CheckedAddress;

    type ValidateOrder = (
      checkProductCodeExists: CheckProductCodeExists
    ) => (
      checkAddressExists: CheckAddressExists
    ) => (
      unvalidatedOrder: UnvalidatedOrder
    ) => ValidatedOrder; 

    // 未検証の注文のOrderId<注文ID>文字列を使って、OrderIdドメイン型を作成
    // 未検証の注文のUnvalidatedCustomerInfo<未検証の顧客情報>フィールドを使って、CustomerInfo<顧客情報>ドメイン型を作成
    // 未検証の注文のShippingAddress<配送先住所>フィールド、つまりUnvalidatedAddress<未検証の住所>を使って、Address<住所>ドメイン型を作成
    // BillingAddress<請求先住所>と他のすべてのプロパティについても同様に行う
    // ValidatedOrderのすべての構成要素が利用位可能になったら、通常の方法でレコードを作成

    const validateOrder: ValidateOrder = (
      checkProductCodeExists: CheckProductCodeExists
    ) => (
      checkAddressExists: CheckAddressExists
    ) => (
      unvalidatedOrder: UnvalidatedOrder
    ): ValidatedOrder => {
      const orderId: OrderId = create(unvalidatedOrder.orderId);

      const customerInfo: CustomerInfo = toCustomerInfo(unvalidatedOrder.customerInfo); // ヘルパー関数(toCustomerInfo)

      const shippingAddress: ShippingAddress = toAddress(checkAddressExists)(unvalidatedOrder.shippingAddress); // ヘルパー関数(toAddress)

      // すべてのフィールドの準備ができたら、それらを使って新しい「検証済みの注文」レコードを作成し返す
      return {
        orderId,
        customerInfo,
        shippingAddress,
        // billingAddress,
        // Lines = ...
      }
    };

    // 注文の構成要素を変換する際にも上記実装とまったく同じアプローチを使用できる
    // toCustomerInfoの実装において、UnvalidatedCustomerInfoからCustomerInfoを構築している

    const toCustomerInfo = (customer: UnvalidatedCustomerInfo): CustomerInfo => {
      const firstName: FirstName = create(customer.firstName);
      const lastName: LastName = create(customer.lastName);
      const emailAddress: EmailAddress = create(customer.emailAddress);

      const name: PersonalName = {
        firstName,
        lastName,
      };

      const customerInfo: CustomerINfo = {
        name,
        emailAddress
      };

      return customerInfo;
    }

    /** 9.3.1
     * Creation of a prize-checked address
     */

    // toAddress関数はもう少し複雑で、CheckAddressExists<アドレスの存在チェック>サービスを使用して住所が存在するかどうかもチェックする必要がある

    const toAddress = (
      checkAddressExists: CheckAddressExists
    ) => (
      unvalidatedAddress: UnvalidatedAddress
    ): Address => {
      // リモートサービスを呼び出す
      const checkedAddress = checkAddressExists(unvalidatedAddress);

      // パターンマッチを使用して内部値を抽出する
      const { address: checkAddress } = checkedAddress;

      const addressLine1 = create(checkAddress.addressLine1);
      const addressLine2 = createOption(checkAddress.addressLine2); // 入力にnullまたは空を指定でき、その場合はNoneを返す
      const addressLine3 = createOption(checkAddress.addressLine3);
      const addressLine4 = createOption(checkAddress.addressLine4);
      const city = create(checkAddress.city);
      const zipCode = create(checkAddress.zipCode);

      const address: Address = {
        addressLine1,
        addressLine2?,
        addressLine3?,
        addressLine4?,
        city,
        zipCode,
      };

      return address;
    }

    /** 9.3.2
     * Creation of statement lines
     */

    // UnvalidatedOrderLine<未検証の注文明細行>をValidatedOrderLine<検証済みの注文明細行>に変換する関数を作成する
    const toValidatedOrderLine = (
      checkProductCodeExists: CheckProductCodeExists
    ) => (
      unvalidatedOrderLine: UnvalidatedOrderLine
    ): ValidatedOrderLine => {
      const orderLineId = create(unvalidatedOrderLine.orderLineId);
      const productCode = toProductCode(unvalidatedOrderLine.productCode); // ヘルパー関数(toProductCode)
      const quantity = toOrderQuantity(unvalidatedOrderLine.quantity); // ヘルパー関数(toOrderQuantity)

      const validatedOrderLine: ValidatedOrderLine = {
        orderLineId,
        productCode,
        quantity,
      };

      return validatedOrderLine;
    }

    // リストの各要素を変換する方法が手に入ったので、ValidatedOrderLinesのリストが得られる = ValidatedOrderに使用できる
    const validateOrder: ValidateOrder = (
      checkProductCodeExists: CheckProductCodeExists
    ) => (
      checkAddressExists: CheckAddressExists
    ) => (
      unvalidatedOrder: UnvalidatedOrder
    ): ValidatedOrder => {
      const orderId: OrderId = create(unvalidatedOrder.orderId);

      const customerInfo: CustomerInfo = toCustomerInfo(unvalidatedOrder.customerInfo); // ヘルパー関数(toCustomerInfo)

      const shippingAddress: ShippingAddress = toAddress(checkAddressExists)(unvalidatedOrder.shippingAddress); // ヘルパー関数(toAddress)

      // 追加
      const orderLines = unvalidatedOrder.orderLines.map(toValidatedOrderLine(checkProductCodeExists)); // ヘルパー関数(toValidatedOrderLine)

      return {
        orderId,
        customerInfo,
        shippingAddress,
        orderLines,
        // billingAddress,
      }
    };

    // toOrderQuantity、入力はUnvalidatedOrderLineから来る未検証の生の10進数、出力(OrderQuantity<注文数量>)はケースごとに異なる検証をされている選択型
    const toOrderQuantity = (productCode: ProductCode) => (quantity: number): OrderQuantity => {
      switch (productCode.type) {
        case "Widget":
          const unitQuantity = createUnitQuantity(quantity);
          return createOrderQuantity(unitQuantity);
        case "Gizmo":
          const kilogramQuantity = createKilogramQuantity(quantity);
          return createOrderQuantity(kilogramQuantity);
        default:
          throw new Error("Unknown product code");
      }
    }

    const toProductCode = (checkProductCodeExists: CheckProductCodeExists) => (productCode: string): boolean => {
      const createdProductCode = createProductCode(productCode);
      return checkProductCodeExists(createdProductCode); // booleanを返す :( が、本来はProductCodeを返したい
    }

    /** 9.3.3
     * Creating function adapters
     */

    // boolをproductCodeに変換する「アダプタ関数」を作成する
    const convertToPassthru = (checkProductCodeExists: CheckProductCodeExists) => (productCode: ProductCode) => {
      if (checkProductCodeExists(productCode)) {
        return productCode;
      } else {
        throw new Error("Invalid product code");
      }
    }

    // さらに抽象化するとこうなるらしい
    const predicateToPassthru = (errorMsg: string) => (f: CheckProductCodeExists) => (x: ProductCode) => {
      if (f(x)) {
        return x;
      } else {
        throw new Error(errorMsg);
      }
    }

    // このアダプタ関数を使用してtoProductCode関数を新しいバージョンに更新する
    const toProductCode = (
      checkProductCodeExists: CheckProductCodeExists
    ) => (
      productCode: ProductCode
    ) => {
      const checkProduct = (productCode: ProductCode): ProductCode | void => {
        const errorMsg = `Invalid: ${productCode}`;
        return predicateToPassthru(errorMsg)(checkProductCodeExists)(productCode);
      }
      const createdProductCode = createProductCode(productCode);
      return checkProduct(createdProductCode);
    }
  }

  /** 9.4
   * Implementation of remaining steps
   */

  // 価格計算ステップの元の設計
  type PriceOrder = (
    getProductPrice: GetProductPrice // 依存関係
  ) => (
    validatedOrder: ValidatedOrder // 入力
  ) => Result<PriceOrder, PlaceOrderError>; // 出力

  // 元の設計から一度エフェクトを取り除く
  type GetProductPrice = (productCode: ProductCode) => Price;
  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (
    validatedOrder: ValidatedOrder
  ) => PriceOrder;

  // 価格計算ステップの実装
  // 各明細行をPricedOrderLine<価格計算済みの注文明細行>に変換し、それらを使って新しいPricedOrder<価格計算済みの注文>を構築する
  const priceOrder: PriceOrder = (getProductPrice) => (validatedOrder) => {
    const lines = validatedOrder.lines.map(toPricedOrderLine(getProductPrice));
    const amountToBill = sumPrices(lines.map(line => line.linePrice));

    const pricedOrder: PricedOrder = {
      orderId: validatedOrder.orderId,
      custormerInfo: validatedOrder.customerInfo,
      shippingAddress: validatedOrder.shippingAddress,
      billingAddress: validatedOrder.billingAddress,
      lines,
      amountToBill,
    };

    return pricedOrder;
  }

  // パイプラインに多くのステップがあり、それらをまだ実装したくない(実装方法がわからない)ときは
  // 実装されていないメッセージを出して失敗させられる
  const priceOrder: PriceOrder = (getProductPrice) => (validatedOrder) => {
    throw new Error("Not implemented");
  }

  // 価格リストを合計して請求総額にする
  // 合計が範囲外の場合は例外を発生させる
  const sumPrices = (prices: Price[]) => {
    const total = prices.reduce((total, price) => total + price, 0);
    return create(total);
  }

  // 検証済みの注文明細行を価格計算済みの注文明細行に変換する
  const toPricedOrderLine = (
    getProductPrice: GetProductPrice
  ) => (
    line: ValidatedOrderLine
  ): PricedOrderLine => {
    const qty = orderQuantity.value(line.quantity);
    const price = getProductPrice(line.productCode);
    const linePrice = price.multiply(price, qty)

    return {
      orderLineId: line.orderLineId,
      productCode: line.productCode,
      quantity: line.quantity,
      linePrice,
    };
  }

  // Priceに数量を掛け合わせられるヘルパー関数
  const multiply = (p: Price, qty: number): Price => {
    return create(p * qty);
  }

  /** 9.4.1
   * Implementation of the confirmation step
   */

  // エフェクトを削除した確認ステップの設計
  type HtmlString = { type: "htmlString"; value: string };
  type CreateOrderAcknowledgmentLetter = (PriceOrder: PriceOrder) => HtmlString;
  type OrderAcknowledgment = {
    emailAddress: EmailAddress;
    letter: HtmlString;
  }
  type SendResult = Sent | NotSent;
  type SendOrderAcknowledgment = (orderAcknowledgment: OrderAcknowledgment) => SendResult;

  type AcknowledgeOrder = (
    createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter // 依存関係
  ) => (
    sendOrderAcknowledgment: SendOrderAcknowledgment // 依存関係
  ) => (
    pricedOrder: PricedOrder // 入力
  ) => OrderAcknowledgmentSent | undefined; // 出力

  // 確認ステップの実装
  const acknowledgeOrder: AcknowledgeOrder = (createAcknowledgmentLetter) => (sendOrderAcknowledgment) => (pricedOrder) => {
    const letter = createAcknowledgmentLetter(pricedOrder);
    const acknowledgment: OrderAcknowledgment = {
      emailAddress: pricedOrder.customerInfo.emailAddress,
      letter,
    };

    // 送信が成功した場合はOrderAcknowledgmentSentを返す
    // 失敗した場合はNoneを返す
    const sendResult = sendOrderAcknowledgment(acknowledgment);
    switch (sendResult) {
      case "Sent":
        const event: OrderAcknowledgmentSent = {
          orderId: pricedOrder.orderId,
          emailAddress: pricedOrder.customerInfo.emailAddress,
        };
        return { type: "Some", value: event };
      case "NotSent":
        return { type: "None" };
    }
  }

  /** 9.4.2
   * Create events
   */

  // 配送コンテキストに更新するイベント
  type OrderPlaced = PricedOrder;

  // 請求コンテキストに送信するイベント
  // 請求総額が０ではない場合にのみ作成される
  type BillableOrderPlaced = {
    orderid: OrderId;
    billingAddress: Address;
    amountToBill: BillingAmount;
  };

  type PlaceOrderEvent =
  | { type: "orderPlaced"; orderPlaced: OrderPlaced }
  | { type: "billableOrderPlaced"; billableOrderPlaced: BillableOrderPlaced }
  | { type: "orderAcknowledgmentSent"; orderAcknowledgmentSent: OrderAcknowledgmentSent };

  type CreateEvents = (
    pricedOrder: PricedOrder // 入力
  ) => (
    orderAcknowledgmentSent?: OrderAcknowledgmentSent // 入力(前のステップのイベント)
  ) =>  PlaceOrderEvent[]; // 出力

  const createBillingEvent = (pricedOrder: PricedOrder) => (billableOrderPlaced?: BillableOrderPlaced) => {
    const BillingAmount = billingAmount.value(pricedOrder.amountToBill);
    if (BillingAmount > 0) {
      const order = {
        orderId: pricedOrder.orderId,
        billingAddress: pricedOrder.billingAddress,
        amountToBill: pricedOrder.amountToBill,
      };
      return { type: "Some", value: order };
    }
    return { type: "None" };
  }

  const createEvents: CreateEvents = (pricedOrder) => (acknowledgmentEventOpt) => {
    const event1: PlaceOrderEvent = {
      type: "orderPlaced",
      orderPlaced: pricedOrder,
    };

    const event20pt = acknowledgmentEventOpt
    ? { type: "orderAcknowledgmentSent", orderAcknowledgmentSent: acknowledgmentEventOpt }
    : undefined;

    const event30pt = (() => {
      const billingEvent = createBillingEvent(pricedOrder)();
      if (billingEvent.type === "Some") {
        return { type: "billableOrderPlaced", billableOrderPlaced: billingEvent.value };
      }
      return undefined;
    })();
  }

  // オプション型をリスト型に変換するヘルパー関数
  const listOfOption = (opt: Option<PlaceOrderEvent>): PlaceOrderEvent[] => {
    switch (opt.type) {
      case "Some":
        return [opt.value];
      case "None":
        return [];
    }
  }

  // これで3つのイベント型はすべて同じになり、別のリストに入れて返せる
  const createEvents: CreateEvents = (pricedOrder) => (acknowledgmentEventOpt) => {
    const event: PlaceOrderEvent = {
      type: "orderPlaced",
      orderPlaced: pricedOrder,
    };
    const event1 = listOfOption(event);

    const event20pt = acknowledgmentEventOpt
    ? { type: "orderAcknowledgmentSent", orderAcknowledgmentSent: acknowledgmentEventOpt }
    : undefined;
    const event2 = listOfOption(event20pt);

    const event30pt = (() => {
      const billingEvent = createBillingEvent(pricedOrder)();
      if (billingEvent.type === "Some") {
        return { type: "billableOrderPlaced", billableOrderPlaced: billingEvent.value };
      }
      return undefined;
    })();
    const event3 = listOfOption(event30pt);

    return [
      ...event1,
      ...event2,
      ...event3
    ];
  }

  /** 9.5
   * Combine the steps of the pipeline into one
   */

  // 各ステップの実装を1本のパイプラインに組み合わせるため、コードは次のようにしたい
  const placeOrder: PlaceOrderWorkflow = (unvalidatedOrder: UnvalidatedOrder) => {
    return createEvents(
      acknowledgeOrder(
        priceOrder(
          validateOrder(unvalidatedOrder)
        )
      )
    );
  };

  // しかし、上記だとpriceOrderは入力が2つ必要なので、validateOrderの出力(1つ)には接続できない
  // この問題を解決するために、部分適用を使用する
  const validateOrderWithDependenciesBakedIn = validateOrder(checkProductCodeExists, checkAddressExists);

  // これでpriceOrderにvalidateOrderの出力を渡すことができる
  const placeOrder: PlaceOrderWorkflow = () => {
    const validateOrder = validateOrder(checkProductCodeExists, checkAddressExists);
    const priceOrder = priceOrder(getProductPrice);
    const acknowledgeOrder = acknowledgeOrder(createOrderAcknowledgmentLetter, sendOrderAcknowledgment);

    // ワークフロー関数を返す
    return (unvalidatedOrder: UnvalidatedOrder) => {
      return createEvents(
        acknowledgeOrder(
          priceOrder(
            validateOrder(unvalidatedOrder)
          )
        )
      );
    } 
  }

  // まだうまく合成できない関数がある。
  // acknowledgeOrderの出力は価格が確定した注文ではないため、createEventsの入力と一致しないので以下のようにする
  const placeOrder: PlaceOrderWorkflow = () => {
    return (unvalidatedOrder: UnvalidatedOrder) => {
      const validatedOrder = validateOrder(checkProductCodeExists, checkAddressExists)(unvalidatedOrder);
      const pricedOrder = priceOrder(getProductPrice)(validatedOrder);
      const acknowledgmentOption = acknowledgeOrder(createOrderAcknowledmentLetter, sendOrderAcknowledgment)(pricedOrder);
      const events = createEvents(priceOrder, acknowledgmentOption);

      return events;
    }
  }

  /** 9.6
   * Dependencies injection
   */

  // 依存関係の注入はすべての依存関係をトップレベルの関数に渡し、さらにその関数が内部に関数を渡すようにする
  const toValidatedOrderLine = (
    checkProductCodeExists: CheckProductCodeExists
  ) => (
    unvalidatedOrderLine: UnvalidatedOrderLine
  ): ValidatedOrderLine => {
    const orderLineId = create(unvalidatedOrderLine.orderLineId);
    const productCode = toProductCode(checkProductCodeExists)(unvalidatedOrderLine.productCode);
    // ...
  }

  // validateOrder関数は、toAddress、toValidatedOrderLineを両方使うので、依存関係を渡す
  const validateOrder: ValidateOrder = (checkProductCodeExists, checkAddressExists, unvalidatedOrder) => {
    const orderId: OrderId = create(unvalidatedOrder.orderId);

    const customerInfo: CustomerInfo = toCustomerInfo(unvalidatedOrder.customerInfo); // ヘルパー関数(toCustomerInfo)

    const shippingAddress: ShippingAddress = toAddress(checkAddressExists)(unvalidatedOrder.shippingAddress); // ヘルパー関数(toAddress)

    const orderLines = unvalidatedOrder.orderLines.map(toValidatedOrderLine(checkProductCodeExists)); // ヘルパー関数(toValidatedOrderLine)

    return {
      orderId,
      customerInfo,
      shippingAddress,
      orderLines,
      // billingAddress,
    }
  };

  // サービスをセットアップするには構成情報へのアクセスが必要になるため、placeOrderをコンポジションルートにするべきではない
  // それよりもplaceOrderワークフロー自体も、必要なサービスをパタメータとして受け取る方が良い
  const placeOrder = (
    checkProductCodeExists,
    checkAddressExists,
    getProductPrice,
    createOrderAcknowledgmentLetter,
    sendOrderAcknowledgment
  ): PlaceOrderWorkflow => {
    return (unvalidatedOrder: UnvalidatedOrder) => {
      // ...
    }
  }

  /** 9.6.1
   * Too many dependencies?
   */

  // 依存関係が爆発的に増える可能性もある
  // checkAddressExists関数はURIエンドポイントと認証情報を必要とするWebサービスと通信しているとする例
  const checkAddressExists = (
    endPoint: EndPoint,
    credentials: Credentials,
    unvalidatedAddress: UnvalidatedAddress
  ) => {
    // ...
  }

  // この場合、checkAddressExists関数を使用するtoAddress関数にもこれらの依存関係を渡す必要がある
  const toAddress = (
    checkAddressExists: CheckAddressExists,
    endPoint: EndPoint,
    credentials: Credentials,
    unvalidatedAddress: UnvalidatedAddress
  ) => {
    const checkAddress = checkAddressExists(endPoint, credentials, unvalidatedAddress);
    // ...
  }

  // そしてこれが最上位の関数まで続くことになる
  const validateOrder = (
    checkProductCodeExists,
    checkAddressExists,
    endPoint, // checkAddressExistsのみで必要
    credentials, // checkAddressExistsのみで必要
    unvalidatedOrder
  ) => {
    // ...
  }

  // これは望ましくない。中間関数はcheckAddressExists関数の依存関係をすべて知る必要はないはず。
  // もっと良い方法は、低レベルの関数をトップレベル関数の外側で設定し、すべての依存関係が組み込み済みの子関数を渡すこと
  const placeOrder: PlaceOrderWorkflow = () => {
    const endPoint = "http://example.com";
    const credentials = "secret";

    // 認証情報を組み込んだcheckAddressExists関数を作成
    const checkAddressExists = (endPoint, credentials) => {
      const checkAddressExists = (endPoint, credentials, unvalidatedAddress) => {
        // ...etc
      }
      return checkAddressExists;
    }

    // etc

    const validateOrder = validateOrder(checkProductCodeExists, checkAddressExists, unvalidatedOrder);

    // etc

    return (unvalidatedOrder: UnvalidatedOrder) => {
      // ステップからパイプラインを合成する
      // ...
    } 
  }
  // 組み立て済みのヘルパー関数を渡してパラメータを減らすアプローチは複雑さを隠すのに役立つ一般的なテクニック

  /** 9.7
   * Testing dependencies
   */

  describe("依存関係のテスト", () => {
    test("製品が存在する場合は、検証に成功する", () => {
      const checkAddressExists = jest.spyOn(
        checkAddressExists, "checkAddressExists"
      ).mockImplementationOnce(
        () => checkAddress // 成功
      );
      const checkProductCodeExists = jest.spyOn(
        checkProductCodeExists, "checkProductCodeExists"
      ).mockImplementationOnce(
        () => true // 成功
      );
      const unvalidatedOrder = "..."; // 入力の設定
  
      const result = validateOrder(checkProductCodeExists, checkAddressExists, unvalidatedOrder); // 実行
  
      expect(result).toBe("..."); // 検証
    });

    test("製品が存在しない場合は、検証に失敗する", () => {
      const checkAddressExists = jest.spyOn(
        checkAddressExists, "checkAddressExists"
      ).mockImplementationOnce(
        () => checkAddress // 成功
      );
      const checkProductCodeExists = jest.spyOn(
        checkProductCodeExists, "checkProductCodeExists"
      ).mockImplementationOnce(
        () => false // 失敗
      );
      const unvalidatedOrder = "..."; // 入力の設定
  
      const result = validateOrder(checkProductCodeExists, checkAddressExists, unvalidatedOrder); // 実行
  
      expect(result).toBe("..."); // 検証
    });
  });

}
