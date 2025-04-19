interface Pagination {
    currentPage: number;
    limitItems: number;
    totalPage?: number;
}

const paginationHelper = (
    pagination: Pagination,
    query: { page?: string },
    countProducts: number
): Pagination & { skip: number } => {

    if (query.page) {
        pagination.currentPage = parseInt(query.page);
    }

    const skip = (pagination.currentPage - 1) * pagination.limitItems;
    const totalPage = Math.ceil(countProducts / pagination.limitItems);

    return { ...pagination, skip, totalPage };
};

export default paginationHelper;
