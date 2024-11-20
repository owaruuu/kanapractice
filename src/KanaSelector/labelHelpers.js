import { CreateComplex, CreateAndClass } from "../domHelpers.js";
import { GroupButtonChangeEvent, NormalButtonClickEvent } from "../events.js";
import { romajiConsonants } from "../romaji.js";
import { sets } from "../sets.js";

/**
 * Creates a group config button, this kind of button changes the state of other buttons and reacts to other buttons change in state
 * @param {HTMLElement} parentDiv
 * @param {HTMLElement} parentButtonRef Referencia al boton padre
 * @param {String} id
 * @param {String} labelClass
 * @param {String} text
 */
export function CreateGroupConfigButton(
    parentDiv,
    parentButtonRef,
    id,
    labelClass,
    text
) {
    let { label, input } = CreateConfigButton(parentDiv, id);
    label.classList.add(labelClass);
    input.addEventListener("click", (e) => ClickGroupInput(e, parentButtonRef));
    input.addEventListener("change", (e) => {
        console.log("hubo un cambio en el input");
        if (parentButtonRef)
            parentButtonRef.dispatchEvent(GroupButtonChangeEvent);
    });

    let node = document.createTextNode(text);
    label.appendChild(node);

    return label;
}

/**
 * Creates the base for a config label button
 * @param {HTMLElement} parent
 * @param {String} id
 * @returns {{label: HTMLElement, input: HTMLElement}}} the new label element
 */
function CreateConfigButton(parent, id) {
    let label = CreateAndClass("label", parent, ["select-box"]);
    label.setAttribute("for", id);

    let input = CreateComplex("input", label, id, ["setup-input"], null);
    input.setAttribute("type", "checkbox");
    // input.addEventListener("click", (e) => callback(e, parentButtonRef));

    //esto va a ser necesario para cuando el input cambie como consecuencia de otra accion y no de un click directo
    //quizas pueda sepaar el callback en uno que ocupe el evento para click y otro que ocupe la ref al padre con change
    // input.addEventListener("change", (e) => {
    //     console.log("hubo un cambio en el input");
    // });

    return { label, input };
}

/**
 * Creates a normal config label button
 * @param {HTMLElement} parent
 * @param {HTMLElement} parentButton
 * @param {String} id
 * @param {String} text
 */
export function CreateNormalConfigButton(parent, parentButton, id, text) {
    let { label, input } = CreateConfigButton(parent, id);
    input.addEventListener("click", (e) => {
        e.target.parentElement.classList.toggle("check");
        parentButton.dispatchEvent(NormalButtonClickEvent);
    });

    //Create the div for the reference consonant
    let consonant = CreateAndClass("div", label, ["consonantLabel"]);
    consonant.textContent = romajiConsonants[id];

    //Create the div for the kana letters
    let kanaLabel = CreateAndClass("div", label, ["kanaLabel"]);
    kanaLabel.textContent = text;
}

/**
 * Changes the label on of off along
 * with the corresponding group of labels
 * @param {PointerEvent} event
 */
function ClickGroupInput(event, parentButtonRef) {
    console.log(
        "🚀 ~ ClickGroupInput ~ event, parentButtonRef:",
        event,
        parentButtonRef
    );
    //selecciona el label y cambia su clase
    let label = event.target.parentElement;
    label.classList.toggle("check");

    //obtiene todos los labels del grupo
    let base = label.getAttribute("for");
    let labels = GetAllChildrenButtons(base);

    //si tiene listener
    if (parentButtonRef) parentButtonRef.dispatchEvent(GroupButtonChangeEvent);

    if (label.classList.contains("check")) {
        labels.forEach((element) => {
            element.classList.add("check");
        });
    } else {
        labels.forEach((element) => {
            element.classList.remove("check");
        });
    }
}

/**
 * Get the corresponding kana from a base
 * @param {String} base The value of 'for' attribute
 * @returns {{}} An object with all the kana to select
 */
function BaseToObject(base) {
    switch (base) {
        case "all-base":
            return sets.allmainbase;
        case "all-dakuten":
            return sets.alldakuten;
        case "all-comb":
            return sets.allcomb;
        case "all-hiragana-base":
            return sets.mainkanasets;
        case "all-hiragana-dakuten":
            return sets.dakutenkanasets;
        case "all-hiragana-comb":
            return sets.combkanasets;
        case "all-katakana-base":
            return sets.mainkatakanasets;
        case "all-katakana-dakuten":
            return sets.dakutenkatakanasets;
        case "all-katakana-comb":
            return sets.combkatakanasets;
        case "all-extra":
            return sets.extrasets;
        default:
            throw new Error("Wrong base");
    }
}

/**
 * Get all label elements
 * @param {*} kanaset
 * @returns {Array<Element>} An array with all the labels
 */
function GetAllLabels(kanaset) {
    let labels = [];

    Object.keys(kanaset).forEach((key) => {
        let input = document.querySelector(`#${key}`);
        labels.push(input.parentElement);
    });

    return labels;
}

export function GetAllChildrenButtons(base) {
    let object = BaseToObject(base);
    return GetAllLabels(object);
}