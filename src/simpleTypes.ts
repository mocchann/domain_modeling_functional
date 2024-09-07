type WidgetCode = { type: "widgetCode"; widgetCode: string };
// 制約: 先頭が"W" + 数字4桁
type GizmoCode = { type: "gizmoCode"; gizmoCode: string };
// 制約: 先頭が"G" + 数字4桁
export type ProductCode = WidgetCode | GizmoCode;
// 注文数量関連
type UnitOrderQuantity = { type: "unitQuantity"; unitQuantity: number };
type KilogramOrderQuantity = {
  type: "kilogramQuantity";
  kilogramQuantity: number;
};
export type OrderQuantity = UnitOrderQuantity | KilogramOrderQuantity;

export type UnvalidatedCustomerInfo = {
  firstName: FirstName;
  middleInitial?: MiddleInitial;
  lastName: LastName;
  emailAddress: EmailAddress;
};
export type UnvalidatedShippingAddress = UnvalidatedAddress;
export type UnvalidatedBillingAddress = UnvalidatedAddress;
export type UnvalidatedOrderLine = {
  orderLineId: string;
  productCode: ProductCode;
  quantity: OrderQuantity;
};
export type UnvalidatedAmountToBill = undefined;

export type OrderId = {
  readonly value: string;
};
export type UnvalidatedAddress = {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  city: string;
  zipCode: string;
};

export type Address = {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  city: string;
  zipCode: string;
};
export type ShippingAddress = Address;
export type BillingAddress = Address;
export type CustomerInfo = {
  name: PersonalName;
  emailAddress: EmailAddress;
};
export type ValidatedOrderLine = {
  orderLineId: string;
  productCode: ProductCode;
  quantity: OrderQuantity;
};

export type Price = undefined;

export type FirstName = string;
export type MiddleInitial = string;
export type LastName = string;
export type PersonalName = {
  firstName: FirstName;
  middleInitial?: MiddleInitial;
  lastName: LastName;
};
export type EmailAddress = string;
