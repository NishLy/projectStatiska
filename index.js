//declaring varibales !important
let arrData;
const swictDataType = document.querySelector("#typeData");

//declaring verb for draw moduls
let draw;

//////////////////////////////////Event Listeners function/////////////////////////////////////////
//wrapper element
const box = document.querySelector("#box");

//element template
const dataKelompokTemplate = `<input
            class="boxField data-kelompok"
            maxlength="10"
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
const dataTunggalTemplate = `<input type="text" class="boxField data-tunggal"  placeholder="Data, 11,12,13...">
             <input type="text" class="boxField data-desil"  placeholder="Desil, 11,12,13...10">`;

//drawing template
const drawTemplate = (template) => {
  const wrap = document.createElement("div");
  wrap.innerHTML = template;
  return wrap;
};

//create new form element for data kelompok
const plus = document.querySelector("#plus");
plus.addEventListener("click", () => {
  if (swictDataType.value === "kelompok")
    box.appendChild(drawTemplate(dataKelompokTemplate));
  else alert("Tipe Data Tunggal!");
});

//create element form for data Tunggal
swictDataType.addEventListener("change", function () {
  if (this.value === "kelompok") {
    box.innerHTML = "";
    box.appendChild(drawTemplate(dataKelompokTemplate));
  } else {
    box.innerHTML = "";
    box.appendChild(drawTemplate(dataTunggalTemplate));
  }
});

//submit, parsing data and data validation
const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  let error = false;
  if (swictDataType.value === "kelompok") {
    const Kelompok = document.querySelectorAll(".data-kelompok");
    const arrKelompok = [];
    Kelompok.forEach((e) => {
      if (e.value === "" || !e.value.includes("-") || !isNaN(e.value)) {
        alert("data kelompok salah");
        return (error = true);
      }
      arrKelompok.push(e.value.replace(/\s+/g, ""));
    });
    const frequency = document.querySelectorAll(".frequency");
    const arrFrequency = [];
    frequency.forEach((e) => {
      if (e.value === "" || isNaN(e.value)) {
        alert("data frequnsi salah");
        return (error = true);
      }
      arrFrequency.push(parseInt(e.value));
    });
    if (!error) main(arrKelompok, arrFrequency);
  } else {
    const tunggal = document.querySelector(".data-tunggal");
    const desil = document
      .querySelector(".data-desil")
      .value.replace(/\s+/g, "")
      .split(",");
    tunggal.value.replace(/\s+/g, "");

    const arrTunggal = tunggal.value.split(",");
    let arrData = [];
    arrTunggal.forEach((e) => {
      arrData.push(parseFloat(e));
    });

    let arrDesil = [];
    desil.forEach((e) => {
      arrDesil.push(parseFloat(e));
    });
    if (!error) main(arrData, undefined, arrDesil);
  }
});

//element for draw chart
const chartOption = document.querySelector("#chartOption");
chartOption.addEventListener("change", function (element) {
  draw.drawChart(arrData, this.value, chartType.value);
});
const chartType = document.querySelector("#chartType");
chartType.addEventListener("change", function (element) {
  draw.drawChart(arrData, chartOption.value, this.value);
});

//delete form element
function deleteElement(element) {
  element.parentElement.remove();
}

//////////////////////////////////main function/////////////////////////////////////////
//main function
async function main(arrData, arrFrequency, desilArr) {
  //only call drawing module when here
  draw = await import("./draw.js");

  //is Tunggal or Kelompok
  if (typeof arrFrequency === "undefined") {
    const { mainThreadTunggal } = await import("./statisTunggal.js");
    const result = mainThreadTunggal(arrData, desilArr);
    draw.draw(result);
  } else {
    if (
      arrFrequency.length === 0 &&
      arrData.length === 0 &&
      arrData.length === arrFrequency.length
    )
      return false; // validate arrs
    const { mainThreadKelompok } = await import("./statis.js");
    const result = mainThreadKelompok(arrData, arrFrequency);
    draw.draw(result);
  }
}
