import { handleCodeCopying } from "./js/copy";
import settings from "./_data/settings.json";

const exposed = {};
if (location.search) {
  var a = document.createElement("a");
  a.href = location.href;
  a.search = "";
  history.replaceState(null, null, a.href);
}

function prefetch(e) {
  if (e.target.tagName != "A") {
    return;
  }
  if (e.target.origin != location.origin) {
    return;
  }
  var l = document.createElement("link");
  l.rel = "prefetch";
  l.href = e.target.href;
  document.head.appendChild(l);
}
document.documentElement.addEventListener("mouseover", prefetch, {
  capture: true,
  passive: true,
});
document.documentElement.addEventListener("touchstart", prefetch, {
  capture: true,
  passive: true,
});

const GA_ID = document.documentElement.getAttribute("ga-id");
window.ga =
  window.ga ||
  function () {
    if (!GA_ID) {
      return;
    }
    (ga.q = ga.q || []).push(arguments);
  };
ga.l = +new Date();
ga("create", GA_ID, "auto");
ga("set", "transport", "beacon");
var timeout = setTimeout(
  (onload = function () {
    clearTimeout(timeout);
    ga("send", "pageview");
  }),
  1000
);

var ref = +new Date();
function ping(event) {
  var now = +new Date();
  if (now - ref < 1000) {
    return;
  }
  ga("send", {
    hitType: "event",
    eventCategory: "page",
    eventAction: event.type,
    eventLabel: Math.round((now - ref) / 1000),
  });
  ref = now;
}
addEventListener("pagehide", ping);
addEventListener("visibilitychange", ping);
addEventListener(
  "click",
  function (e) {
    var button = e.target.closest("button");
    if (!button) {
      return;
    }
    ga("send", {
      hitType: "event",
      eventCategory: "button",
      eventAction: button.getAttribute("aria-label") || button.textContent,
    });
  },
  true
);
var selectionTimeout;
addEventListener(
  "selectionchange",
  function () {
    clearTimeout(selectionTimeout);
    var text = String(document.getSelection()).trim();
    if (text.split(/[\s\n\r]+/).length < 3) {
      return;
    }
    selectionTimeout = setTimeout(function () {
      ga("send", {
        hitType: "event",
        eventCategory: "selection",
        eventAction: text,
      });
    }, 2000);
  },
  true
);

if (window.ResizeObserver && document.querySelector("header nav #nav")) {
  var progress = document.getElementById("reading-progress");

  var timeOfLastScroll = 0;
  var requestedAniFrame = false;
  function scroll() {
    if (!requestedAniFrame) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
    timeOfLastScroll = Date.now();
  }
  addEventListener("scroll", scroll);

  var winHeight = 1000;
  var bottom = 10000;
  function updateProgress() {
    requestedAniFrame = false;
    var percent = Math.min(
      (document.scrollingElement.scrollTop / (bottom - winHeight)) * 100,
      100
    );
    progress.style.transform = `translate(-${100 - percent}vw, 0)`;
    if (Date.now() - timeOfLastScroll < 3000) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
  }

  new ResizeObserver(() => {
    if (document.querySelector("#comments,footer")) {
      bottom =
        document.scrollingElement.scrollTop +
        // document.querySelector("#comments,footer").getBoundingClientRect().top;
        document.querySelector("#comments,footer").getBoundingClientRect().top;
    }
    winHeight = window.innerHeight;
    scroll();
  }).observe(document.body);
}

addEventListener("click", (e) => {
  const handler = e.target.closest("[on-click]");
  if (!handler) {
    return;
  }
  e.preventDefault();
  const name = handler.getAttribute("on-click");
  const fn = exposed[name];
  if (!fn) {
    throw new Error("Unknown handler" + name);
  }
  fn(handler);
});

