document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("country-popup");
  const countryList = document.getElementById("country-list");
  const countrySearchInput = document.getElementById("country-search");
  const closePopupBtn = document.querySelector(".close-popup");
  const countryPickerStep2 = document.getElementById("country-picker-step2");
  const placeholderStep2 = countryPickerStep2.querySelector(".placeholder-step2");
  const btnNext2 = document.getElementById("btn-next-2");
  const countryForm = document.getElementById("country-form");

  let countries = [];
  let selectedCountry = null;

  function updateButtonState() {
    btnNext2.disabled = !selectedCountry;
  }

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    setTimeout(() => popup.classList.add("hidden"), 300);
  });

  countryPickerStep2.addEventListener("click", () => {
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("active"), 10);
  });

  countrySearchInput.addEventListener("input", () => {
    const query = countrySearchInput.value.toLowerCase().trim();
    countryList.innerHTML = "";
    const filteredCountries = countries.filter((c) =>
      c.name.toLowerCase().includes(query)
    );

    filteredCountries.forEach((country) => {
      const item = document.createElement("div");
      item.className = "country-item";
      item.innerHTML = `
        <div class="country-item-inner">
            <img src="assets/icons/${country.flag}" alt="${country.code}" />
            <span class="country-item-name">${country.name}</span>
        </div>
        <span class="dial"></span>
      `;
      item.addEventListener("click", () => {
        selectedCountry = country.name;
        const flagSrc = `assets/icons/${country.flag}`;
        const flagAlt = country.code;
        placeholderStep2.innerHTML = `
          <img src="${flagSrc}" alt="${flagAlt}" class="flag-icon" />
          <span class="country-name-step2">${selectedCountry}</span>
        `;
        popup.classList.remove("active");
        setTimeout(() => popup.classList.add("hidden"), 300);
        updateButtonState();
      });
      countryList.appendChild(item);
    });
  });

  fetch("countries_sorted.json")
    .then((res) => res.json())
    .then((data) => {
      countries = data;
      data.forEach((country) => {
        const item = document.createElement("div");
        item.className = "country-item";
        item.innerHTML = `
            <div class="country-item-inner">
                <img src="assets/icons/${country.flag}" alt="${country.code}" />
                <span class="country-item-name">${country.name}</span>
            </div>
            <span class="dial"></span>
        `;
        item.addEventListener("click", () => {
          selectedCountry = country.name;
          const flagSrc = `assets/icons/${country.flag}`;
          const flagAlt = country.code;
          placeholderStep2.innerHTML = `
            <img src="${flagSrc}" alt="${flagAlt}" class="flag-icon" />
            <span class="country-name-step2">${selectedCountry}</span>
          `;
          popup.classList.remove("active");
          setTimeout(() => popup.classList.add("hidden"), 300);
          updateButtonState();
        });
        countryList.appendChild(item);
      });
    });

  countryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedCountry) {
    } else {
      sessionStorage.setItem("selectedCountry", selectedCountry);
    }
  });

  updateButtonState();
});