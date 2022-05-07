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
          />
          <input
            class="boxField frequency"
            type="number"
            maxlength="3"
            required
          />
          <button class="boxField" onclick="deleteElement(this)">Del</button>`;
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
  const dataKelompok = [];
  let error = false;

  Kelompok.forEach((e) => {
    if (e.value === "" || !e.value.includes("-") || !isNaN(e.value)) {
      alert("data kelompok salah");
      return (error = true);
    }
    console.log(!e.value.includes("-"));
    dataKelompok.push(e.value.replace(/\s+/g, ""));
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

  if (!error) main(dataKelompok, dataFrequency, method);
});

//main function
async function main(arrKelompok, arrFrequency, method) {
  if (
    arrFrequency.length === 0 &&
    arrKelompok.length === 0 &&
    arrKelompok.length === arrFrequency.length
  )
    return false; // validate arrs

  const { mainThread } = await import("./statis.js");
  const result = mainThread(arrKelompok, arrFrequency);
  print(result);
}

//printing data
function print(data) {
  const dataKelompokWrap = document.querySelector("#eachKelompok");
  const finalResult = document.querySelector("#finalResult");
  let content = "";

  //print each class
  data.dataKelompok.forEach((e) => {
    let value = "";
    for (let property in e) {
      console.log(property);
      value += property + " : " + e[property] + "<br>";
    }
    console.log(e);
    content += `<div class="eachElementKelompok">${value}</div>`;
  });
  dataKelompokWrap.innerHTML = content;

  //print final result
  content = "";
  for (let object in data) {
    console.log(object);
    if (object === "dataKelompok") continue;
    content += `<h3>${object} : ${data[object].toFixed(2)}</h3>`;
  }

  finalResult.innerHTML = content;
  //table final result
}
