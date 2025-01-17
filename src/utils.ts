export const round = (value: number, decimalPlaces: number) => {
  const ROUNDING_CONST = Math.pow(10, decimalPlaces);
  return Math.round(value * ROUNDING_CONST) / ROUNDING_CONST;
};
