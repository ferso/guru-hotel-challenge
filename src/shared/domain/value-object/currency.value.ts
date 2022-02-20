import { Currencies } from "../enums/currencies";

export class Currency {
  name: keyof typeof Currencies;

  private constructor(value: number, name: Currencies) {
    this.setName(name);
  }
  static of(value: number, name: Currencies): Currency {
    return new Currency(value, name);
  }

  getDefaultFractionDigits(): number {
    return 10;
  }

  equals(currency: Currency): boolean {
    return currency.name === this.name;
  }

  protected setName(value: Currencies): void {
    this.name = value;
  }
}
