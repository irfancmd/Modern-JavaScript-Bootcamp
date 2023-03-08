const createAutoComplete = ({root, renderOption, onOptionSelected, inputValue, fetchData}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div> 
        </div>
    `;

    const input = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");

    const onInput = async event => {
        const items = await fetchData(event.target.value);

        // If no items are returned, hide the dropdown if 
        // it's active and do nothing
        if(!items.length) {
            dropdown.classList.remove("is-active");
            return
        }

        // Clear previous search results
        resultsWrapper.innerHTML = "";

        dropdown.classList.add("is-active");

        for(let item of items) {
            const suggession = document.createElement("a");

            suggession.classList.add("dropdown-item");
            suggession.innerHTML = renderOption(item);

            suggession.addEventListener("click", event => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);

                onOptionSelected(item);
            });

            resultsWrapper.appendChild(suggession);
        }
    };

    // Only call the search API if user stops typing for 1 second.
    // This will save us from API call limit exhaustion
    // This method of delaying is called debouncing of input
    input.addEventListener("input", debounceHelper(onInput, 1000));

    // This will detect click from any element as events eventually
    // get bubbled up to the parents
    document.addEventListener("click", event => {
        // If the user clicks anywhere other than the autocomplete widget,
        // close the dropdown
        if(!root.contains(event.target)) {
            dropdown.classList.remove("is-active");
        } 
    });
};