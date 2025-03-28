const DefaultDoseValues = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15]; // in mg
const DefaultStrengthValues = [1, 5, 10, 15, 20, 30, 50];                 // in mg
const DefaultWaterAmounts = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];               // in mL

let doseValue = DefaultDoseValues[0];
let peptideStrength = DefaultStrengthValues[0];
let waterAmount = DefaultWaterAmounts[0];

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

function CalculateResult() {
    const resultContainer = document.getElementById("result");

    if (!resultContainer) return;

    const concentration = peptideStrength / waterAmount;
    const volumeToDraw = doseValue / concentration;
    const volumeInIU = volumeToDraw * 100;

    // @ts-ignore
    document.getElementById("plunger").style.width = `${volumeInIU/2}rem`;

    // @ts-ignore
    document.getElementById("concentration").textContent = `${concentration.toFixed(2)} mg/mL`;

    // @ts-ignore
    document.getElementById("volumeToDraw").textContent = `${volumeToDraw.toFixed(2)} units`;

    // @ts-ignore
    document.getElementById("volumeInIU").textContent = `${volumeInIU.toFixed(2)} units`;
}

