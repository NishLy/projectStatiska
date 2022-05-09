//////////////////////////////////draw functions/////////////////////////////////////////
//draw data
export function draw(data) {
  const finalResult = document.querySelector("#finalResult");
  let content = "";
  arrData = data.arrData;
  drawTable(data);

  //draw separated final result
  content = "";
  for (let object in data) {
    if (object === "arrData") continue;
    content += `<h3>${object} : ${
      typeof data[object] === "object" ? data[object] : data[object].toFixed(4)
    }</h3> </h3>`;
  }
  finalResult.innerHTML = content;

  //draw chart
  drawChart(data.arrData, "Frequency", "Garis");
}

function drawTable(data) {
  const dataKelompokWrap = document.querySelector("#tableContent");
  let content = "";
  let counter = 0;

  for (let i = 0; i < data.arrData.length; i++) {
    let trWrapper = "";
    let tdWrapper = "";
    counter++;
    const object = data.arrData[i];
    if (counter > 1) {
      for (let property in object) {
        tdWrapper += `<td>${
          typeof object[property] === "number"
            ? object[property].toFixed(4)
            : object[property]
        }</td>`;
      }
    } else {
      for (let property in object) {
        tdWrapper += `<td>${property}</td>`;
      }
      i--;
    }
    trWrapper += `<tr>${tdWrapper}</tr>`;
    content += trWrapper;
  }

  dataKelompokWrap.innerHTML = content;
}

export function drawChart(arrData, chartOption, chartType) {
  let xArr = [];
  let yArr = [];
  let yTitle = "";

  //chart type
  if (chartOption === "Ogive Plus") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.fkMin);
    });
    yTitle = "Frequensi Kumulatif Kurang dari";
  } else if (chartOption === "Ogive Minus") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.fkMax);
    });
    yTitle = "Frequensi Kumulatif Lebih dari";
  } else if (chartOption === "Frequency Relative") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.freqRel);
    });
    yTitle = "Frequensi Relative in %";
  } else if (chartOption === "Frequency") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.frequency);
    });
    yTitle = "Frequensi";
  }

  // Define Data
  const data = [{ x: xArr, y: yArr, type: chartType }];

  // Define Layout
  const layout = {
    xaxis: { title: "Data" },
    yaxis: { title: yTitle },
    title: chartOption,
  };

  // Display using Plotly
  Plotly.newPlot("chartResult", data, layout);
}
