"use strict";

/**
 * Import
 */

import { fetchData } from "/assets/js/api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

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
    addTabContent(this, $currentTabPanel);
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

const addTabContent = ($currentTabBtn, $currentTabPanel) => {
  const /** {NodeElement} */ $gridList = document.createElement("div");
  $gridList.classList.add("grid-list");

  $currentTabPanel.innerHTML = `
  <div class="grid-list">
    ${$skeletonCard.repeat(12)}
  </div>
  `;

  fetchData(
    [
      ["mealType", $currentTabBtn.textContent.trim().toLowerCase()],
      ...cardQueries,
    ],
    function (data) {
      $currentTabPanel.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = data.hits[i];

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(
          `cookwise-recipe${recipeId}`
        );

        const /** {NodeElement} */ $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * i}ms`;
        $card.innerHTML = `
        <figure class="card-media img-holder">
                    <img
                      src="${image}"
                      width="195"
                      height="195"
                      loading="lazy"
                      alt="${title}"
                      class="img-cover"
                    />
                  </figure>

                  <div class="card-body">
                    <h3 class="title-small">
                      <a href="./detail.html?recipe=${recipeId}" class="card-link"
                        >${title ?? "Untitled"}</a
                      >
                    </h3>

                    <div class="meta-wrapper">
                      <div class="meta-item">
                        <span
                          class="material-symbols-outlined"
                          aria-hidden="true"
                          >Schedule</span
                        >
                        <span class="label-medium">${
                          getTime(cookingTime).time || "<1"
                        } ${getTime(cookingTime).timeUnit}</span>
                      </div>

                      <button
                        class="icon-btn has-state ${
                          isSaved ? "saved" : "removed"
                        }"
                        aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')" 
                      >
                        <i class="far fa-bookmark"></i>
                        <span
                          class="material-symbols-outlined bookmark-add"
                          aria-hidden="true"
                          >bookmark_add</span
                        >
                        <span
                          class="material-symbols-outlined bookmark"
                          aria-hidden="true"
                          >bookmark</span
                        >
                      </button>
                    </div>
                  </div>
        `;

        $gridList.appendChild($card);
      }

      $currentTabPanel.appendChild($gridList);

      $currentTabPanel.innerHTML += `
      <a
                href="./recipes.html?mealType = ${$currentTabBtn.textContent
                  .trim()
                  .toLowerCase()}"
                class="btn btn-secondary label-large has-state"
                >Show More</a
              >
      `;
    }
  );
};

addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

/**
 * Fetch data for slider card
 */

let /** {Array} */ cusineType = ["Asian", "French"];

const /** {NodeList} */ $sliderSections = document.querySelectorAll(
    "[data-slider-section]"
  );

for (const [index, $sliderSection] of $sliderSections.entries()) {
  $sliderSection.innerHTML = `
  <div class="container">
  <div class="row">
    <h2 class="section-title headline-small" id="slider-label-1">Latest ${
      cusineType[index]
    } Recipes</h2>

    <div class="slider">
      <ul class="slider-wrapper" data-slider-wrapper>
        ${`<li class="slider-item">${$skeletonCard}</li>`.repeat(10)}
      </ul>
    </div>

  </div>
`;

  const /** {NodeElement} */ $sliderWrapper = $sliderSection.querySelector(
      "[data-slider-wrapper"
    );

  fetchData(
    [...cardQueries, ["cusineType", cusineType[index]]],
    function (data) {
      $sliderWrapper.innerHTML = "";

      data.hits.map((item) => {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = item;

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(
          `cookwise-recipe${recipeId}`
        );

        const $sliderItem = document.createElement("li");
        $sliderItem.classList.add("slider-item");

        $sliderItem.innerHTML = `
        <div class="card">
          <figure class="card-media img-holder">
                    <img
                      src="${image}"
                      width="195"
                      height="195"
                      loading="lazy"
                      alt="${title}"
                      class="img-cover"
                    />
                  </figure>

                  <div class="card-body">
                    <h3 class="title-small">
                      <a href="./detail.html?recipe=${recipeId}" class="card-link"
                        >${title ?? "Untitled"}</a
                      >
                    </h3>

                    <div class="meta-wrapper">
                      <div class="meta-item">
                        <span
                          class="material-symbols-outlined"
                          aria-hidden="true"
                          >Schedule</span
                        >
                        <span class="label-medium">${
                          getTime(cookingTime).time || "<1"
                        } ${getTime(cookingTime).timeUnit}</span>
                      </div>

                      <button
                        class="icon-btn has-state ${
                          isSaved ? "saved" : "removed"
                        }"
                        aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')" 
                      >
                        <i class="far fa-bookmark"></i>
                        <span
                          class="material-symbols-outlined bookmark-add"
                          aria-hidden="true"
                          >bookmark_add</span
                        >
                        <span
                          class="material-symbols-outlined bookmark"
                          aria-hidden="true"
                          >bookmark</span
                        >
                      </button>
                    </div>
                  </div>
        </div>
        `;

        $sliderWrapper.appendChild($sliderItem);
      });

      $sliderWrapper.innerHTML += `
      <li class="slider-item" data-slider-item>
                  <a href="./recipes.html?cusineType=${cusineType[
                    index
                  ].toLowerCase()}" class="load-more-card as-state">
                    <span class="label-large">Show more</span>
                    <span class="material-symbols-outlined" aria-hidden="true"
                      >navigate_next</span
                    >
                  </a>
                </li>
      `;
    }
  );
}
