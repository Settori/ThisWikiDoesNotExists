export type Article = {
    title: string,
    sections: {title: string, content: string}[],
    similarTopics: string[],
}