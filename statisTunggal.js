function sort(arr) {
  return arr.sort((x, y) => x - y);
}

function meanFinder(arr) {
  let counter = 0;
  arr.forEach((e) => (counter += e));
  return counter / arr.length;
}

function medianFinder(arr) {
  let medianIndex;
  let median;
  if (arr.length % 2 == 0) {
    medianIndex = arr.length / 2;
    median = (arr[medianIndex] + arr[medianIndex - 1]) / 2;
  } else {
    medianIndex = Math.floor(arr.length / 2);
    median = arr[medianIndex];
  }

  return median;
}

function modusFinder(arr) {
  let counter = {};
  // find duplicate occurrences
  arr.forEach((e) => (counter[e] ? counter[e]++ : (counter[e] = 1)));
  let max = Math.max(...Object.values(counter));
  const modus = Object.entries(counter).filter(
    ([name, value]) => value === max
  )[0][0];
  return { modus: parseInt(modus), freqData: counter };
}

function rataRataUkur(arr) {}

function kuartilFinder(arr) {
  let q1;
  let q2;
  let q3;

  //find q2
  if (arr.length % 2 === 0) {
    q2 =
      (arr[Math.floor(arr.length / 2) - 1] + arr[Math.floor(arr.length / 2)]) /
      2;
  } else {
    q2 = arr[Math.floor(arr.length / 2)];
  }

  //find q1 and q2
  if (((arr.length - 1) / 2) % 2 === 0) {
    q1 =
      (arr[Math.floor(arr.length / 4) - 1] + arr[Math.floor(arr.length / 4)]) /
      2;
    q3 =
      (arr[Math.round((arr.length * 3) / 4) - 1] +
        arr[Math.round((arr.length * 3) / 4)]) /
      2;
  } else {
    q1 = arr[Math.floor(arr.length / 4)];
    q3 = arr[Math.floor((arr.length * 3) / 4)];
  }
  return [q1, q2, q3];
}

//find desil 1/10 * n + 1, return arr
function desilFinder(arr, desilArr) {
  let desilResults = [];
  desilArr.forEach((desil) =>
    desilResults.push(((desil / 10) * (arr.length + 1)).toFixed(4))
  );
  return desilResults;
}

export function mainThreadTunggal(arr, desilArr) {
  const sortedArr = sort(arr);
  const mean = meanFinder(arr);
  const median = medianFinder(sortedArr);
  const { modus, freqData } = modusFinder(sortedArr);
  const desilResults =
    typeof desilArr === "undefined" ? null : desilFinder(sortedArr, desilArr);
  const kuartil = kuartilFinder(sortedArr);

  //declare  uninitialized variables
  let arrData = [];
  let logTotal = 0;
  let sigxi = 0;
  let sigxiPow = 0;
  let sigxiMixrXfAbs = 0;

  for (const key in freqData) {
    //declare
    const logXi = (Math.log(parseFloat(key)) / Math.log(10)) * freqData[key];
    const xiMinMeanFreq = (key - mean) * freqData[key];
    const xiMinMeanFreqAbs = Math.abs((key - mean) * freqData[key]);
    const xiPow = key ** 2 * freqData[key];

    //assign section
    sigxi += key * freqData[key];
    logTotal += logXi;
    sigxiMixrXfAbs += xiMinMeanFreqAbs;
    sigxiPow += xiPow;
    arrData.push({
      data: key,
      frequency: freqData[key],
      logXi,
      xiPow,
      xiMinMeanFreq,
      xiMinMeanFreqAbs,
    });
  }

  const rataRataUkur = 10 ** (logTotal / arr.length);
  const simpanganRata = sigxiMixrXfAbs / arr.length;
  const simpanganVariasi =
    (10 * sigxiPow - sigxi ** 2) / (sortedArr.length * (sortedArr.length - 1));
  const simpanganBaku = Math.sqrt(simpanganVariasi);

  return {
    arrData, //arr
    mean,
    median,
    modus,
    rataRataUkur,
    kuartil, //object
    desilResults, //object
    simpanganRata,
    simpanganVariasi,
    simpanganBaku,
  };
}
