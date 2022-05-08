//////////////////////////////////Event Listeners function/////////////////////////////////////////

//create new form element
const plus = document.querySelector("#plus");
const box = document.querySelector("#box");
plus.addEventListener("click", () => {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<input
            class="boxField data-kelompok"
            maxlength="7"
            type="text"
            required
              placeholder="Data Kelompok, eg. '11-20'"
          />
          <input
            class="boxField frequency"
            type="number"
            maxlength="3"
            required
            placeholder="Frequency"
          />
          <button class="boxField" onclick="deleteElement(this)">Delete</button>`;
  box.appendChild(wrap);
});

//delete form element
function deleteElement(element) {
  element.parentElement.remove();
}

//submit and data validation
const submit = document.querySelector("#submit");
submit.addEventListener("click", (method) => {
  const Kelompok = document.querySelectorAll(".data-kelompok");
  const arrData = [];
  let error = false;

  Kelompok.forEach((e) => {
    if (e.value === "" || !e.value.includes("-") || !isNaN(e.value)) {
      alert("data kelompok salah");
      return (error = true);
    }
    arrData.push(e.value.replace(/\s+/g, ""));
  });

  const frequency = document.querySelectorAll(".frequency");
  const dataFrequency = [];
  frequency.forEach((e) => {
    if (e.value === "" || isNaN(e.value)) {
      alert("data frequnsi salah");
      return (error = true);
    }
    dataFrequency.push(parseInt(e.value));
  });

  if (!error) main(arrData, dataFrequency, method);
});

const chartOption = document.querySelector("#chartOption");
chartOption.addEventListener("change", function (element) {
  printChart(arrData, this.value, chartType.value);
});
const chartType = document.querySelector("#chartType");
chartType.addEventListener("change", function (element) {
  printChart(arrData, chartOption.value, this.value);
});

////////////////////////////////// Main Functions //////////////////////////////////////////

//main function
async function main(arrKelompok, arrFrequency, method) {
  if (
    arrFrequency.length === 0 &&
    arrKelompok.length === 0 &&
    arrKelompok.length === arrFrequency.length
  )
    return false; // validate arrs

  const { mainThreadKelompok } = await import("./statis.js");
  const result = mainThreadKelompok(arrKelompok, arrFrequency);
  print(result);
}

let arrData;

//printing data
function print(data) {
  const dataKelompokWrap = document.querySelector("#eachKelompok");
  const finalResult = document.querySelector("#finalResult");
  let content = "";

  //print each class
  data.arrData.forEach((e) => {
    let value = "";
    for (let property in e) {
      value += property + " : " + e[property] + "<br>";
    }
    content += `<div class="eachElementKelompok">${value}</div>`;
  });
  dataKelompokWrap.innerHTML = content;

  //print final result
  content = "";
  for (let object in data) {
    if (object === "arrData") continue;
    content += `<h3>${object} : ${data[object].toFixed(2)}</h3>`;
  }

  finalResult.innerHTML = content;

  //char section
  arrData = data.arrData;
  printChart(data.arrData, "Ogive Plus", "Garis");
}

function printChart(arrData, chartOption, chartType) {
  let xArr = [];
  let yArr = [];

  let yTitle = "";

  if (chartOption === "Ogive Plus") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.fkMin);
    });
    yTitle = "frequensi Kumulatif Kurang dari";
  } else if (chartOption === "Ogive Minus") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.fkMax);
    });
    yTitle = "frequensi Kumulatif Lebih dari";
  } else if (chartOption === "Ogive Relative") {
    arrData.forEach((element) => {
      xArr.push(element.data);
      yArr.push(element.freqRel);
    });
    yTitle = "frequensi Relative in %";
  }

  if (chartType === "Garis") chartType = "lines";
  else if (chartType === "Batang") chartType = "bar";

  // Define D
  const data = [
    {
      x: xArr,
      y: yArr,
      type: chartType,
    },
  ];

  // Define Layout
  const layout = {
    xaxis: { title: "Data Kelompok" },
    yaxis: { title: yTitle },
    title: chartOption,
  };

  // Display using Plotly
  Plotly.newPlot("chartResult", data, layout);
}
