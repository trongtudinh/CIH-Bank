document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  const phoneInput = document.getElementById("phone-number");
  const phoneError = document.getElementById("phone-error");
  const btnNext1 = document.getElementById("btn-next-1");

  const btnNext2 = document.getElementById("btn-next-2");

  const countryPicker = document.getElementById("country-picker");
  const selectedFlag = document.getElementById("selected-flag");
  const selectedDialCode = document.getElementById("selected-dial-code");
  const btnNext3 = document.getElementById("step-3");

  const popup = document.getElementById("country-popup");
  const countryList = document.getElementById("country-list");
  const countrySearchInput = document.getElementById("country-search");
  const closePopupBtn = document.querySelector(".close-popup");
  const countryPickerStep2 = document.getElementById("country-picker-step2");
  const placeholderStep2 =
    countryPickerStep2.querySelector(".placeholder-step2");

  let countries = [];
  let selectedCountry = null;

  function showStep(stepNumber) {
    steps.forEach((s, i) => {
      s.classList.toggle("active", i === stepNumber - 1);
    });
  }

  function updatePhoneButtonState() {
    const phone = phoneInput.value.trim();
    const isValid = !!phone;
    btnNext1.disabled = !isValid;
  }

  phoneInput.addEventListener("input", updatePhoneButtonState);

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    setTimeout(() => popup.classList.add("hidden"), 300);
  });

  countryPickerStep2.addEventListener("click", () => {
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("active"), 10);

    countryList.querySelectorAll(".country-item").forEach((item) => {
      const nameEl = item.querySelector(".country-item-name");
      const flagEl = item.querySelector("img");

      item.onclick = () => {
        selectedCountry = nameEl.textContent;
        const flagSrc = flagEl.getAttribute("src");
        const flagAlt = flagEl.getAttribute("alt");

        placeholderStep2.innerHTML = `
            <img src="${flagSrc}" alt="${flagAlt}" class="flag-icon" />
            <span class="country-name-step2">${selectedCountry}</span>
        `;

        popup.classList.remove("active");
        setTimeout(() => popup.classList.add("hidden"), 300);
      };
    });
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
        popup.classList.remove("active");
        setTimeout(() => popup.classList.add("hidden"), 300);
        countryPicker.dataset.dialCode = country.dial_code;
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
          popup.classList.remove("active");
          setTimeout(() => popup.classList.add("hidden"), 300);
          countryPicker.dataset.dialCode = country.dial_code;
        });
        countryList.appendChild(item);
      });
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

  btnNext1.addEventListener("click", () => {
    const phone = phoneInput.value.trim();
    if (!/^[0-9]{6,15}$/.test(phone)) {
      phoneError.classList.remove("hidden");
    } else {
      phoneError.classList.add("hidden");
      const dialCode = countryPicker.dataset.dialCode || "";
      selectedPhone = `${dialCode} ${phone}`;
      showStep(2);
    }
  });

  btnNext2.addEventListener("click", () => {
    if (!selectedCountry) {
      showStep(4);
    } else {
      showStep(3);
    }
  });

  btnNext3.addEventListener("click", () => {
    showStep(4);
  });

  updatePhoneButtonState();
});