// There is a race condition here if an image loads faster than this JS file. But
// - that is unlikely
// - it only means potentially more costly layouts for that image.
// - And so it isn't worth the querySelectorAll it would cost to synchronously check
//   load state.
document.body.addEventListener(
  "load",
  (e) => {
    if (e.target.tagName != "IMG") {
      return;
    }
    // Ensure the browser doesn't try to draw the placeholder when the real image is present.
    e.target.style.backgroundImage = "none";
  },
  /* capture */ "true"
);

// Scrolling toc
// -----------------------------------------
if (document.querySelectorAll("h2, h3") != null) {
  function headingTOC() {
    document
      .querySelectorAll("h2:not(.exclude-from-toc), h3:not(.exclude-from-toc)")
      .forEach((heading) => {
        var id = heading.getAttribute("id"); // id of headings
        if (
          document.getElementsByTagName("html")[0].scrollTop >=
          heading.offsetTop - 150
        ) {
          if (id != null) {
            var toc = document.getElementsByClassName("toc-js")[0];
            if (toc != null) {
              toc.querySelectorAll("a").forEach((item) => {
                item.parentElement.classList.remove("toc-active");
              });
              document
                .querySelector(`.toc-js li a[href="#${id}"]`)
                .parentElement.classList.add("toc-active");
              if (heading.tagName === "H2") {
                toc.querySelectorAll("a").forEach((item) => {
                  item.parentElement.classList.remove("h2-focused");
                });
                document
                  .querySelector(`.toc-js li a[href="#${id}"]`)
                  .parentElement.classList.add("h2-focused");
              }
            }
          }
        }
      });
  }

  // Remove "#" at the end of heading in toc
  function removeHash() {
    var toc = document.getElementsByClassName("toc")[0];
    if (toc != null) {
      toc.querySelectorAll("a").forEach((item) => {
        item.innerHTML = item.innerHTML.replace(" #", "");
      });
    }
  }

  addEventListener("load", removeHash);
  addEventListener("scroll", headingTOC);
}

// Anchor link fixed navigation from top
// -----------------------------------------
function offsetAnchor() {
  if (location.hash.length !== 0) {
    window.scrollTo({ left: window.scrollX, top: window.scrollY - 60 });
  }
}
// Captures click events of all <a> elements with href starting with #
document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    // Click events are captured before hashchanges. Timeout
    // causes offsetAnchor to be called after the page jump.
    if (
      (e.target.tagName === "A" && e.target.hash.startsWith("#")) ||
      (e.target.tagName === "I" &&
        e.target.parentElement.tagName === "A" &&
        e.target.parentElement.hash.startsWith("#"))
    ) {
      window.setTimeout(function () {
        offsetAnchor();
      }, 0);
    }
  });
});

// Set the offset when entering page with hash present in the url
window.setTimeout(offsetAnchor, 0);

// Hide/show box
// -----------------------------------------
window.addEventListener(
  "click",
  (ev) => {
    if (ev.target.classList.contains("hs__title")) {
      ev.target.classList.toggle("show");
    }
  },
  false
);

// Elasticlunr
// -----------------------------------------
// Add .selected to current li
const addSelected2 = (ulRes, li) => {
  // Remove class "selected" from all li
  ulRes.querySelectorAll("li").forEach((item) => {
    item.classList.remove("selected");
  });
  // Add class "selected" to the current li
  li.classList.add("selected");
};

