import {
    CleanAppPage,
    PopulateInstructions,
    CreateSetupButtons,
    CreateStackedButton,
} from "../helpers.js";
import { instrucciones } from "../data.js";
import { sets } from "../sets.js";
import { state } from "../state.js";
// console.log("🚀 ~ state:", state);
import {
    CreateSimple,
    CreateComplex,
    CreateAndClass,
    CreateAndId,
} from "../domHelpers.js";
import { BuildLearnPage } from "../learnPage.js";

let { learnSets, currentSet } = state;
// console.log("🚀 ~ learnSets, currentSet:", learnSets, currentSet);

export function BuildLearnSetupPage() {
    let app = CleanAppPage();

    PopulateInstructions(instrucciones.aprender);

    let practiceSetupDiv = CreateAndClass("div", app, ["setupDiv"]);

    CreateSetupButtons(practiceSetupDiv);

    let startButton = CreateStackedButton(app, "Aprender");
    startButton.addEventListener("click", CheckLearnSelected);
}

/**
 * Checks which config buttons are pressed and then builds the Learn Page
 */
function CheckLearnSelected() {
    //get all labels
    let buttons = document.querySelectorAll("div.checkboxes > div > label");

    //hacer un array con todos los 'check'
    let checked = [];

    buttons.forEach((button) => {
        if (button.classList.contains("check")) {
            checked.push(button);
        }
    });

    if (checked.length < 1) {
        alert("Por favor selecciona lo que quieres practicar.");
        return;
    }
    state.learnSets = PopulateLearnSet(checked);
    // learnSets = PopulateLearnSet(checked);
    state.currentSet = state.learnSets[0];

    BuildLearnPage();
}

/**
 *
 * @param {Array<Element>} elementsArray
 * @returns {Array<String>}
 */
function PopulateLearnSet(elementsArray) {
    let learnArray = [];
    elementsArray.forEach((element) => {
        let kana = element.getAttribute("for");
        learnArray.push(sets.allkana[kana]);
    });

    return learnArray;
}