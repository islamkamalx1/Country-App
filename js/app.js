const options = document.querySelector(".options");
const selectBtn = document.querySelector(".select");
const items = document.querySelectorAll(".item");
const cardContainer = document.querySelector(".card-container");
const search = document.getElementById("search");
const searchParent = document.querySelector(".search-parent");
const switchBtn = document.querySelector(".switch");
const switchIcon = document.querySelector(".fa-regular");
const countryModal = document.querySelector(".country-modal");

switchBtn.addEventListener("click", () => {
  switchIcon.classList.toggle("fa-solid");
  document.body.classList.toggle("dark");
});

selectBtn.addEventListener("click", () => {
  options.classList.toggle("active");
});

window.onclick = (e) => {
  if (!e.target.classList.contains("select")) {
    options.classList.remove("active");
  }
};

items.forEach((item) => {
  item.addEventListener("click", (e) => {
    options.classList.remove("active");
    const itemVal = e.target.textContent;
    selectBtn.value = itemVal;
    selectBtn.textContent = itemVal;
  });
});

async function fetchAllData() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();
  console.log(data);
  data.forEach((item) => {
    if (item.name.common === "Israel") {
      const index = data.indexOf(item);
      data.splice(index, 1);
    } else {
      showCountries(item);
    }
  });
}
fetchAllData();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showCountries(data) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<div class="image">
                      <img
                      src=${data.flags.png}
                      alt=${data.flags.alt}
                      />
                    </div>
                    <div class="info">
                      <h4 class="country-name">${data.name.common}</h4>
                      <p class="population"><span>Population: </span>${numberWithCommas(
                        data.population
                      )}</p>
                      <p class="region"><span>Region: </span>${data.region}</p>
                      <p class="capital"><span>Capital: </span>${
                        data.capital || "unknown"
                      }</p>
                    </div>`;

  cardContainer.appendChild(card);
  card.querySelector(".image").addEventListener("click", () => {
    document.body.classList.add("remove-scroll");
    showCountryDetails(data);
  });

  const countriesName = document.querySelectorAll(".country-name");
  const regionsName = document.querySelectorAll(".region");

  /* *** Search With Country Name *** */
  search.addEventListener("input", () => {
    [...countriesName].forEach((country) => {
      if (
        country.textContent.toLowerCase().includes(search.value.toLowerCase())
      ) {
        country.parentElement.parentElement.style.display = "grid";
      } else {
        country.parentElement.parentElement.style.display = "none";
      }
    });
  });

  /* *** Filter According To Region *** */
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      [...regionsName].forEach((region) => {
        if (
          region.textContent
            .toLowerCase()
            .includes(e.target.textContent.toLowerCase())
        ) {
          region.parentElement.parentElement.style.display = "grid";
        } else {
          region.parentElement.parentElement.style.display = "none";
        }
      });
    });
  });
}

function showCountryDetails(data) {
  countryModal.classList.toggle("show");
  countryModal.innerHTML = `
  <div class="container">
            <button class="back-btn">
              <i class="fa-solid fa-arrow-left-long"></i>Back
            </button>
            <div class="modal">
              <div class="county-image">
                <img
                  src=${data.flags.png}
                  alt=""
                />
              </div>
              <div class="details-container">
                <h1>${data.name.common}</h1>
                <div>
                  <div class="details-info-container">
                    <div class="left-info">
                      <p><span>Native Name: </span>${data.name.common}</p>
                      <p><span>Population: </span>${numberWithCommas(
                        data.population
                      )}</p>
                      <p><span>Region: </span>${data.region}</p>
                      <p><span>Sub Region: </span>${
                        data.subregion || "unknown"
                      }</p>
                      <p><span>Capital: </span>${data.capital || "unknown"}</p>
                    </div>
                    <div class="right-info">
                      <p><span>Top Level Domain: </span>${data.tld.map(
                        (ele) => ele
                      )}</p>
                      <p><span>Currencies: </span>${
                        (data.currencies &&
                          data.currencies.AED &&
                          data.currencies.AED.name) ||
                        "Unknown"
                      }</p>
                      <p><span>Languages: </span>${Object.values(
                        data.languages
                      )}</p>
                    </div>
                  </div>
                  <div class="border-countries">
                    <strong>Border Countries:</strong>
                    <div class= "border">
                        ${
                          (data.borders &&
                            data.borders.map(
                              (item) => `<span>${item}</span>`
                            )) ||
                          "Unknown"
                        }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;
  const backBtn = document.querySelector(".back-btn");

  backBtn.addEventListener("click", () => {
    countryModal.classList.toggle("show");
    document.body.classList.remove("remove-scroll");
  });
}
