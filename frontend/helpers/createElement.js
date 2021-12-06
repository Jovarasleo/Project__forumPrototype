function createElement(type, attributes) {
  let element = document.createElement(type);
  for (let key in attributes) {
    if (key == "class") {
      element.classList.add.apply(element.classList, attributes[key]);
    } else {
      element[key] = attributes[key];
    }
  }
  return element;
}
export default createElement;
