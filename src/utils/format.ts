export enum FormatTimePrecision {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  month = 'month',
  year = 'year',
}

const precisionTable = {
  [FormatTimePrecision.second]: 1,
  [FormatTimePrecision.minute]: 2,
  [FormatTimePrecision.hour]: 3,
  [FormatTimePrecision.day]: 4,
  [FormatTimePrecision.month]: 5,
  [FormatTimePrecision.year]: 6,
} satisfies Record<FormatTimePrecision, number>;

export interface FormatInstantOptions {
  precision?: FormatTimePrecision;
}

export const formatInstant = (date: Date, options?: FormatInstantOptions) => {
  const { precision = 'day' } = options ?? {};
  const nPrecision = precisionTable[precision];

  const part1 = [`${date.getFullYear()}`];

  if (nPrecision <= precisionTable[FormatTimePrecision.month]) {
    part1.push(`${date.getMonth() + 1}`)
  }
  if (nPrecision <= precisionTable[FormatTimePrecision.day]) {
    part1.push(`${date.getDay()}`)
  }

  const part2: string[] = []

  if (nPrecision <= precisionTable[FormatTimePrecision.hour]) {
    part1.push(`${date.getHours()}`)
  }
  if (nPrecision <= precisionTable[FormatTimePrecision.minute]) {
    part1.push(`${date.getMinutes()}`)
  }
  if (nPrecision <= precisionTable[FormatTimePrecision.second]) {
    part1.push(`${date.getSeconds()}`)
  }

  return part1.join('-') + (part2.length ? ` ${part2.join(':')}` : '')
};
