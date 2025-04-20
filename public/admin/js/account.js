// Button-change-Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const apiUrl = `/admin/accounts/change-status/${statusChange}/${id}`

            const options = {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: statusChange })
            };

            fetch(apiUrl, options)
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        window.location.reload();
                    } else {
                        console.error("Failed to update status:", data.message);
                    }
                })
                .catch(error => {
                    console.error("Error updating status:", error);
                });
        })
    })
}


// Delete item
const buttonDelete = document.querySelectorAll("[button-delete]")
if (buttonDelete.length > 0) {
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa tài khoản này")

            if (isConfirm) {
                const id = button.getAttribute("data-id")

                const options = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }

                const link = `/admin/accounts/delete/${id}`

                fetch(link, options)
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 200) {
                            window.location.reload()
                        } else {
                            alert(data.message)
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting item:", error);
                    });
            }
        })
    })
}

