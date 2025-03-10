document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://restcountries.com/v3.1/name/";
    const countryInput = document.getElementById("countryInput");
    const detailsDiv = document.getElementById("details");
    const bordersDiv = document.getElementById("borders");

    async function fetchCountryInfo() {
        const countryName = countryInput.value.trim();

        if (!countryName) {
            showError("Please enter a country name.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}${countryName}?fullText=true`);
            
            if (!response.ok) {
                throw new Error("Country not found. Please check the name.");
            }

            const data = await response.json();
            displayCountryInfo(data[0]);
        } catch (error) {
            showError(error.message);
        }
    }

    function displayCountryInfo(country) {
        detailsDiv.innerHTML = `
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="150">
        `;

        fetchBorderCountries(country.borders || []);
    }

    async function fetchBorderCountries(borderCodes) {
        bordersDiv.innerHTML = "";

        if (borderCodes.length === 0) {
            bordersDiv.innerHTML = "<p>No bordering countries.</p>";
            return;
        }

        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            const allCountries = await response.json();

            const borderCountries = allCountries.filter(country => borderCodes.includes(country.cca3));

            borderCountries.forEach(borderCountry => {
                const countryDiv = document.createElement("div");
                countryDiv.classList.add("border-country");
                countryDiv.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}">
                `;
                bordersDiv.appendChild(countryDiv);
            });
        } catch (error) {
            showError("Error fetching bordering countries.");
        }
    }

    function showError(message) {
        detailsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
        bordersDiv.innerHTML = "";
    }

    window.fetchCountryInfo = fetchCountryInfo; 
});
