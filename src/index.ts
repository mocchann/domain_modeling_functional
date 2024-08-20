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
