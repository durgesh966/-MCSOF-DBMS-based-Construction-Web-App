
function submitForm() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);

    fetch('/login', {
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

// popup for admin Signup
function adminSignupForm() {
    const signupForm = document.getElementById('signup_Form');
    const signupFormData = new FormData(signupForm);

    fetch('/adSignup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(signupFormData).toString(),
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success');
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
}


// popup for add employees data
function addEmployeeDataForm() {
    const addEmployee = document.getElementById('addEmployees');
    const Data = new FormData(addEmployee);

    fetch('/registration_worker', {
        method: 'POST',
        headers: {},
        body: Data,
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success');
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
}

// popup for add Service data
function addServiceDataForm() {
    const formData = document.getElementById('addService');
    const formDataRequest = new FormData(formData);
    fetch('/add-services', {
        method: 'POST',
        headers: {},
        body: formDataRequest,
    })
        .then(response => response.text())
        .then(result => {
            try {
                const jsonData = JSON.parse(result);
                if (jsonData.success) {
                    Swal.fire('Success', jsonData.message, 'success');
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
}

// popup for add Service data
function addWorkDetails() {
    const formData = document.getElementById('addWork');
    const workFormData = new FormData(formData);

    fetch('/add_working_details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(workFormData).toString(),
    }).then(response => response.text()).then(result => {
        try {
            const jsonData = JSON.parse(result);
            if (jsonData.success) {
                Swal.fire('Success', jsonData.message, 'success');
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
}

