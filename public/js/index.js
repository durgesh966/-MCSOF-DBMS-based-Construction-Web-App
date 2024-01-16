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