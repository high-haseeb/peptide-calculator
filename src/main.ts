import './style.css'
import { DoseInputSetup, StrengthInputSetup, WaterInputSetup, SetAmplitude } from './setup';
import { ThreeScene } from "./model";

const doseAmountContainer = document.getElementById("doseAmount-container");
const peptideStrengthContainer = document.getElementById("peptideStrength-container");
const waterAmountContainer = document.getElementById("waterAmount-container");

DoseInputSetup(doseAmountContainer);
StrengthInputSetup(peptideStrengthContainer);
WaterInputSetup(waterAmountContainer);
