function showChildrenHedings(id) {
  iEl = document.getElementById(id);
  if (iEl.classList.contains("icon-right-open")) {
    iEl.classList.remove("icon-right-open");
    iEl.classList.add("icon-down-open");
    iEl.parentNode.classList.add("showChildren");
    iEl.parentNode.classList.remove("hideChildren");
  } else {
    iEl.classList.remove("icon-down-open");
    iEl.classList.add("icon-right-open");
    iEl.parentNode.classList.remove("showChildren");
    iEl.parentNode.classList.add("hideChildren");
  }
}
