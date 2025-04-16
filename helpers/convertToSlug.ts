import unidecode from 'unidecode'

export const convertToSlug = (text: string): string => {
    const unidecodedText = unidecode(text.trim())

    const slug = unidecodedText.replace(/\s+/g, '-') 
    
    return slug
}