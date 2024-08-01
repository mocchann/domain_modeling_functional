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
}
