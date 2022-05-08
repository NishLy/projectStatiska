function medianFinder(interval) {
  let median;
  if (interval % 2 == 0) {
    median = (interval / 2 + (interval / 2 + 1)) / 2;
  } else {
    median = Math.floor(interval / 2);
  }
  return median;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Main Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  const result = tepiBawah + (d1 / (d1 + d2)) * interval;
  return result;
}

function meanKelompok(fiXiTotal, frequencyTotal) {
  return fiXiTotal / frequencyTotal;
}

function deviasiRataRataKelompok(arrFrequency, data, mean, frequencyTotal) {
  let fiXITotalAbs = 0;
  data.forEach((e, i) => {
    fiXITotalAbs += Math.abs(e.median - mean) * arrFrequency[i];
  });
  const result = fiXITotalAbs / frequencyTotal;
  return result;
}

function deviasiStandardKelompok(arrFrequency, data, mean, frequencyTotal) {
  let fiXITotal2 = 0;
  data.forEach((e, i) => {
    fiXITotal2 += (e.median - mean) ** 2 * arrFrequency[i];
  });
  const result = Math.sqrt(fiXITotal2 / frequencyTotal);
  return result;
}

function deviasiVariasiKelompok(arrFrequency, data, mean, frequencyTotal) {
  const standard = deviasiStandardKelompok(
    arrFrequency,
    data,
    mean,
    frequencyTotal
  );
  return standard ** 2;
}

export function mainThreadKelompok(arrKelompok, arrFrequency) {
  //find n freq
  let frequencyTotal = 0;
  arrFrequency.forEach((e, i) => (frequencyTotal += arrFrequency[i]));

  //declare variables for main loop
  let arrData = [];
  let fiXiTotal = 0;
  let countKumulativeUp = 0;
  let countKumulativeDn = frequencyTotal;

  //main loop
  arrKelompok.forEach((e, i) => {
    const split = e.split("-");
    const interval = parseInt(split[1]) - parseInt(split[0]) + 1;
    const median = medianFinder(interval) + parseInt(split[0]) - 1;

    //assign freq total and fixi total
    const fiXi = median * arrFrequency[i];
    fiXiTotal += fiXi;

    //tepiBawah dan tepiAtas
    const tepiBawah = parseInt(split[0]) - 0.5;
    const tepiAtas = parseInt(split[1]) + 0.5;

    //counting comulative
    countKumulativeUp += arrFrequency[i];
    countKumulativeDn =
      i === 0 ? frequencyTotal : (countKumulativeDn -= arrFrequency[i - 1]);

    //assign relative frequency
    const freqRel = (arrFrequency[i] / frequencyTotal) * 100;

    //assign comulative frequency
    const fkMin = countKumulativeUp;
    const fkMax = countKumulativeDn;

    //add each data to a object
    arrData.push({
      data: e,
      interval,
      tepiBawah,
      tepiAtas,
      median,
      frequency: arrFrequency[i],
      freqRel,
      fkMin,
      fkMax,
      fiXi,
    });
  });

  ////////////////////////////////// Non main loop thread ////////////////////////////////////

  //mean thread
  const mean = meanKelompok(fiXiTotal, frequencyTotal);

  //median Kelompok thread
  const medianClass = medianFinder(frequencyTotal);
  let medianIndex;
  let freqKumulative = 0;
  let fK;

  //find medianIndex and fK
  for (let index = 0; index < arrFrequency.length; index++) {
    freqKumulative += arrFrequency[index];
    if (medianClass <= freqKumulative) {
      fK = freqKumulative - arrFrequency[index];
      medianIndex = index;
      break;
    }
  }
  const median = medianKelompok(
    arrKelompok,
    arrFrequency,
    fK,
    medianIndex,
    frequencyTotal
  );

  //modus Kelompok thread
  const modusIndex = arrFrequency.indexOf(Math.max(...arrFrequency));
  const modus = modusKelompok(arrKelompok, arrFrequency, modusIndex);

  //deviasi rata rata
  const deviasiRataRata = deviasiRataRataKelompok(
    arrFrequency,
    arrData,
    mean,
    frequencyTotal
  );

  //devisai standard
  const deviasiStandard = deviasiStandardKelompok(
    arrFrequency,
    arrData,
    mean,
    frequencyTotal
  );

  //deviasi variasi
  const deviasiVariasi = deviasiVariasiKelompok(
    arrFrequency,
    arrData,
    mean,
    frequencyTotal
  );

  return {
    arrData,
    frequencyTotal,
    fiXiTotal,
    mean,
    median,
    modus,
    deviasiRataRata,
    deviasiStandard,
    deviasiVariasi,
  };
}
