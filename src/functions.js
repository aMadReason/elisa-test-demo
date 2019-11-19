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
  if (output < 0.05) output = 0.05;
  if (output > 2) output = 2;
  return;
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

  console.log(washEfficiencies);
  const temp = washEfficiencies.map(i => 1 - i);
  console.log(temp);
  let val = temp.shift();
  temp.map(v => (val = val * v));
  console.log(val);
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
