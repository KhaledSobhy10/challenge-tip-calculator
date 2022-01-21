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
  reset: function () {
    this.bill = 0.0;
    this.tip = undefined;
    this.peopleNum = 0.0;
  },
};

// false >> should show button with custom text else should show input [number]
let toggleWork = false;

//Show input when custom button clicked
const handleToggle = () => {
  const inputELement = toggleCustomTipElement.querySelector("input");
  const customRadioElement = toggleCustomTipElement.querySelector("span");

  if (!toggleWork) {
    for (const iterator of radioInputElements)
      if (iterator.checked) iterator.checked = false;

    inputELement.setAttribute("type", "number");
    inputELement.className = "custom-tip-input";
    customRadioElement.classList.replace("show", "hide");
  } else {
    inputELement.setAttribute("type", "radio");
    inputELement.className = "radio-input";
    customRadioElement.classList.replace("hide", "show");
  }

  toggleWork = !toggleWork;
};

//check if all inputs have data
const checkDataCompleted = () => {
  return (
    inputsData.bill > 0 &&
    inputsData.tip &&
    inputsData.tip >= 0 &&
    inputsData.peopleNum > 0
  );
};

//load data to results elements
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

//show error when number of people < 0
const showInvalidNumberMessage = () => {
  peopleNumElement.parentElement.classList.add("invalidNumber");
};

//hide error when number of people > 0
const hideInvalidNumberMessage = () => {
  peopleNumElement.parentElement.classList.remove("invalidNumber");
};

// Attach listeber to custom tip button
toggleCustomTipElement.addEventListener("click", (e) => {
  let input = toggleCustomTipElement.querySelector("input");
  if (e.target === input && input.type === "radio") {
    resetButton.disabled = false;
    handleToggle();
    input = toggleCustomTipElement.querySelector(".custom-tip-input");
    if (input) {
      input.addEventListener("input", (e) => {
        inputsData.tip = Number.parseFloat(e.target.value);
        loadResults();
      });
    }
  }
});

//Extract percent value from radio element
const getPercentFromRadio = (parentElement) =>
  parentElement
    .querySelector(".radio-new-shape")
    .dataset.tipPercent.replace("%", "");

// Attach listner to radios button if not toggle button (custom)
for (const iterator of radioInputElements) {
  if (iterator !== toggleCustomTipElement.querySelector("input")) {
    iterator.addEventListener("change", (e) => {
      if (toggleWork) handleToggle();
      inputsData.tip = Number.parseFloat(
        getPercentFromRadio(iterator.parentElement)
      );
      loadResults();
    });
  }
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

const resetTipsRadioButtons = () => {
  if (toggleWork) {
    toggleCustomTipElement.querySelector(".custom-tip-input").value = "";
    handleToggle();
  } else {
    for (const iterator of radioInputElements) {
      if (iterator.checked) iterator.checked = false;
    }
  }
};

const resetResultsElements = () => {
  tipAmoutResultElement.textContent = "$0.00";
  totalResultElement.textContent = "$0.00";
};

const resetInputsElement = () => {
  billElement.value = "";
  peopleNumElement.value = "";
};

resetButton.addEventListener("click", (e) => {
  resetButton.disabled = true;
  resetTipsRadioButtons();
  resetResultsElements();
  resetInputsElement();
  inputsData.reset();
});
