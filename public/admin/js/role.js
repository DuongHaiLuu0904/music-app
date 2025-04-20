// Delete item
const buttonDelete = document.querySelectorAll("[button-delete]")
if (buttonDelete.length > 0) {
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa quyền này")

            if (isConfirm) {
                const id = button.getAttribute("data-id")

                const options = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }

                const link = `/admin/roles/delete/${id}`

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
// End delete item


// Permission
const tablePermission = document.querySelector('[table-permission]');
if(tablePermission) {
    const buttonSubmit = document.querySelector('[button-submit]');
   
    buttonSubmit.addEventListener("click", () => {
        let permissions = []
        const rows = tablePermission.querySelectorAll("tr[data-name]")

        rows.forEach(row => {
            const name = row.getAttribute("data-name")
            const inputs = row.querySelectorAll("input")

            if(name == "id") {
                inputs.forEach(input => {
                    const id = input.value
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked
                    if(checked) {
                        permissions[index].permissions.push(name)
                    }
                })
            }
        })

        if(permissions.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permission")
            const inputPermissions = document.querySelector("input[name ='permission']")
            inputPermissions.value = JSON.stringify(permissions)
            formChangePermission.submit()
        }
    })
}
// End Permission

// Permission Data Default
const dataRecords = document.querySelectorAll('[data-records]')
if(dataRecords) {
    const records = JSON.parse(dataRecords[0].getAttribute("data-records"))
    
    const tablePermission = document.querySelector('[table-permission]')
    
    records.forEach((record, index)=> {
        const permissions = record.permissions

        permissions.forEach(per => {
            const row = tablePermission.querySelector(`[data-name="${per}"]`)
            const input = row.querySelectorAll("input")[index]
            input.checked = true
        })
    })
}
// End Permission Data Default