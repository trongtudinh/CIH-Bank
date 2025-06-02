document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone-number");
  const phoneError = document.getElementById("phone-error");
  const btnNext1 = document.getElementById("btn-next-1");
  const countryPicker = document.getElementById("country-picker");
  const selectedFlag = document.getElementById("selected-flag");
  const selectedDialCode = document.getElementById("selected-dial-code");
  const popup = document.getElementById("country-popup");
  const countryList = document.getElementById("country-list");
  const countrySearchInput = document.getElementById("country-search");
  const closePopupBtn = document.querySelector(".close-popup");
  const phoneForm = document.getElementById("phone-form");
  const hiddenDialCodeInput = document.getElementById("hidden-dial-code");

  let countries = [];
  let phoneRegexMap = {};

  function updatePhoneButtonState() {
    const phone = phoneInput.value.trim();
    const dialCode = countryPicker.dataset.dialCode || "";
    const regex = phoneRegexMap[dialCode];
    const isValid = regex.test(phone);
    btnNext1.disabled = !isValid;
  }

  phoneInput.addEventListener("input", updatePhoneButtonState);

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    setTimeout(() => popup.classList.add("hidden"), 300);
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
        <span class="dial">+${country.dial_code}</span>
      `;
      item.addEventListener("click", () => {
        selectedFlag.src = `assets/icons/${country.flag}`;
        selectedDialCode.textContent = `+${country.dial_code}`;
        countryPicker.dataset.dialCode = country.dial_code;
        hiddenDialCodeInput.value = `+${country.dial_code}`;
        popup.classList.remove("active");
        setTimeout(() => popup.classList.add("hidden"), 300);
        updatePhoneButtonState();
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
            <span class="dial">+${country.dial_code}</span>
        `;
        item.addEventListener("click", () => {
          selectedFlag.src = `assets/icons/${country.flag}`;
          selectedDialCode.textContent = `+${country.dial_code}`;
          countryPicker.dataset.dialCode = country.dial_code;
          hiddenDialCodeInput.value = `+${country.dial_code}`; 
          popup.classList.remove("active");
          setTimeout(() => popup.classList.add("hidden"), 300);
        });
        countryList.appendChild(item);
      });

      const defaultCountry = data.find((c) => c.code === "fr");
      if (defaultCountry) {
        selectedFlag.src = `assets/icons/${defaultCountry.flag}`;
        selectedDialCode.textContent = `+${defaultCountry.dial_code}`;
        countryPicker.dataset.dialCode = defaultCountry.dial_code;
        hiddenDialCodeInput.value = `+${defaultCountry.dial_code}`;
      }
    });

  fetch("phone_regex.json")
    .then((res) => res.json())
    .then((data) => {
      for (const dialCode in data) {
        phoneRegexMap[dialCode] = new RegExp(data[dialCode]);
      }
    });

  countryPicker.addEventListener("click", () => {
    if (popup.classList.contains("active")) {
      popup.classList.remove("active");
      setTimeout(() => popup.classList.add("hidden"), 300);
    } else {
      popup.classList.remove("hidden");
      setTimeout(() => popup.classList.add("active"), 10);
    }
  });

  phoneForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    const dialCode = countryPicker.dataset.dialCode || "";
    const regex = phoneRegexMap[dialCode];
    if (!regex || !regex.test(phone)) {
      phoneError.classList.remove("hidden");
    } else {
      phoneError.classList.add("hidden");
      phoneForm.submit(); 
    }
  });

  updatePhoneButtonState();
});
