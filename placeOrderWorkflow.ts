/** 9.8
 * Assembled pipelines
 */

import {
  Address,
  CustomerInfo,
  OrderId,
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
};
