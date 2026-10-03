export type Currency = string & { readonly __currency: unique symbol };

export function currencyCode(value: string): Currency {
  if (!/^[A-Z]{3}$/.test(value)) {
    throw new TypeError('Currency must be a three-letter uppercase code');
  }

  return value as Currency;
}

export class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: Currency,
  ) {}

  static fromMinorUnits(minorUnits: bigint, currency: Currency): Money {
    return new Money(minorUnits, currency);
  }

  plus(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minorUnits + other.minorUnits, this.currency);
  }

  minus(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minorUnits - other.minorUnits, this.currency);
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.minorUnits === other.minorUnits;
  }

  toJSON(): { minorUnits: string; currency: string } {
    return { minorUnits: this.minorUnits.toString(), currency: this.currency };
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new TypeError(`Cannot combine ${this.currency} and ${other.currency}`);
    }
  }
}
