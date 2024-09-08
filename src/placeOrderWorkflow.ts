/** 9.8
 * Assembled pipelines
 */

import {
  Address,
  BillingAddress,
  CustomerInfo,
  EmailAddress,
  FirstName,
  HtmlString,
  LastName,
  OrderId,
  OrderQuantity,
  PersonalName,
  Price,
  ProductCode,
  SendOrderAcknowledgment,
  ShippingAddress,
  UnvalidatedAddress,
  UnvalidatedAmountToBill,
  UnvalidatedBillingAddress,
  UnvalidatedCustomerInfo,
  UnvalidatedOrderLine,
  UnvalidatedShippingAddress,
  ValidatedOrderLine,
} from "./simpleTypes";

export const PlaceOrderWorkflow = () => {
  // ====================
  // パート1: 設計
  // ====================

  // ----- 注文の検証 -----

  type CheckProductCodeExists = (productCode: ProductCode) => boolean;
  type CheckedAddress = { type: "checkedAddress"; address: Address };
  type Result<T, E> =
    | { success: true; value: T }
    | { success: false; error: E };
  type AsyncResult<S, F> = Promise<Result<S, F>>;
  type AddressValidationError = {
    type: "addressValidationError";
    error: string;
  };
  type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => AsyncResult<CheckedAddress, AddressValidationError>;

  type UnvalidatedOrder = {
    orderId: string;
    customerInfo: UnvalidatedCustomerInfo;
    shippingAddress: UnvalidatedShippingAddress;
    billingAddress: UnvalidatedBillingAddress;
    orderLines: UnvalidatedOrderLine[];
    amountToBill: UnvalidatedAmountToBill;
  };

  type ValidatedOrder = {
    orderId: OrderId;
    customerInfo: CustomerInfo;
    shippingAddress: Address;
    billingAddress: Address;
    orderLines: ValidatedOrderLine[];
  };

  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists // 依存関係
  ) => (
    checkAddressExists: CheckAddressExists // 依存関係
  ) => (unvalidatedOrder: UnvalidatedOrder) => Promise<ValidatedOrder>; // 入力 => 出力

  // ----- 注文の価格決定 -----

  type GetProductPrice = (productCode: ProductCode) => Price;
  type CreateOrderAcknowledgmentLetter = (
    pricedOrder: PricedOrder
  ) => HtmlString;
  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (validatedOrder: ValidatedOrder) => PricedOrder;

  type PlaceOrderEvent =
    | { type: "orderPlaced"; orderPlaced: OrderPlaced }
    | { type: "billableOrderPlaced"; billableOrderPlaced: BillableOrderPlaced }
    | {
        type: "orderAcknowledgmentSent";
        acknowledgmentSent: OrderAcknowledgmentSent;
      };
  type Command<Data> = {
    data: Data;
    timestamp: Date;
    userId: string;
    // etc
  };
  type PlaceOrderCommand = Command<UnvalidatedOrder>;
  type PlaceOrderWorkflow = (
    placeOrderCommand: PlaceOrderCommand // 入力コマンド
  ) => AsyncResult<PlaceOrderEvent[], PlaceOrderError>; // 出力イベント

  type ValidatedCustomerInfo = CustomerInfo;
  type ValidatedShippingAddress = Address;
  type ValidatedBillingAddress = Address;
  type PricedOrderLine = {
    orderLineId: string;
    productCode: ProductCode;
    quantity: OrderQuantity;
    linePrice: Price;
  };
  type BillingAmount = Price;

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

  /// 受注確定ワークフローの成功出力
  type OrderPlaced = PricedOrder;
  type BillableOrderPlaced = {
    orderId: OrderId;
    billingAddress: Address;
    amountToBill: BillingAmount;
  };
  type OrderAcknowledgmentSent = {
    orderId: OrderId;
    emailAddress: EmailAddress;
  };

  type AcknowledgeOrder = (
    createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter // 依存関係
  ) => (
    sendOrderAcknowledgment: SendOrderAcknowledgment // 依存関係
  ) => (
    pricedOrder: PricedOrder // 入力
  ) => OrderAcknowledgmentSent | undefined; // 出力

  // 受注確定ワークフローの失敗出力
  type PlaceOrderError = undefined;

  type CreateEvents = (
    pricedOrder: PricedOrder // 入力
  ) => (
    orderAcknowledgmentSent?: OrderAcknowledgmentSent // 入力(前のステップのイベント)
  ) => PlaceOrderEvent[]; // 出力

  // ====================
  // パート2: 実装
  // ====================

  // ====================
  // 注文の検証: 実装
  // ====================

  const toCustomerInfo = (
    unvalidatedCustomerInfo: UnvalidatedCustomerInfo
  ): CustomerInfo => {
    const firstName: FirstName = unvalidatedCustomerInfo.firstName;
    const lastName: LastName = unvalidatedCustomerInfo.lastName;
    const emailAddress: EmailAddress = unvalidatedCustomerInfo.emailAddress;
    const name: PersonalName = {
      firstName,
      lastName,
    };

    const customerInfo: CustomerInfo = {
      name,
      emailAddress,
    };

    return customerInfo;
  };

  const toAddress =
    (checkAddressExists: CheckAddressExists) =>
    async (unvalidatedAddress: UnvalidatedAddress): Promise<Address> => {
      // リモートサービスを呼び出す
      const checkedAddress = await checkAddressExists(unvalidatedAddress);

      // パターンマッチを使用して内部値を抽出する
      if (checkedAddress.success) {
        const { address: checkAddress } = checkedAddress.value;

        const addressLine1 = checkAddress.addressLine1;
        const addressLine2 = checkAddress.addressLine2;
        const addressLine3 = checkAddress.addressLine3;
        const addressLine4 = checkAddress.addressLine4;
        const city = checkAddress.city;
        const zipCode = checkAddress.zipCode;

        const address: Address = {
          addressLine1,
          addressLine2,
          addressLine3,
          addressLine4,
          city,
          zipCode,
        };

        return address;
      } else {
        throw new Error(checkedAddress.error.error);
      }
    };

  const predicateToPassthru =
    (errorMsg: string) => (f: CheckProductCodeExists) => (x: ProductCode) => {
      if (f(x)) {
        return x;
      } else {
        throw new Error(errorMsg);
      }
    };

  const toProductCode =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (productCode: ProductCode) => {
      const checkProduct = (productCode: ProductCode): ProductCode => {
        const errorMsg = `Invalid: ${productCode}`;
        return predicateToPassthru(errorMsg)(checkProductCodeExists)(
          productCode
        );
      };
      return checkProduct(productCode);
    };

  const toOrderQuantity =
    (productCode: ProductCode) =>
    (quantity: OrderQuantity): OrderQuantity => {
      const createUnitQuantity = (unitQuantity: OrderQuantity): number => {
        if (unitQuantity.type === "unitQuantity") {
          return unitQuantity.unitQuantity;
        } else {
          throw new Error("Invalid unit quantity");
        }
      };

      const createKilogramQuantity = (kiloQuantity: OrderQuantity): number => {
        if (kiloQuantity.type === "kilogramQuantity") {
          return kiloQuantity.kilogramQuantity;
        } else {
          throw new Error("Invalid kilogram quantity");
        }
      };

      const createOrderQuantity = (
        quantity: number,
        type: string
      ): OrderQuantity => {
        return type === "widgetCode"
          ? { type: "unitQuantity", unitQuantity: quantity }
          : { type: "kilogramQuantity", kilogramQuantity: quantity };
      };

      switch (productCode.type) {
        case "widgetCode":
          const unitQuantity = createUnitQuantity(quantity);
          return createOrderQuantity(unitQuantity, "widgetCode");
        case "gizmoCode":
          const kilogramQuantity = createKilogramQuantity(quantity);
          return createOrderQuantity(kilogramQuantity, "gizmoCode");
        default:
          throw new Error("Unknown product code");
      }
    };

  const toValidatedOrderLine =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (unvalidatedOrderLine: UnvalidatedOrderLine): ValidatedOrderLine => {
      const orderLineId = unvalidatedOrderLine.orderLineId;
      const productCode = toProductCode(checkProductCodeExists)(
        unvalidatedOrderLine.productCode
      ); // ヘルパー関数(toProductCode)
      const quantity = toOrderQuantity(productCode)(
        unvalidatedOrderLine.quantity
      ); // ヘルパー関数(toOrderQuantity)

      const validatedOrderLine: ValidatedOrderLine = {
        orderLineId,
        productCode,
        quantity,
      };

      return validatedOrderLine;
    };

  /// 注文の検証ステップの実装

  const validateOrder: ValidateOrder =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (checkAddressExists: CheckAddressExists) =>
    async (unvalidatedOrder: UnvalidatedOrder) => {
      const create = (value: string): OrderId => ({ value });
      const orderId: OrderId = create(unvalidatedOrder.orderId);

      const customerInfo: CustomerInfo = toCustomerInfo(
        unvalidatedOrder.customerInfo
      );

      const shippingAddress: ShippingAddress = await toAddress(
        checkAddressExists
      )(unvalidatedOrder.shippingAddress);

      const billingAddress: BillingAddress = await toAddress(
        checkAddressExists
      )(unvalidatedOrder.billingAddress);

      const orderLines = unvalidatedOrder.orderLines.map(
        toValidatedOrderLine(checkProductCodeExists)
      );

      const validatedOrder: ValidatedOrder = {
        orderId,
        customerInfo,
        shippingAddress,
        billingAddress,
        orderLines,
      };

      return validatedOrder;
    };

  // Priceに数量を掛け合わせられるヘルパー関数
  const multiply = (p: Price, qty: OrderQuantity): Price => {
    return qty.type === "unitQuantity"
      ? p * qty.unitQuantity
      : p * qty.kilogramQuantity;
  };

  // 検証済みの注文明細行を価格計算済みの注文明細行に変換する
  const toPricedOrderLine =
    (getProductPrice: GetProductPrice) =>
    (line: ValidatedOrderLine): PricedOrderLine => {
      const qty = line.quantity;
      const price = getProductPrice(line.productCode);
      const linePrice = multiply(price, qty);

      return {
        orderLineId: line.orderLineId,
        productCode: line.productCode,
        quantity: line.quantity,
        linePrice,
      };
    };

  // 価格リストを合計して請求総額にする
  // 合計が範囲外の場合は例外を発生させる
  const sumPrices = (prices: Price[]) => {
    const total = prices.reduce((total, price) => total + price, 0);
    return total;
  };

  // 価格計算ステップの実装
  const priceOrder: PriceOrder = (getProductPrice) => (validatedOrder) => {
    const lines = validatedOrder.orderLines.map(
      toPricedOrderLine(getProductPrice)
    );
    const amountToBill = sumPrices(lines.map((line) => line.linePrice));

    const pricedOrder: PricedOrder = {
      orderId: validatedOrder.orderId,
      customerInfo: validatedOrder.customerInfo,
      shippingAddress: validatedOrder.shippingAddress,
      billingAddress: validatedOrder.billingAddress,
      orderLines: lines,
      amountToBill,
    };

    return pricedOrder;
  };

  // 確認ステップの実装
  const acknowledgeOrder: AcknowledgeOrder =
    (createAcknowledgmentLetter) =>
    (sendOrderAcknowledgment) =>
    (pricedOrder) => {
      const letter = createAcknowledgmentLetter(pricedOrder);
      const acknowledgment: OrderAcknowledgment = {
        emailAddress: pricedOrder.customerInfo.emailAddress,
        letter,
      };

      // 送信が成功した場合はOrderAcknowledgmentSentを返す
      // 失敗した場合はNoneを返す
      const sendResult = sendOrderAcknowledgment(acknowledgment);
      switch (sendResult.type) {
        case "Sent":
          const event: OrderAcknowledgmentSent = {
            orderId: pricedOrder.orderId,
            emailAddress: pricedOrder.customerInfo.emailAddress,
          };
          return event;
        case "NotSent":
          return undefined;
      }
    };

  type Some<T> = { type: "Some"; value: T };
  type None = { type: "None" };
  type Option<T> = Some<T> | None;
  // オプション型をリスト型に変換するヘルパー関数
  const listOfOption = (opt?: Option<PlaceOrderEvent>): PlaceOrderEvent[] => {
    switch (opt?.type) {
      case "Some":
        return [opt.value];
      case "None":
        return [];
      default:
        return [];
    }
  };

  const createBillingEvent =
    (pricedOrder: PricedOrder) => (): Option<BillableOrderPlaced> => {
      const BillingAmount = pricedOrder.amountToBill;
      if (BillingAmount > 0) {
        const order = {
          orderId: pricedOrder.orderId,
          billingAddress: pricedOrder.billingAddress,
          amountToBill: pricedOrder.amountToBill,
        };
        return { type: "Some", value: order };
      }
      return { type: "None" };
    };

  const createEvents: CreateEvents =
    (pricedOrder) => (acknowledgmentEventOpt) => {
      const event: PlaceOrderEvent = {
        type: "orderPlaced",
        orderPlaced: pricedOrder,
      };
      const event1 = listOfOption({ type: "Some", value: event });

      const event20pt = acknowledgmentEventOpt
        ? {
            type: "orderAcknowledgmentSent" as const,
            acknowledgmentSent: acknowledgmentEventOpt,
          }
        : undefined;

      const event2 = event20pt
        ? listOfOption({ type: "Some", value: event20pt })
        : [];

      const event30pt = (() => {
        const billingEvent = createBillingEvent(pricedOrder)();
        if (billingEvent.type === "Some") {
          return {
            type: "billableOrderPlaced" as const,
            billableOrderPlaced: billingEvent.value,
          };
        }
        return undefined;
      })();

      const event3 = event30pt
        ? listOfOption({ type: "Some", value: event30pt })
        : [];

      return [...event1, ...event2, ...event3];
    };

  // ====================
  // ワークフローの全体像
  // ====================

  const placeOrder =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (checkAddressExists: CheckAddressExists) =>
    (getProductPrice: GetProductPrice) =>
    (createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter) =>
    (sendOrderAcknowledgment: SendOrderAcknowledgment): PlaceOrderWorkflow => {
      return async (unvalidatedOrder: UnvalidatedOrder) => {
        const validatedOrder = await validateOrder(checkProductCodeExists)(
          checkAddressExists
        )(unvalidatedOrder);

        const pricedOrder = priceOrder(getProductPrice)(validatedOrder);

        const orderAcknowledgmentLetter =
          createOrderAcknowledgmentLetter(pricedOrder);

        await sendOrderAcknowledgment(orderAcknowledgmentLetter);

        const acknowledgmentOption = acknowledgeOrder(
          createOrderAcknowledgmentLetter
        )(sendOrderAcknowledgment)(pricedOrder);

        const events = createEvents(pricedOrder)(acknowledgmentOption);

        return events;
      };
    };
};
