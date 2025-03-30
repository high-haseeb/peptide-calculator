const DefaultDoseValues = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15]; // in mg
const DefaultStrengthValues = [1, 5, 10, 15, 20, 30, 50];                 // in mg
const DefaultWaterAmounts = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];               // in mL

let doseValue = DefaultDoseValues[0];
let peptideStrength = DefaultStrengthValues[0];
let waterAmount = DefaultWaterAmounts[0];
let error: string = "";

const setError = (errorMessage: string) => {
    const errorContainer = document.getElementById("error");
    if (!errorContainer) {
        throw new Error("Can not find erorr message container");
    }
    errorContainer.style.display = "block";
    errorContainer.innerText = errorMessage;
}

const clearError = () => {
    const errorContainer = document.getElementById("error");
    if (!errorContainer) {
        throw new Error("Can not find erorr message container");
    }
    errorContainer.style.display = "none";
    errorContainer.innerText = "";
}

CalculateResult();

function handleClick(button: HTMLButtonElement, containerId: string, callback: (value: number) => void) {
    const elements = document.querySelectorAll(`.${containerId}-input-buttons`);
    elements.forEach(el => el.classList.remove("selected"));
    button.classList.add("selected");

    // Hide the custom input field if it exists
    const customInput = document.querySelector(`#${containerId} .custom-input`) as HTMLInputElement;
    if (customInput) customInput.style.display = "none";

    callback(Number(button.value));
    CalculateResult();
}

function setupInput(container: HTMLDivElement, values: number[], callback: (value: number) => void, defaultValue: number) {
    values.map((value) => {
        const element = document.createElement("button");
        element.classList.add(`${container.id}-input-buttons`);
        element.innerText = `${value}${container.id === "water" ? "mL" : "mg"}`;
        element.value = value.toString();
        if (value === defaultValue) element.classList.add("selected");
        element.addEventListener('click', () => handleClick(element, container.id, callback));
        container.appendChild(element);
    });

    // Add Custom Button
    const customButton = document.createElement("button");
    customButton.classList.add(`${container.id}-input-buttons`);
    customButton.innerText = "Custom";
    container.appendChild(customButton);

    // Add Custom Input
    const customInput = document.createElement("input");
    customInput.type = "number";
    customInput.placeholder = `Enter ${container.id} value`;
    customInput.style.display = "none";
    customInput.classList.add("custom-input");
    container.appendChild(customInput);

    customButton.addEventListener("click", () => {
        document.querySelectorAll(`.${container.id}-input-buttons`).forEach(el => el.classList.remove("selected"));
        customButton.classList.add("selected");
        customInput.style.display = "block";
        customInput.focus();
    });

    customInput.addEventListener("change", () => {
        const value = Number(customInput.value);
        if (value > 0) {
            callback(value);
            CalculateResult();
        }
    });
}

export function DoseInputSetup(container: HTMLDivElement) {
    setupInput(container, DefaultDoseValues, (value) => doseValue = value, doseValue);
}

export function StrengthInputSetup(container: HTMLDivElement) {
    setupInput(container, DefaultStrengthValues, (value) => peptideStrength = value, peptideStrength);
}

export function WaterInputSetup(container: HTMLDivElement) {
    setupInput(container, DefaultWaterAmounts, (value) => waterAmount = value, waterAmount);
}

export function CalculateResult() {
    const resultContainer = document.getElementById("result");
    const plungerEl = document.getElementById("plunger");
    if (!plungerEl) throw new Error("Can not find element with id `plunger`");
    if (!resultContainer) throw new Error("Can not find element with id `result");

    const concentration = peptideStrength / waterAmount;
    const volumeToDraw = doseValue / concentration;
    const volumeInIU = volumeToDraw * 100;

    let totalWidth = 64 * 16 - (270);
    if (window.innerWidth < 786) {
        // on mobile devices the injection image width is 80% the screen size minus the paddings
        totalWidth = window.innerWidth * 0.7;
    }

    const totalMarks = 100;
    const widthPerMark = totalWidth / totalMarks;
    const plungerWidth = widthPerMark * volumeInIU;
    if (plungerWidth > totalWidth) {
        setError("Please lower the amount of water!");
    } else {
        clearError();
        plungerEl.style.width = `${plungerWidth}px`;
    }

    // @ts-ignore
    document.getElementById("concentration").textContent = `${concentration.toFixed(2)} mg/mL`;

    // @ts-ignore
    document.getElementById("volumeToDraw").textContent = `${volumeToDraw.toFixed(2)} units`;

    // @ts-ignore
    document.getElementById("volumeInIU").textContent = `${volumeInIU.toFixed(2)} units`;
}

