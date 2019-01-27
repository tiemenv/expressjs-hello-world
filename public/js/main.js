

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelectorAll('.js-delete-object').forEach((objectDeleteLink) => {
        objectDeleteLink.addEventListener("click", deleteUser);
    });
    document.querySelectorAll('.js-update-object').forEach((objectUpdateLink) => {
        objectUpdateLink.addEventListener("click", updateUser);
    });
}

function deleteUser(e) {
    let id = e.currentTarget.getAttribute("data-id");
    e.preventDefault();
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                fetch('/objects/delete/' + id, {
                    method: "DELETE"
                })
                    .then(function () {
                        window.location.replace('/');
                    });
            }
        });
}

function updateUser(e) {
    let id = e.currentTarget.getAttribute("data-id");
    e.preventDefault();
    swal("New name:", {
        content: "input",
    })
        .then((value) => {
            fetch('/objects/update/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"objectName":value})
            })
                .then(function () {
                    window.location.replace('/');
                });
        });
}