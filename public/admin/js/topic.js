// Button-change-Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const apiUrl = `/admin/topics/change-status/${statusChange}/${id}`

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
                        window.location.reload()
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
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này")

            if (isConfirm) {
                const id = button.getAttribute("data-id")

                const options = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }

                const link = `/admin/topics/delete/${id}`

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


// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )

        const typeChange = e.target.elements.type.value
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này")
            if (!isConfirm) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = []

            inputChecked.forEach(input => {
                const id = input.value

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`)
                } else {
                    ids.push(id)
                }
            })


            const apiUrl = '/admin/topics/change-multi'
            const options = {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ids: ids.join(", "),
                    type: typeChange
                })
            }
            fetch(apiUrl, options)
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        window.location.reload();
                    } else {
                        alert(data.message || "Có lỗi xảy ra!");
                    }
                })
                .catch(error => {
                    console.error("Error updating:", error);
                    alert("Có lỗi xảy ra khi gọi API!");
                });
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!")
        }
    })
}
// End Form change multi