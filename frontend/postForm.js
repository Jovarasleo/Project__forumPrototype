import createElement from "./helpers/createElement.js";
import submitButtonHandler from "./index.js";
const formSelector = document.querySelector(".makePost");

export default function postFormRender() {
  const formWrapper = createElement("div", { class: ["formWrapper"] });
  const form = createElement("form", { class: ["makePost--form"] });
  const formInputMsg = document.createElement("textarea");
  formInputMsg.setAttribute("type", "postBody");
  formInputMsg.setAttribute("name", "postBody");
  const formInputTitle = createElement("input", {
    type: "Title",
    name: "Title",
  });
  const TitleLabel = createElement("label", {
    for: "Title",
    textContent: "Title:",
  });
  const MsgLabel = createElement("label", {
    for: "postBody",
    textContent: "Post:",
  });
  const button = createElement("button", {
    class: ["send"],
    type: "button",
    textContent: "Send Post",
  });
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    await submitButtonHandler();
  });
  const titleWrapper = document.createElement("div");
  const msgWrapper = document.createElement("div");
  titleWrapper.append(TitleLabel, formInputTitle);
  msgWrapper.append(MsgLabel, formInputMsg);
  form.append(titleWrapper, msgWrapper, button);
  formWrapper.append(form);
  formSelector.append(formWrapper);
}
