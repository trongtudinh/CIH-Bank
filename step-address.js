// step-address.js
// Logic for enabling Confirm button and handling country picker (reuse from step-country.js)
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("country-popup-address");
    const countryList = document.getElementById("country-list-address");
    const countrySearchInput = document.getElementById("country-search-address");
    const closePopupBtn = document.querySelector("#country-popup-address .close-popup");
    const countryPicker = document.getElementById("country-picker-address");
    const placeholder = document.getElementById("placeholder-address");
    const btnConfirm = document.getElementById("btn-confirm-address");
    const addressForm = document.getElementById("address-form");
    const hiddenCountryInput = document.getElementById("hidden-country-address");
    const address1 = document.getElementById('address1');
    const address2 = document.getElementById('address2');
    const postcode = document.getElementById('postcode');

    let countries = [];
    let selectedCountry = null;

    function updateButtonState() {
        btnConfirm.disabled = !(
            address1.value.trim() &&
            address2.value.trim() &&
            postcode.value.trim() &&
            selectedCountry
        );
    }

    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("active");
        setTimeout(() => popup.classList.add("hidden"), 300);
    });

    countryPicker.addEventListener("click", () => {
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
                placeholder.innerHTML = `
                    <img src="${flagSrc}" alt="${flagAlt}" class="flag-icon" />
                    <span class="country-name-step2">${selectedCountry}</span>
                `;
                hiddenCountryInput.value = selectedCountry;
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
                    placeholder.innerHTML = `
                        <img src="${flagSrc}" alt="${flagAlt}" class="flag-icon" />
                        <span class="country-name-step2">${selectedCountry}</span>
                    `;
                    hiddenCountryInput.value = selectedCountry;
                    popup.classList.remove("active");
                    setTimeout(() => popup.classList.add("hidden"), 300);
                    updateButtonState();
                });
                countryList.appendChild(item);
            });
        });

    address1.addEventListener('input', updateButtonState);
    address2.addEventListener('input', updateButtonState);
    postcode.addEventListener('input', updateButtonState);

    addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (
            address1.value.trim() &&
            address2.value.trim() &&
            postcode.value.trim() &&
            selectedCountry
        ) {
            addressForm.submit();
        }
    });

    updateButtonState();
});
