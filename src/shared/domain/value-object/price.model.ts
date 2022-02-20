import { Currencies } from "../enums/currencies";
import { Currency } from "./currency.value";
export interface PriceProps {
  currency: Currency;
  amount: number;
  tax: number;
}
export class Price {
  currency: Currency;
  amount: number;
  tax: number;

  constructor(props: PriceProps) {
    this.setCurrency(props.currency);
    this.setAmount(props.amount);
    this.setTax(props.tax);
  }

  setTax(tax: number) {
    this.tax = tax;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  getFractionedAmount(): number {
    const fractionedAmount = Math.round(
      this.amount * this.currency.getDefaultFractionDigits()
    );
    return parseFloat(
      fractionedAmount.toFixed(this.currency.getDefaultFractionDigits())
    );
  }

  private setCurrency(currency: Currency): void {
    this.currency = currency;
  }

  equals(money: Price): boolean {
    return money.amount === this.amount && money.currency.equals(this.currency);
  }
}
