"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector("#form");
const input = document.querySelector("#search-box");
const searchBtn = document.querySelector(".search-btn");
const inst = document.querySelector(".instruction");
const searchName = document.querySelector("#search-name");
const mealContainer = document.querySelector(".meals");
const modal = document.querySelector(".modal-box");
const wrapper = document.querySelector(".wrapper");
let singleImg;
const ApiURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const detailsURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
class GetRecipe {
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield fetch(`${ApiURL}${input.value.trim()}`);
                let data = yield res.json();
                return data;
            }
            catch (error) {
                alert(`${error} Refresh the page`);
            }
        });
    }
    getRecipeDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield fetch(`${detailsURL}${id}`);
                let data = yield res.json();
                return data;
            }
            catch (error) {
                alert(`${error} Failed to load details`);
            }
        });
    }
}
class Logic {
    constructor() {
        this.getRecipe = new GetRecipe();
    }
    searchRecipe() {
        searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.getRecipe
                .getData()
                .then((data) => {
                this.displayData(data.meals);
            })
                .then(() => {
                this.getViewButtons();
            });
        });
    }
    displayData(data) {
        if (data === null) {
            this.noRecipe();
        }
        else {
            let display = "";
            data.forEach((item) => {
                display += `
          <div class="single-meal">
            <div class="meal-img">
              <img src="${item.strMealThumb}" alt="${item.strMeal}" />
            </div>
            <span>${this.checkNameLength(item.strMeal)}</span>
            <div class="view-recipe">
              <button class="view-recipe-btn" data-id="${item.idMeal}">View Recipe</button>
            </div>
          </div>
        `;
            });
            mealContainer.innerHTML = display;
            this.displayLabel();
            form.reset();
        }
    }
    checkNameLength(name) {
        return name.length > 35 ? name.substring(0, 25) : name;
    }
    displayLabel() {
        if (!input.value) {
            searchName.textContent = "All available recipes";
        }
        else {
            searchName.textContent = `"${input.value}" related recipes`;
        }
        searchName.style.color = "orangeRed";
        inst.style.display = "none";
    }
    noRecipe() {
        searchName.textContent = "No recipes found";
        searchName.style.color = "red";
        mealContainer.innerHTML = "";
        inst.style.display = "none";
        setTimeout(() => {
            searchName.textContent = "";
            searchName.style.color = "orangeRed";
            inst.style.display = "block";
        }, 2000);
        form.reset();
    }
    getViewButtons() {
        const viewBtns = document.querySelectorAll(".view-recipe-btn");
        viewBtns.forEach((btn) => {
            btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = btn.dataset.id;
                    if (id) {
                        const target = btn;
                        if (target) {
                            this.getTargetImage(target);
                            const data = yield this.getRecipe.getRecipeDetails(id);
                            this.displayDetails(data);
                            this.getExitBtn();
                        }
                        else {
                            console.error("Invalid target element.");
                        }
                    }
                    else {
                        console.error("Invalid or missing 'data-id' attribute.");
                    }
                }
                catch (error) {
                    console.error("An error occurred:", error);
                }
            }));
        });
    }
    getTargetImage(target) {
        var _a, _b;
        const parentElement = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        const imgElement = (_b = parentElement === null || parentElement === void 0 ? void 0 : parentElement.children[0]) === null || _b === void 0 ? void 0 : _b.children[0];
        if (imgElement instanceof HTMLImageElement) {
            singleImg = imgElement.src;
        }
        else {
            console.error("Invalid HTML structure. Unable to retrieve image source.");
        }
    }
    displayDetails(data) {
        modal.classList.remove("hide");
        wrapper.classList.remove("hide");
        let display = `
      <div class="modal">
        <div class="details">
          <div class="cancel">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>
          <div class="img">
            <img src="${singleImg}" alt="${data.meals[0].strMeal}" />
          </div>
          <div class="instruction-step">
            <span style="color: black;">INSTRUCTIONS FOR ${data.meals[0].strMeal}:</span>
            <p class="steps">${data.meals[0].strInstructions}</p>
          </div>
          <div class="link">
            <i class="fa-brands fa-youtube"></i>
            <a href="${data.meals[0].strYoutube}" target="_blank" rel="noopener noreferrer">Click to watch video</a>
          </div>
        </div>
      </div>
    `;
        modal.innerHTML = display;
    }
    getExitBtn() {
        let exitBtn = document.querySelector(".fa-circle-xmark");
        exitBtn.addEventListener("click", () => {
            this.closeModal();
        });
        wrapper.addEventListener("click", () => {
            this.closeModal();
        });
    }
    closeModal() {
        modal.classList.add("hide");
        wrapper.classList.add("hide");
    }
}
const logic = new Logic();
logic.searchRecipe();
