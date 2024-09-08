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
  ) => (unvalidatedOrder: UnvalidatedOrder) => ValidatedOrder; // 入力 => 出力

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
  type OrderAcknowledgmentSent = undefined;

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
    const firstName: FirstName = create(unvalidatedCustomerInfo.firstName);
    const lastName: LastName = create(unvalidatedCustomerInfo.lastName);
    const emailAddress: EmailAddress = create(
      unvalidatedCustomerInfo.emailAddress
    );

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

        const addressLine1 = create(checkAddress.addressLine1);
        const addressLine2 = createOption(checkAddress.addressLine2); // 入力にnullまたは空を指定でき、その場合はNoneを返す
        const addressLine3 = createOption(checkAddress.addressLine3);
        const addressLine4 = createOption(checkAddress.addressLine4);
        const city = create(checkAddress.city);
        const zipCode = create(checkAddress.zipCode);

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
      const createdProductCode = createProductCode(productCode);
      return checkProduct(createdProductCode);
    };

  const toOrderQuantity =
    (productCode: ProductCode) =>
    (quantity: OrderQuantity): OrderQuantity => {
      switch (productCode.type) {
        case "widgetCode":
          const unitQuantity = createUnitQuantity(quantity);
          return createOrderQuantity(unitQuantity);
        case "gizmoCode":
          const kilogramQuantity = createKilogramQuantity(quantity);
          return createOrderQuantity(kilogramQuantity);
        default:
          throw new Error("Unknown product code");
      }
    };

  const toValidatedOrderLine =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (unvalidatedOrderLine: UnvalidatedOrderLine): ValidatedOrderLine => {
      const orderLineId = create(unvalidatedOrderLine.orderLineId);
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
  const multiply = (p: Price, qty: number): Price => {
    return create(p * qty);
  };

  // 検証済みの注文明細行を価格計算済みの注文明細行に変換する
  const toPricedOrderLine =
    (getProductPrice: GetProductPrice) =>
    (line: ValidatedOrderLine): PricedOrderLine => {
      const qty = value(line.quantity);
      const price = getProductPrice(line.productCode);
      const linePrice = multiply(price, qty);

      return {
        orderLineId: line.orderLineId,
        productCode: line.productCode,
        quantity: line.quantity,
        linePrice,
      };
    };

};