(function (window, document) {
  "use strict";

  const search = (e) => {
    const results = window.searchIndex.search(e.target.value, {
      bool: "OR",
      expand: true,
    });

    const kw = e.target.value;
    var regEx = new RegExp(kw, "ig");

    const divRes = document.getElementById("nav-search__result-container"); // div (ul's father)
    const ulRes = document.getElementById("nav-search__ul"); // ul
    const noResEl = document.getElementById("nav-search__no-result");

    ulRes.innerHTML = "";
    if (kw != "") {
      divRes.style.display = "block";
      if (results != "") {
        // If there is result
        noResEl.style.display = "none";
        results.map((r) => {
          var { id, title, keywords, tags, cat, target } = r.doc; // use keywords instead

          // Use content??? (modify .eleventy.js also!)
          // var { id, title, keywords, cat, content } = r.doc;
          // keywords = content;

          const el = document.createElement("li");
          ulRes.appendChild(el);

          const divIcon = document.createElement("div");
          divIcon.setAttribute("class", "item__icon");
          el.appendChild(divIcon);
          const divIcon__icon = document.createElement("li");
          divIcon__icon.setAttribute("class", "fontello-icon " + cat);
          divIcon.appendChild(divIcon__icon);

          const divContent = document.createElement("div");
          divContent.setAttribute("class", "item__content");
          el.appendChild(divContent);

          const h3 = document.createElement("h3");
          divContent.appendChild(h3);
          const a = document.createElement("a");
          a.setAttribute("href", id);
          a.setAttribute("target", target);
          if (title && kw) {
            if (title.toLowerCase().includes(kw.toLowerCase())) {
              title = title.replace(regEx, function (x) {
                return "<mark>" + x + "</mark>";
              });
            }
          }
          a.innerHTML = title;
          h3.appendChild(a);

          const p = document.createElement("p");

          if (keywords && kw) {
            if (keywords.toLowerCase().includes(kw.toLowerCase())) {
              keywords = keywords.replace(regEx, function (x) {
                return " <mark>" + x + "</mark>";
              });
            }
            if (keywords.indexOf("<mark>") > 10 && tags != "") {
              keywords =
                "..." + keywords.substring(keywords.indexOf("<mark>") - 10);
            }
            // Too long keywords or content
            // -- uncomment below if search on full content
            // if (keywords.length > 500) {
            // 	keywords = "..." + keywords.substring(0, keywords.indexOf("<mark>") + kw.length + 15) + "..."
            // }
          }
          p.innerHTML = keywords;
          divContent.appendChild(p);

          const enter = document.createElement("div");
          enter.setAttribute("class", "enter");
          el.appendChild(enter);
          const enter__img = document.createElement("img");
          enter__img.setAttribute("src", "/img_src/nav/enter.svg");
          enter.appendChild(enter__img);
        });

        ulRes.firstChild.classList.add("selected");

        // Mouse hover trigger for li
        ulRes.querySelectorAll("li").forEach((item) => {
          item.addEventListener(
            "mousemove",
            () => {
              addSelected2(ulRes, item);
            },
            false
          );

          // If <a> focused by a Tab key
          if (!!item.getElementsByClassName("item__content")[0]) {
            item
              .getElementsByClassName("item__content")[0]
              .firstChild.firstChild.addEventListener(
                "focus",
                () => {
                  addSelected2(ulRes, item);
                },
                false
              );
          }
        });
      } else {
        noResEl.style.display = "block";
      }
    } else {
      divRes.style.display = "none";
    }
  };

  fetch("/pages/search-index.json").then((response) =>
    response.json().then((rawIndex) => {
      window.searchIndex = elasticlunr.Index.load(rawIndex);
      document
        .getElementById("nav-search__input")
        .addEventListener("input", search);
    })
  );
})(window, document);

// Dark/Light toggle
// -----------------------------------------
const btn = document.getElementById("toggle-dark-light");
let toggleIcon = btn.firstElementChild;

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
btn.addEventListener("click", function () {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-theme");
    var theme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
    toggleIconFn(theme);
  } else {
    document.body.classList.toggle("dark-theme");
    var theme = document.body.classList.contains("dark-theme")
      ? "dark"
      : "light";
    toggleIconFn(theme);
  }
  localStorage.setItem("theme", theme);
});
const toggleIconFn = (theme) => {
  if (theme === "dark") {
    toggleIcon.src = "/img_src/nav/sun.svg";
  } else {
    toggleIcon.src = "/img_src/nav/moon.svg";
  }
};

// Show draft posts
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

// COPY BUTTON
handleCodeCopying();
