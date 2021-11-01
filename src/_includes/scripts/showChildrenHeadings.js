function showChildrenHedings(id) {
  iEl = document.getElementById(id);
  //   if (!iEl.parentNode.classList.contains("h2-focused")) {
  if (iEl.classList.contains("icon-right-circle")) {
    iEl.classList.remove("icon-right-circle");
    iEl.classList.add("icon-down-circle");
    iEl.parentNode.classList.add("showChildren");
    iEl.parentNode.classList.remove("hideChildren");
  } else {
    iEl.classList.remove("icon-down-circle");
    iEl.classList.add("icon-right-circle");
    iEl.parentNode.classList.remove("showChildren");
    iEl.parentNode.classList.add("hideChildren");
  }
  //   }
}
