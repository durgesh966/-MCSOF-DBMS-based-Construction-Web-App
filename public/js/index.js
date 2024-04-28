function confirm_Delete() {
    var isConfirmed = confirm("Are you sure you want to delete?");
    if (isConfirmed) {
        document.getElementById('deleteForm').submit();
    }
}

// for Printing
function printPage() {
    window.print();
}

// popup hide 
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        let popup = document.getElementById('flash-message');
        if (popup) {
            popup.classList.add('fade');
            popup.classList.remove('show');
            setTimeout(function () {
                popup.remove();
            }, 1000);
        }
    }, 2000);
});

// for blank input field warning 
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     const email = document.getElementById('user_email').value;
//     const password = document.getElementById('user_password').value;
//     if (!email.trim() || !password.trim()) {
//         alert('Email and password are required.');
//         event.preventDefault();
//     }
// });

