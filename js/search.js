var divNavSearch = document.getElementById("nav-search");
var divRes = document.getElementById("nav-search__result-container");
var ulRes = document.getElementById('nav-search__ul'); // targets the <ul>

// show again if on focus
function inFocus(x) {
	if (x.value != "") {
		divRes.style.display = "block";
	}
}

// lose focus from input but don't close divRes when mouse hover on it
var isOnDiv = false;
divRes.addEventListener("mouseover", function () {
	isOnDiv = true;
});
divRes.addEventListener("mouseout", function () {
	isOnDiv = false;
});
var inputSearch = document.getElementById("nav-search__input");

window.addEventListener("click", function () {
	// check if there is any result?
	var hasResult = ulRes.getElementsByTagName('li').length >= 1;
	if (!hasResult || !isOnDiv) {
		divRes.style.display = 'none';
	}
});
inputSearch.addEventListener("click", e => {
	e.stopPropagation();
});

// add .selected to current li
const addSelected = (li) => {
	// remove class "selected" from all li
	ulRes.querySelectorAll("li").forEach((item) => {
			item.classList.remove("selected");
		});
	// add class "selected" to the current li
	li.classList.add("selected");
}


// Check the selected li is in the view
var isInView = (selectedLi, divRes) => {
	var isOutBelow = selectedLi.offsetTop + selectedLi.offsetHeight - divRes.scrollTop > divRes.offsetHeight;
	var isOutAbove = selectedLi.offsetTop < divRes.scrollTop;
	if (isOutAbove) {
		return "above";
	} else if (isOutBelow) {
		return "below";
	} else {
		return "in";
	}
}

const updateScroll = (selectedLi, divRes) => {
	// below
	if (selectedLi.offsetTop + selectedLi.offsetHeight - divRes.scrollTop > divRes.offsetHeight) {
		divRes.scrollTop = selectedLi.offsetTop + selectedLi.offsetHeight - divRes.offsetHeight;
	}
	// above
	if (selectedLi.offsetTop < divRes.scrollTop) {
		divRes.scrollTop = selectedLi.offsetTop;
	}
	return;
}

// ARROW TRIGGER
// -----------------------------------------------------------------------------
document.onkeydown = (e) => {
	// press "/" to focus to input
	checkInInput = document.activeElement == inputSearch;
	if (e.key === "/" && !checkInInput) {
		e.stopPropagation();
		e.preventDefault();
		inputSearch.focus();
	}
};

document.addEventListener("focusin", e => {
	if (!divNavSearch.contains(e.target)) {
		divRes.style.display = 'none';
	}
});

// prevent default Enter + go to selected li's a
inputSearch.onkeydown = (e) => {
	if (e.key === "Enter") {
		e.stopPropagation();
		e.preventDefault();
		var selectedLi = ulRes.querySelector('li[class*="selected"]');
		window.location.href = selectedLi.getElementsByClassName("item__content")[0].firstChild.firstChild.href;
	}

	// release
	if (e.key === "Escape") {
		divRes.style.display = 'none';
		inputSearch.blur();
	}
}

divNavSearch.onkeydown = (e) => {
	// check if there is any result?
	hasResult = ulRes.getElementsByTagName('li').length >= 1;

	if (hasResult) {
		if (["ArrowUp", "ArrowDown"].indexOf(e.key) > -1) {
			// prevent normal action of up/down
			e.preventDefault();
		}

		var firstLi = ulRes.firstChild; // targets the first <li>
		var lastLi = ulRes.lastChild; // last li

		// selected li before keydown
		var selectedLi = ulRes.querySelector('li[class*="selected"]');

		switch (e.key) {
			case "ArrowUp":
				if ( !selectedLi || selectedLi == firstLi ) {
					nextLi = lastLi;
				} else {
					nextLi = selectedLi.previousSibling;
				}
				addSelected(nextLi);
				selectedLi = nextLi;
				updateScroll(selectedLi, divRes);
				break;
			case "ArrowDown":
				if ( !selectedLi || selectedLi == lastLi) {
					nextLi = firstLi;
				} else {
					nextLi = selectedLi.nextSibling;
				}
				addSelected(nextLi);
				selectedLi = nextLi;
				updateScroll(selectedLi, divRes);
				break;
		}

	} // end if hasResult
}