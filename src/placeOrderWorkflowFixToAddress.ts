import {
  fromPromise,
  ok,
  okAsync,
  Result,
  ResultAsync,
  safeTry,
} from "neverthrow";

/** 9.8
 * Assembled pipelines
 */

import {
  Address,
  CustomerInfo,
  EmailAddress,
  FirstName,
  HtmlString,
  LastName,
  OrderAcknowledgment,
  OrderId,
  OrderQuantity,
  PersonalName,
  Price,
  ProductCode,
  SendOrderAcknowledgment,
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

  type Uri = string;
  type ServiceInfo = {
    name: string;
    endpoint: Uri;
  };
  type Exception = string;
  type RemoteServerError = {
    service: ServiceInfo;
    exception: Exception;
  };
  type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => ResultAsync<CheckedAddress, Error>;

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

  type ValidationError = { type: "error"; error: string };
  type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists // 依存関係
  ) => (
    unvalidatedOrder: UnvalidatedOrder // 入力
  ) => ResultAsync<ValidatedOrder, ValidationError>; // 出力

  // ----- 注文の価格決定 -----

  type GetProductPrice = (productCode: ProductCode) => Price;
  type CreateOrderAcknowledgmentLetter = (
    pricedOrder: PricedOrder
  ) => HtmlString;

  type PricingError = { type: "error"; error: string };
  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (validatedOrder: ValidatedOrder) => Result<PricedOrder, PricingError>;

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
  ) => ResultAsync<PlaceOrderEvent[], PlaceOrderError>; // 出力イベント

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
  type PlaceOrderError =
    | { type: "validation"; error: ValidationError }
    | { type: "pricing"; error: PricingError }
    | { type: "remoteServiceError"; error: RemoteServerError }
    | { type: "createEventsError"; error: CreateEventsError };

  type CreateEventsError = { type: "error"; error: string };

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

  const toAddress = (
    checkedAddress: CheckedAddress
  ): ResultAsync<Address, ValidationError> => {
    const result: Address = {
      addressLine1: checkedAddress.address.addressLine1,
      addressLine2: checkedAddress.address.addressLine2,
      addressLine3: checkedAddress.address.addressLine3,
      addressLine4: checkedAddress.address.addressLine4,
      city: checkedAddress.address.city,
      zipCode: checkedAddress.address.zipCode,
    };

    return okAsync(result);
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
    (unvalidatedOrder: UnvalidatedOrder) => {
      return safeTry(async function* () {
        const create = (value: string): OrderId => ({ value });
        const orderId: OrderId = create(unvalidatedOrder.orderId);

        const customerInfo: CustomerInfo = toCustomerInfo(
          unvalidatedOrder.customerInfo
        );

        const checkedShippingAddress = yield* toCheckedAddress(
          checkAddressExistsR
        )(unvalidatedOrder.shippingAddress).safeUnwrap();

        // ResultAsync<T, E>のTだけを得たいため、yield* safeUnwrap()を使って取得する
        const shippingAddress = yield* toAddress(
          checkedShippingAddress
        ).safeUnwrap();

        const checkedBillingAddress = yield* toCheckedAddress(
          checkAddressExistsR
        )(unvalidatedOrder.billingAddress).safeUnwrap();

        // ResultAsync<T, E>のTだけを得たいため、yield* safeUnwrap()を使って取得する
        const billingAddress = yield* toAddress(
          checkedBillingAddress
        ).safeUnwrap();

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

        return ok(validatedOrder);
      });
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

    return ok(pricedOrder);
  };

  // 確認ステップの実装
  const acknowledgeOrder: AcknowledgeOrder =
    (createAcknowledgmentLetter) =>
    (sendOrderAcknowledgment) =>
    (pricedOrder): OrderAcknowledgmentSent | undefined => {
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
    (pricedOrder) =>
    (acknowledgmentEventOpt?): PlaceOrderEvent[] => {
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

  const serviceExceptionAdapter = <T, E, X>(
    serviceInfo: ServiceInfo,
    fService: (x: X) => ResultAsync<T, E>
  ): ((x: X) => ResultAsync<T, RemoteServerError>) => {
    return (x: X) => {
      const result = fService(x);
      const mappedResult = result.mapErr((error) => {
        const remoteServerError: RemoteServerError = {
          service: serviceInfo,
          exception: `${error}`,
        };
        return remoteServerError;
      });
      return mappedResult;
    };
  };

  // bind: Result<T>と(T) => Result<U>を使って、Result<U>を手にいれる

  const checkAddressExists: CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
  ) => {
    // Result<Response>
    const r1 = fromPromise(
      fetch("https://example.com/address-service/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unvalidatedAddress),
      }),
      () => Error("Address Validation Error")
    );

    // Result<Response> to Result<Address>
    const r2 = r1.andThen((r1) => {
      const r2 = fromPromise(r1.json() as Promise<Address>, () =>
        Error("FooError")
      );

      return r2;
    });

    // Result<Address> to Result<CheckedAddress>
    const r3 = r2.map((address) => {
      const x: CheckedAddress = {
        type: "checkedAddress",
        address,
      };

      return x;
    });

    return r3;
  };

  const checkAddressExistsR = (
    unvalidatedAddress: UnvalidatedAddress
  ): ResultAsync<CheckedAddress, RemoteServerError> => {
    const serviceInfo: ServiceInfo = {
      name: "AddressService",
      endpoint: "https://example.com/address-service/",
    };

    const adaptedService = serviceExceptionAdapter(
      serviceInfo,
      checkAddressExists
    );

    return adaptedService(unvalidatedAddress);
  };

  const toCheckedAddress =
    (
      checkAddressExistsR: (
        unvalidatedAddress: UnvalidatedAddress
      ) => ResultAsync<CheckedAddress, RemoteServerError>
    ) =>
    (unvalidatedAddress: UnvalidatedAddress) => {
      const result = checkAddressExistsR(unvalidatedAddress);
      return result.mapErr((error) => {
        const validationError: ValidationError = {
          type: "error",
          error: `${error}`,
        };
        return validationError;
      });
    };

  // ====================
  // ワークフローの全体像
  // ====================

  const placeOrder =
    (checkProductCodeExists: CheckProductCodeExists) =>
    (getProductPrice: GetProductPrice) =>
    (createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter) =>
    (sendOrderAcknowledgment: SendOrderAcknowledgment): PlaceOrderWorkflow => {
      return (placeOrderCommand: PlaceOrderCommand) => {
        // DI
        const fValidateOrder = validateOrder(checkProductCodeExists);
        const fPricedOrder = priceOrder(getProductPrice);
        const fAcknowledgmentOption = acknowledgeOrder(
          createOrderAcknowledgmentLetter
        )(sendOrderAcknowledgment);
        const fCreateEvents = createEvents;

        const validateOrderAdapted = (unvalidatedOrder: UnvalidatedOrder) => {
          // 引数を受け取って、実行結果のErrorを別のエラーに変換した関数を得たい
          const fResult = fValidateOrder(unvalidatedOrder);
          const result = fResult.mapErr((error) => {
            const placeOrderError: PlaceOrderError = {
              type: "validation",
              error: error,
            };

            return placeOrderError;
          });

          return result;
        };
        const priceOrderAdapted = (
          aValidatedOrder: ValidatedOrder
        ): Result<PricedOrder, PlaceOrderError> => {
          const result = fPricedOrder(aValidatedOrder).mapErr((error) => {
            const placeOrderError: PlaceOrderError = {
              type: "pricing",
              error: error,
            };

            return placeOrderError;
          });

          return result;
        };

        // exec
        const aValidatedOrder = validateOrderAdapted(placeOrderCommand.data);
        const aPricedOrder = aValidatedOrder.andThen(priceOrderAdapted);
        const acknowledgedOption = aPricedOrder.map(fAcknowledgmentOption);
        return safeTry(async function* () {
          const aPricedOrderResult = yield* (await aPricedOrder).safeUnwrap();
          const acknowledgedOptionResult = yield* (
            await acknowledgedOption
          ).safeUnwrap();

          return ok(
            fCreateEvents(aPricedOrderResult)(acknowledgedOptionResult)
          );
        });
      };
    };

  /** 10.4
   * Using bind and map in the pipeline
   */

  // Result<Foo, Error> to Result<Foo, ValidationError>
  // const mapError = <T, E, F>(
  //   f: (error: E) => F,
  //   aResult: Result<T, E>
  // ): Result<T, F> => {
  //   switch (aResult.type) {
  //     case "ok":
  //       return { type: "ok", value: aResult.value };
  //     case "error":
  //       return { type: "error", error: f(aResult.error) };
  //   }
  // };

  // const bind = <T, E1, E2, U>(
  //   result: Result<T, E1>,
  //   f: (value: T) => Result<U, E2>
  // ): Result<U, E1 | E2> => {
  //   switch (result.type) {
  //     case "ok":
  //       return f(result.value);
  //     case "error":
  //       return result;
  //   }
  // };

  // const map = <T, E, U>(
  //   result: Result<T, E>,
  //   f: (value: T) => U
  // ): Result<U, E> => {
  //   switch (result.type) {
  //     case "ok":
  //       return { type: "ok", value: f(result.value) };
  //     case "error":
  //       return result;
  //   }
  // };
};
