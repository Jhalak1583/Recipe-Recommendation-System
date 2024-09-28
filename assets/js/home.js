"use strict";

/**
 * Home page search
 */

const /** {NodeElement} */ $searchField = document.querySelector(
    "[data-search-field]"
  );
const /** {NodeElement} */ $searchBtn =
    document.querySelector("[data-search-btn]");

$searchBtn.addEventListener("click", function () {
  if ($searchField.value)
    window.location = `/recipe.html?q=${$searchField.value}`;
});

/**
 * Search submit when pressing the "Enter" key
 */

$searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $searchBtn.click();
});

/**
 * Tab panel navigation
 */

const /** {NodeList} */ $tabBtns = document.querySelectorAll("[data-tab-btn]");
const /** {NodeList} */ $tabPanels =
    document.querySelectorAll("[data-tab-panel]");

let /** {NodeElement} */ $lastActiveTabPanel = $tabPanels[0];
let /** {NodeElement} */ $lastActiveTabBtn = $tabBtns[0];

// Loop through all tab buttons and add click event listeners
$tabBtns.forEach(($tabBtn, index) => {
  $tabBtn.addEventListener("click", function () {
    // Hide the previous active tab panel and deactivate the previous tab button
    $lastActiveTabPanel.setAttribute("hidden", "");
    $lastActiveTabBtn.setAttribute("aria-selected", false);
    $lastActiveTabBtn.setAttribute("tabindex", -1);

    // Show the new active tab panel and activate the clicked tab button
    const /** {NodeElement} */ $currentTabPanel = $tabPanels[index];
    $currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);

    // Update the last active tab panel and button to the current ones
    $lastActiveTabPanel = $currentTabPanel;
    $lastActiveTabBtn = this;
  });
});

$tabBtns.forEach(($btn) => {
  $btn.addEventListener("keydown", function (e) {
    const /** {NodeElement} */ $nextElement = this.nextElementSibling;
    const /** {NodeElement} */ $previousElement = this.previousElementSibling;

    if (e.key === "ArrowRight" && $nextElement) {
      this.setAttribute("tabindex", -1);
      $nextElement.setAttribute("tabindex", 0);
      $nextElement.focus();
    } else if (e.key === "ArrowLeft" && $previousElement) {
      this.setAttribute("tabindex", -1);
      $previousElement.setAttribute("tabindex", 0);
      $previousElement.focus();
    } else if (e.key === "Tab") {
      this.setAttribute("tabindex", -1);
      $lastActiveTabBtn.setAttribute("tabindex", 0);
    }
  });
});
