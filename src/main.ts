import './style.css';
import { DoseInputSetup, StrengthInputSetup, WaterInputSetup } from './setup';

const doseAmountContainer = document.getElementById("doseAmount-container");
const peptideStrengthContainer = document.getElementById("peptideStrength-container");
const waterAmountContainer = document.getElementById("waterAmount-container");

if (!doseAmountContainer || !peptideStrengthContainer || !waterAmountContainer) {
    throw new Error("Can not find container elements to setup the inputs");
}

DoseInputSetup(doseAmountContainer);
StrengthInputSetup(peptideStrengthContainer);
WaterInputSetup(waterAmountContainer);

// const calculateEl = document.getElementById("calculateBtn");
// if (!calculateEl) throw new Error("Can not find button with id `calculateBtn`");
// calculateEl.addEventListener("click", CalculateResult);
