// Make sure below settings are the same as ones in notes/_data/settings.json
const settings = {
  "check-toggle-draft-button": false,
  "check-toggle-private-button": false,
  "check-toggle-outside-button": true,
};

// Toggle notes
// -----------------------------------------
getToggle("toggle-draft-button");
getToggle("toggle-private-button");
getToggle("toggle-outside-button");

const mainWrapper = document.getElementById("main-wrapper");

const toggleDraftBtn = document.getElementById("toggle-draft-button");
const togglePrivateBtn = document.getElementById("toggle-private-button");
const toggleOutsideBtn = document.getElementById("toggle-outside-button");

if (toggleDraftBtn) {
  hideEmptyCategoryWrapper();
  hideShowPosts("toggle-draft-button", "hide-draft-posts");
  toggleDraftBtn.onclick = function () {
    hideShowPosts("toggle-draft-button", "hide-draft-posts");
    saveToggle("toggle-draft-button");
    hideEmptyCategoryWrapper();
  };
}

if (togglePrivateBtn) {
  hideEmptyCategoryWrapper();
  hideShowPosts("toggle-private-button", "hide-private-posts");
  togglePrivateBtn.onclick = function () {
    hideShowPosts("toggle-private-button", "hide-private-posts");
    saveToggle("toggle-private-button");
    hideEmptyCategoryWrapper();
  };
}

if (toggleOutsideBtn) {
  hideEmptyCategoryWrapper();
  hideShowPosts("toggle-outside-button", "hide-outside-posts");
  toggleOutsideBtn.onclick = function () {
    hideShowPosts("toggle-outside-button", "hide-outside-posts");
    saveToggle("toggle-outside-button");
    hideEmptyCategoryWrapper();
  };
}

// Save settings locally
function saveToggle(btnId) {
  var checkbox = document.getElementById(btnId);
  localStorage.setItem(btnId, checkbox.checked);
}

// Restore saved settings
function getToggle(btnId) {
  var checkbox = document.getElementById(btnId);
  var savedValue = localStorage.getItem(btnId);
  if (savedValue) {
    if (savedValue === "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  } else if (settings["check-" + btnId]) {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
}

function hideShowPosts(btnId, className) {
  const mainWrapper = document.getElementById("main-wrapper");
  if (mainWrapper) {
    const toggleBtn = document.getElementById(btnId);
    if (toggleBtn.checked) {
      mainWrapper.classList.remove(className);
    } else {
      mainWrapper.classList.add(className);
    }
  }
}

// Index page: Hide category if all posts are drafts
function hideEmptyCategoryWrapper() {
  const pageIndex = document.getElementsByClassName("page-index")[0];
  if (pageIndex) {
    let listHiddenClass = [];
    if (!toggleDraftBtn.checked) listHiddenClass.push("post-not-full");
    if (!togglePrivateBtn.checked) listHiddenClass.push("post-private");
    if (!toggleOutsideBtn.checked) listHiddenClass.push("post-outside");

    const categoryWrapper = document.querySelectorAll(".category-wrapper");

    categoryWrapper.forEach((cat) => {
      const listOfPosts = cat.querySelector(".toggle-posts");
      // Remark: There are lis contains both draft, private and outside classes
      const numberOfLis = listOfPosts.querySelectorAll(".post-item").length;
      let numberOfHiddenLis = 0;

      if (listHiddenClass.length > 0) {
        switch (listHiddenClass.length) {
          case 1:
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[0]}`
            ).length;
            break;
          case 2:
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[0]}`
            ).length;
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[1]}:not(.${listHiddenClass[0]})`
            ).length;
            break;
          case 3:
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[0]}`
            ).length;
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[1]}:not(.${listHiddenClass[0]})`
            ).length;
            numberOfHiddenLis += listOfPosts.querySelectorAll(
              `.${listHiddenClass[2]}:not(.${listHiddenClass[0]}):not(.${listHiddenClass[1]})`
            ).length;
            break;
        }
      }

      // Hide also the categories on TOC
      const tocUlWrapper = document
        .getElementById("toc-index")
        .querySelector("ul");
      const catName = cat.getAttribute("name");

      if (numberOfHiddenLis === numberOfLis) {
        cat.classList.add("hide-category");
        cat.querySelector("h2").classList.add("exclude-from-toc");
        tocUlWrapper
          .querySelector('li[name="toc-li-' + catName + '"]')
          .classList.add("hide-category");
      } else {
        cat.classList.remove("hide-category");
        cat.querySelector("h2").classList.remove("exclude-from-toc");
        tocUlWrapper
          .querySelector('li[name="toc-li-' + catName + '"]')
          .classList.remove("hide-category");
      }
    });
  }
}
