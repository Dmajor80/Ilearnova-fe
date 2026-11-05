import { createId } from "./cbtStorage";

function getElementsByLocalName(element, localName) {
  return [...element.getElementsByTagName("*")]
    .filter((candidate) => candidate.localName === localName);
}

function getResponseValues(item, responseIdentifier) {
  const declarations = getElementsByLocalName(item, "responseDeclaration");
  const declaration = declarations.find((entry) => entry.getAttribute("identifier") === responseIdentifier);
  if (!declaration) {
    throw new Error(`No responseDeclaration was found for "${responseIdentifier}".`);
  }

  const correctResponse = [...declaration.children].find((child) => child.localName === "correctResponse");
  if (!correctResponse) {
    throw new Error("This question has no correctResponse; add an answer key before importing it.");
  }

  return [...correctResponse.children]
    .filter((child) => child.localName === "value")
    .map((child) => child.textContent.trim())
    .filter(Boolean);
}

function parseQtiItem(item) {
  const body = [...item.children].find((child) => child.localName === "itemBody");
  if (!body) throw new Error("The QTI item is missing itemBody.");

  const choiceInteraction = [...body.getElementsByTagName("*")]
    .find((element) => element.localName === "choiceInteraction");
  if (choiceInteraction) {
    const responseIdentifier = choiceInteraction.getAttribute("responseIdentifier");
    if (!responseIdentifier) throw new Error("choiceInteraction is missing responseIdentifier.");
    const answerKeys = getResponseValues(item, responseIdentifier);
    const declaration = getElementsByLocalName(item, "responseDeclaration")
      .find((entry) => entry.getAttribute("identifier") === responseIdentifier);
    const options = getElementsByLocalName(choiceInteraction, "simpleChoice")
      .map((choice) => ({
        id: choice.getAttribute("identifier"),
        text: choice.textContent.trim()
      }));
    if (options.length < 2 || options.some((option) => !option.id || !option.text)) {
      throw new Error("Each choice question must have at least two identified, non-empty simpleChoice options.");
    }
    if (answerKeys.some((key) => !options.some((option) => option.id === key))) {
      throw new Error("The correctResponse contains an identifier that does not match a simpleChoice.");
    }
    if (!answerKeys.length) throw new Error("The correctResponse must include at least one value.");

    const bodyCopy = body.cloneNode(true);
    getElementsByLocalName(bodyCopy, "simpleChoice")
      .forEach((element) => element.remove());

    return {
      id: createId("question"),
      type: declaration?.getAttribute("cardinality") === "multiple"
        || Number(choiceInteraction.getAttribute("maxChoices")) > 1
        ? "multi"
        : "single",
      prompt: bodyCopy.textContent.trim(),
      options,
      correctOptionIds: answerKeys,
      points: 1
    };
  }

  const textInteraction = [...body.getElementsByTagName("*")]
    .find((element) => element.localName === "textEntryInteraction");
  if (textInteraction) {
    const responseIdentifier = textInteraction.getAttribute("responseIdentifier");
    if (!responseIdentifier) throw new Error("textEntryInteraction is missing responseIdentifier.");
    const answers = getResponseValues(item, responseIdentifier);
    if (answers.length !== 1) throw new Error("Text-entry questions must define one correctResponse value.");
    const bodyCopy = body.cloneNode(true);
    getElementsByLocalName(bodyCopy, "textEntryInteraction")
      .forEach((element) => element.remove());
    return {
      id: createId("question"),
      type: "text",
      prompt: bodyCopy.textContent.trim(),
      correctText: answers[0],
      points: 1
    };
  }

  throw new Error("Only QTI choiceInteraction and textEntryInteraction items are supported.");
}

export function parseQtiXml(xmlText, fileName = "QTI XML") {
  const document = new DOMParser().parseFromString(xmlText, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new Error(`${fileName} is not valid XML.`);
  }

  const items = getElementsByLocalName(document, "assessmentItem");
  if (!items.length) {
    throw new Error(`${fileName} does not contain an assessmentItem. Choose QTI item XML files, not a manifest or assessmentTest package.`);
  }

  return items.map(parseQtiItem);
}
