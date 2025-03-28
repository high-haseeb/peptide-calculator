import './style.css'
import { DoseInputSetup, StrengthInputSetup, WaterInputSetup } from './setup';

const doseAmountContainer = document.getElementById("doseAmount-container");
const peptideStrengthContainer = document.getElementById("peptideStrength-container");
const waterAmountContainer = document.getElementById("waterAmount-container");

// @ts-ignore
DoseInputSetup(doseAmountContainer);
// @ts-ignore
StrengthInputSetup(peptideStrengthContainer);
// @ts-ignore
WaterInputSetup(waterAmountContainer);
