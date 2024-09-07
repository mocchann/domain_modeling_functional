type WidgetCode = { type: "widgetCode"; widgetCode: string };
// 制約: 先頭が"W" + 数字4桁
type GizmoCode = { type: "gizmoCode"; gizmoCode: string };
// 制約: 先頭が"G" + 数字4桁
export type ProductCode = WidgetCode | GizmoCode;

export type UnvalidatedCustomerInfo = {
  firstName: FirstName;
  middleInitial?: MiddleInitial;
  lastName: LastName;
  emailAddress: EmailAddress;
};
export type UnvalidatedShippingAddress = undefined;
export type UnvalidatedBillingAddress = undefined;
export type UnvalidatedOrderLine = undefined;
export type UnvalidatedAmountToBill = undefined;

export type OrderId = {
  readonly value: string;
};
export type Address = undefined;
export type CustomerInfo = {
  name: PersonalName;
  emailAddress: EmailAddress;
};
export type ValidatedOrderLine = undefined;

export type Price = undefined;

export type FirstName = string;
export type MiddleInitial = string | undefined;
export type LastName = string;
export type PersonalName = {
  firstName: FirstName;
  middleInitial?: MiddleInitial;
  lastName: LastName;
};
export type EmailAddress = string;
