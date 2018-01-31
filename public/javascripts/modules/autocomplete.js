function autocomplete(input, latInput, lngInput) {
    if (!input) return;

    // update latitude and longitude when a new address is selected
    const dropdown = new google.maps.places.Autocomplete(input);
    dropdown.addListener('place_changed', _ => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });

    // prevent enter key from triggering form submission
    input.on('keydown', event => {
        if (event.keyCode === 13) event.preventDefault();
    });
}

export default autocomplete;