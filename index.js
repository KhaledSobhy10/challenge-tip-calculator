const billElement = document.getElementById("bill");
const peopleNumElement = document.getElementById("people-num");
const radioInputElements = document.querySelectorAll(".radio-input");
const toggleCustomTipElement = document.getElementById("toggle-custom-tip");
const tipAmoutResultElement = document.getElementById("tip-amout-result");
const totalResultElement = document.getElementById("total-result");
const resetButton = document.getElementById("reset");

let inputsData = {
  bill: 0.0,
  tip: undefined,
  peopleNum: 0.0,
};

let toggleWork = false;

const handleToggle = () => {
  if (!toggleWork) {
    for (const iterator of radioInputElements)
      if (iterator.checked) iterator.checked = false;
  }

  const hidded = toggleCustomTipElement.querySelector(".hide");
  const shown = toggleCustomTipElement.querySelector(".show");
  hidded.classList.replace("hide", "show");
  shown.classList.replace("show", "hide");
  toggleWork = !toggleWork;
};

const checkDataCompleted = () => {
  return (
    inputsData.bill > 0 &&
    inputsData.tip &&
    inputsData.tip >= 0 &&
    inputsData.peopleNum > 0
  );
};

const loadResults = () => {
  if (checkDataCompleted()) {
    const tipAmoutPerPerson = Number.parseFloat(
      (inputsData.bill * inputsData.tip) / 100 / inputsData.peopleNum
    );
    const totalPerPerson = Number.parseFloat(
      inputsData.bill / inputsData.peopleNum + tipAmoutPerPerson
    );

    tipAmoutResultElement.textContent = "$" + tipAmoutPerPerson.toFixed(2);

    totalResultElement.textContent = "$" + totalPerPerson.toFixed(2);
  }
};

const showInvalidNumberMessage = () => {
  peopleNumElement.parentElement.classList.add("invalidNumber");
};

const hideInvalidNumberMessage = () => {
  peopleNumElement.parentElement.classList.remove("invalidNumber");
};

// Attach listeber to custom tip button
toggleCustomTipElement.addEventListener("click", (e) => {
  resetButton.disabled = false;
  if (e.target === toggleCustomTipElement.getElementsByTagName("input")[0]) {
    customAsInput = toggleCustomTipElement.querySelector(".custom-tip-input");
    customAsInput.addEventListener("input", (e) => {
      inputsData.tip = Number.parseFloat(e.target.value);
      loadResults();
    });
    handleToggle();
  }
});

// Attach listner to radios button
for (const iterator of radioInputElements) {
  iterator.addEventListener("change", (e) => {
    if (toggleWork) {
      handleToggle();
    }
    const currentTipPercent = iterator.parentElement
      .querySelector(".radio-new-shape")
      .dataset.tipPercent.replace("%", "");

    inputsData.tip = Number.parseFloat(currentTipPercent);
    loadResults();
  });
}

billElement.addEventListener("input", (e) => {
  resetButton.disabled = false;
  inputsData.bill = Number.parseFloat(e.target.value);
  loadResults();
});

peopleNumElement.addEventListener("input", (e) => {
  resetButton.disabled = false;
  hideInvalidNumberMessage();
  inputsData.peopleNum = Number.parseFloat(e.target.value);
  if (inputsData.peopleNum > 0) loadResults();
  else showInvalidNumberMessage();
});

resetButton.addEventListener("click", (e) => {
  resetButton.disabled = true;
  inputsData = {};
  billElement.value = "";
  peopleNumElement.value = "";
  if (toggleWork) {
    toggleCustomTipElement.querySelector(".custom-tip-input").value = "";
    handleToggle();
  } else {
    for (const iterator of radioInputElements) {
      if (iterator.checked) iterator.checked = false;
    }
  }
  tipAmoutResultElement.textContent = "$0.00";
  totalResultElement.textContent = "$0.00";
});
