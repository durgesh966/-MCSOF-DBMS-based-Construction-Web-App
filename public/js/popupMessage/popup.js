function showSuccessMessage(message) {
    const successAlert = document.getElementById('successAlert');
    successAlert.textContent = message;
    successAlert.classList.remove('d-none');
}

fetch('show_search_contact')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        showSuccessMessage(data.message);
    })
    .catch(error => {
        console.error('Error fetching success message:', error);
    });
