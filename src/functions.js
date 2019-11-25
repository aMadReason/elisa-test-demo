export function calculateConcentrationFactor(
  volume,
  initialConcentration = 500 // microgramPerMil
) {
  return (initialConcentration * volume) / 10000; // gives final concentration micrograms per mil
}

export function calculateBoundAntibody(
  value,
  concentration,
  efficiency,
  binding
) {
  if (+value === 0) return 0;
  const value1 = concentration * efficiency * value;
  return value1 + concentration * binding;
}

export function washModifier(value, washResidue, binding) {
  let output = value + washResidue * binding * 100;
  //output = output + calculateVariance(output, 8);
  if (output < 0.05) output = 0.05;
  if (output > 2) output = 2;
  return output;
}

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

const randomDec = (low = 0, high = 1, toFixed = 1) => {
  let val = Math.random() * (high - low) + low; // this will get a number between low and high;
  return val.toFixed(toFixed);
};

export function calculateVariance(value, percent = 8, toFixed = 2) {
  const max = (value / 100) * percent;
  const variance = randomDec(-max, max, toFixed);
  return +variance;
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
  const timeModifier = 1 - 5 / timestampToMins(timestamp);
  const result = value * Math.max(timeModifier, 0.05);
  return result;
}

export function calclateWashEfficiency(timestamp) {
  const mins = timestampToMins(timestamp);
  const washEfficiency = 0.9 - 0.5 / mins;
  return Math.max(washEfficiency, 0);
}

export function calclateWashResidue(washEfficiencies = []) {
  if (!Array.isArray(washEfficiencies) || washEfficiencies.length === 0) {
    return 1;
  }
  const temp = washEfficiencies.map(i => 1 - i);
  let val = temp.shift();
  temp.map(v => (val = val * v));
  return val;
}

export function calclateWashResidueFromTimestamps(timestamps = []) {
  const washEffiencies = timestamps
    .filter(i => i)
    .map(t => calclateWashEfficiency(t));

  const residue = calclateWashResidue(washEffiencies);
  return residue;
}

export function timestampToMins(timestamp) {
  return Math.round(+new Date(timestamp) / 1000 / 60);
}
