const form: HTMLFormElement = document.querySelector("#form") as HTMLFormElement;
const input: HTMLInputElement = document.querySelector("#search-box") as HTMLInputElement;
const searchBtn: HTMLButtonElement = document.querySelector(".search-btn") as HTMLButtonElement;
const inst: HTMLDivElement = document.querySelector(".instruction") as HTMLDivElement;
const searchName: HTMLHeadingElement = document.querySelector("#search-name") as HTMLHeadingElement;
const mealContainer: HTMLDivElement = document.querySelector(".meals") as HTMLDivElement;
const modal: HTMLDivElement = document.querySelector(".modal-box") as HTMLDivElement;
const wrapper: HTMLDivElement = document.querySelector(".wrapper") as HTMLDivElement;
let singleImg: string;

const ApiURL: string = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const detailsURL: string = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

class GetRecipe {
  async getData(): Promise<any> {
    try {
      let res: Response = await fetch(`${ApiURL}${input.value.trim()}`);
      let data: any = await res.json();
      return data;
    } catch (error) {
      alert(`${error} Refresh the page`);
    }
  }

  async getRecipeDetails(id: string): Promise<any> {
    try {
      let res: Response = await fetch(`${detailsURL}${id}`);
      let data: any = await res.json();
      return data;
    } catch (error) {
      alert(`${error} Failed to load details`);
    }
  }
}

class Logic {
  private getRecipe: GetRecipe = new GetRecipe();

  searchRecipe(): void {
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

  displayData(data: any): void {
    if (data === null) {
      this.noRecipe();
    } else {
      let display: string = "";
      data.forEach((item: any) => {
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

  checkNameLength(name: string): string {
    return name.length > 35 ? name.substring(0, 25) : name;
  }

  displayLabel(): void {
    if (!input.value) {
      searchName.textContent = "All available recipes";
    } else {
      searchName.textContent = `"${input.value}" related recipes`;
    }
    searchName.style.color = "orangeRed";
    inst.style.display = "none";
  }

  noRecipe(): void {
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

  getViewButtons(): void {
    const viewBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".view-recipe-btn");
  
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          const id: string | undefined = btn.dataset.id;
  
          if (id) {
            const target: HTMLElement | null = btn;
            if (target) {
              this.getTargetImage(target);
  
              const data = await this.getRecipe.getRecipeDetails(id);
              this.displayDetails(data);
              this.getExitBtn();
            } else {
              console.error("Invalid target element.");
            }
          } else {
            console.error("Invalid or missing 'data-id' attribute.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      });
    });
  }
  

  getTargetImage(target: HTMLElement): void {
    const parentElement = target.parentElement?.parentElement;
    const imgElement = parentElement?.children[0]?.children[0];
  
    if (imgElement instanceof HTMLImageElement) {
      singleImg = imgElement.src;
    } else {
      console.error("Invalid HTML structure. Unable to retrieve image source.");
    }
  }
  
  displayDetails(data: any): void {
    modal.classList.remove("hide");
    wrapper.classList.remove("hide");
    let display: string = `
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

  getExitBtn(): void {
    let exitBtn: HTMLElement = document.querySelector(".fa-circle-xmark") as HTMLElement;
    exitBtn.addEventListener("click", () => {
      this.closeModal();
    });
    wrapper.addEventListener("click", () => {
      this.closeModal();
    });
  }

  closeModal(): void {
    modal.classList.add("hide");
    wrapper.classList.add("hide");
  }
}

const logic: Logic = new Logic();
logic.searchRecipe();
