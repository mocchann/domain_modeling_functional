/** 9.8
 * Assembled pipelines
 */

import {
  Address,
  CustomerInfo,
  EmailAddress,
  FirstName,
  LastName,
  OrderId,
  PersonalName,
  Price,
  ProductCode,
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
  type CheckedAddress = { type: "checkedAddress"; unvalidatedAddress: string };
  type CheckAddressExists = (unvalidatedAddress: string) => CheckedAddress;

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
  type PriceOrder = (
    getProductPrice: GetProductPrice
  ) => (validatedOrder: ValidatedOrder) => PriceOrder;

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
};
