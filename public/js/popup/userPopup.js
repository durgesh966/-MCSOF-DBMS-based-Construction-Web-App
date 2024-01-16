// ------------- popup when contect form submiting 
function submitContactForm() {
    const contactForm = document.getElementById('ContactForm');
    const formData = new FormData(contactForm);

    fetch('/contactUs_form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success').then(() => {
                    });
                } else {
                    Swal.fire('Error', jsonData.message, 'error');
                }
            } catch (error) {
                console.log('HTML Response:', result);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                const scriptElement = tempDiv.querySelector('script');
                if (scriptElement) {
                    eval(scriptElement.textContent);
                }
            }
        })
        .catch(error => {
            console.error('Error submitting login form:', error);
        });
}


// -------------- popup when new employee joining form submitted 
function submitNewEmployeeForm() {
    const newEmployeeForm = document.getElementById('register');
    const newData = new FormData(newEmployeeForm);

    fetch('/new_employees_joining_form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(newData).toString(),
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success').then(() => {
                    });
                } else {
                    Swal.fire('Error', jsonData.message, 'error');
                }
            } catch (error) {
                console.log('HTML Response:', result);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                const scriptElement = tempDiv.querySelector('script');
                if (scriptElement) {
                    eval(scriptElement.textContent);
                }
            }
        })
        .catch(error => {
            console.error('Error submitting login form:', error);
        });
}


// -------------- popup when user book a service -
function submitServiceForm() {
    const newEmployeeForm = document.getElementById('book_Service');
    const newData = new FormData(newEmployeeForm);

    fetch('/booking_service', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(newData).toString(),
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success').then(() => {
                    });
                } else {
                    Swal.fire('Error', jsonData.message, 'error');
                }
            } catch (error) {
                console.log('HTML Response:', result);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                const scriptElement = tempDiv.querySelector('script');
                if (scriptElement) {
                    eval(scriptElement.textContent);
                }
            }
        })
        .catch(error => {
            console.error('Error submitting login form:', error);
        });
}