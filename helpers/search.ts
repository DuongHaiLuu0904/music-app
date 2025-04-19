import { convertToSlug } from "./convertToSlug";

type SearchResult = { 
    keyword: string; 
    regex?: RegExp,
    keywordSlug?: RegExp
};

const searchHelper = (query: { keyword?: string }): SearchResult => {
    const objectSearch: SearchResult = { keyword: "" };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        objectSearch.regex = new RegExp(query.keyword, "i");
        objectSearch.keywordSlug = new RegExp(convertToSlug(query.keyword), 'i')
    }

    return objectSearch;
}

export default searchHelper;
