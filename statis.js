function medianFinder(interval) {
  let median;
  if (interval % 2 == 0) {
    median = (interval / 2 + (interval / 2 + 1)) / 2;
  } else {
    median = Math.floor(interval / 2);
  }
  return median;
}

function medianKelompok(
  arrKelompok,
  arrFrequency,
  fK,
  medianIndex,
  frequencyTotal
) {
  const split = arrKelompok[medianIndex].split("-");
  const interval = parseInt(split[1]) - parseInt(split[0]) + 1;
  const tepiBawah = arrKelompok[medianIndex].split("-")[0] - 0.5;
  const result =
    tepiBawah +
    (((1 / 2) * frequencyTotal - fK) / arrFrequency[medianIndex]) * interval;
  return result;
}

function modusKelompok(arrKelompok, arrFrequency, modusIndex) {
  const split = arrKelompok[modusIndex].split("-");
  const interval = parseInt(split[1]) - parseInt(split[0]) + 1;
  const tepiBawah = arrKelompok[modusIndex].split("-")[0] - 0.5;
  const d1 = arrFrequency[modusIndex] - arrFrequency[modusIndex - 1];
  const d2 = arrFrequency[modusIndex] - arrFrequency[modusIndex + 1];
  console.log(modusIndex, d1, d2, tepiBawah, interval);
  const result = tepiBawah + (d1 / (d1 + d2)) * interval;
  return result;
}

export function mainThread(arrKelompok, arrFrequency) {
  //declare variables
  let dataKelompok = [];
  let fiXiTotal = 0;
  let frequencyTotal = 0;

  parser(arrFrequency);

  arrKelompok.forEach((e, i) => {
    const data = e.split("-");
    const interval = parseInt(data[1]) - parseInt(data[0]) + 1;
    const median = medianFinder(interval) + parseInt(data[0]) - 1;
    console.log(median);

    //assign freq total and fixi total
    const fiXi = median * arrFrequency[i];
    fiXiTotal += fiXi;
    frequencyTotal += arrFrequency[i];

    //add each data to object
    dataKelompok.push({
      data: e,
      interval,
      median,
      frequency: arrFrequency[i],
      fiXi,
    });
  });

  //mean thread
  const meanResult = fiXiTotal / frequencyTotal;

  //median Kelompok thread
  const medianClass = medianFinder(frequencyTotal);
  let medianIndex;
  let freqKumulative = 0;
  let fK;

  //find medianIndex and fK
  for (let index = 0; index < arrFrequency.length; index++) {
    freqKumulative += arrFrequency[index];
    console.log(freqKumulative);
    if (medianClass <= freqKumulative) {
      console.log("called", medianIndex);
      fK = freqKumulative - arrFrequency[index];
      medianIndex = index;
      break;
    }
  }
  const medianResult = medianKelompok(
    arrKelompok,
    arrFrequency,
    fK,
    medianIndex,
    frequencyTotal
  );

  //modus Kelompok thread
  const modusIndex = arrFrequency.indexOf(Math.max(...arrFrequency));
  const modusResult = modusKelompok(arrKelompok, arrFrequency, modusIndex);

  //deviasi rata rata
  let fiXITotalAbs = 0;
  dataKelompok.forEach((e, i) => {
    fiXITotalAbs += Math.abs(e.median - meanResult) * arrFrequency[i];
  });
  const deviasiRataRata = fiXITotalAbs / frequencyTotal;

  //devisai standard
  let fiXITotal2 = 0;
  dataKelompok.forEach((e, i) => {
    fiXITotal2 += (e.median - meanResult) ** 2 * arrFrequency[i];
  });
  const deviasiStandard = Math.sqrt(fiXITotal2 / frequencyTotal);

  //deviasi variasi
  const deviasiVariasi = fiXITotal2 / frequencyTotal;

  return {
    dataKelompok,
    frequencyTotal,
    fiXiTotal,
    meanResult,
    medianResult,
    modusResult,
    deviasiRataRata,
    deviasiStandard,
    deviasiVariasi,
  };
}
