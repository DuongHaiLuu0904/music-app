interface FilterStatus {
    name: string;
    status: string;
    class: string;
}

export default (query: { status?: string }): FilterStatus[] => {
    let filterStatus: FilterStatus[] = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status === query.status);
        if (index !== -1) {
            filterStatus[index].class = "active";
        }
    } else {
        const index = filterStatus.findIndex(item => item.status === "");
        if (index !== -1) {
            filterStatus[index].class = "active";
        }
    }

    return filterStatus;
}