export function calculateDilutionFactor(volume) {
  const vol = +volume; // make sure it's not a string
  return (100 + vol) / vol;
}

export function calculateDilutionSeries(
  value = 0,
  dilutionFactor = 1.0,
  efficiencyFactor = 1.0
) {
  const values = [+value];
  for (let i = 1; i < 12; i++) {
    let val = (values[i - 1] / +dilutionFactor) * efficiencyFactor;
    values.push(val);
  }
  return values;
}

export function getTimerMins(stamp) {
  return Math.round(+new Date(stamp) / 1000 / 60);
}

export const roundPrecision = (num, dec) => {
  if (typeof num !== "number" || typeof dec !== "number") return false;
  const numSign = num >= 0 ? 1 : -1;
  return (
    Math.round(num * Math.pow(10, dec) + numSign * 0.0001) / Math.pow(10, dec)
  ).toFixed(dec);
};

// timestamp in miliseconds
export function timeModifier(value, timestamp) {
  const timeModifier = 1 - 5 / (timestamp * 1000 * 60);
  const result = value * Math.max(timeModifier, 0.05);
  return result;
}

export function calclateWashEfficiency(timestamp) {
  const washEfficiency = 0.9 - 0.5 / (timestamp * 1000 * 60);
  return Math.max(washEfficiency, 0);
}

export function calclateWashResidue(washEfficiencies = []) {
  if (!Array.isArray(washEfficiencies) || washEfficiencies.length === 0) {
    return 1;
  }
  return calclateWashEfficiency.reduce(
    (acc, cur) => (acc = acc * (1 - cur)),
    0 // initial value
  );
}
