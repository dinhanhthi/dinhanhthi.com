// Make sure below settings are the same as ones in notes/_data/settings.json
const settings = {
  hideDraftPostsByDefault: true,
  hidePrivatePostsByDefault: true,
  hideOutsideNotesByDefault: false,
};

// Toggle notes
// -----------------------------------------
const toggleDraftBtn = document.getElementById("toggle-draft-button");
const togglePrivateBtn = document.getElementById("toggle-private-button");
const toggleOutsideBtn = document.getElementById("toggle-outside-button");

const mainWrapper = document.getElementById("main-wrapper");
const pageIndex = document.getElementsByClassName("page-index")[0];

if (toggleDraftBtn) {
  toggleDraftBtn.addEventListener("click", function () {
    mainWrapper.classList.toggle("hide-draft-posts");
    if (pageIndex) {
      hideEmptyCategoryWrapper();
    }
  });
}

if (togglePrivateBtn) {
  togglePrivateBtn.addEventListener("click", function () {
    mainWrapper.classList.toggle("hide-private-posts");
    if (pageIndex) {
      hideEmptyCategoryWrapper();
    }
  });
}

if (toggleOutsideBtn) {
  toggleOutsideBtn.addEventListener("click", function () {
    mainWrapper.classList.toggle("hide-outside-posts");
    if (pageIndex) {
      hideEmptyCategoryWrapper();
    }
  });
}

// Hide on load
if (
  (settings.hideDraftPostsByDefault ||
    settings.hidePrivatePostsByDefault ||
    settings.hideOutsideNotesByDefault) &&
  pageIndex
)
  hideEmptyCategoryWrapper();

// Index page: Hide category if all posts are drafts
function hideEmptyCategoryWrapper() {
  let listHiddenClass = [];
  if (!toggleDraftBtn.checked) listHiddenClass.push("post-not-full");
  if (!togglePrivateBtn.checked) listHiddenClass.push("post-private");
  if (!toggleOutsideBtn.checked) listHiddenClass.push("post-outside");

  const categoryWrapper = document.querySelectorAll(".category-wrapper");

  categoryWrapper.forEach((cat) => {
    const listOfPosts = cat.querySelector(".list-of-post");
    // Remark: There are lis contains both draft, private and outside classes
    const numberOfLis = listOfPosts.querySelectorAll("li").length;
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
