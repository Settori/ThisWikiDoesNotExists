import OpenAI from "openai";


export const getWikiPage = async (topic: string): Promise<object | null> => {
    const { openAiSecret } = useRuntimeConfig().public;

    const client = new OpenAI({
        apiKey: openAiSecret,
        dangerouslyAllowBrowser: true,
    });

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: [
            {"role": "system", "content": "You generate a fake wiki page with title, content and list of related topics. This is for fun purposes, so generate random an untrue articles. All articles has to be related to the past or present time"},
            {"role": "user", "content": `Generate a wiki page about ${topic}`}
        ],
        text: {
            format: {
                type: "json_schema",
                name: "wiki_page",
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string"
                        },
                        content: {
                            type: "string"
                        },
                        similarTopics: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                    },
                    required: ["title", "content", "similarTopics"],
                    additionalProperties: false,
                },
            }
        }
    });

    if (!response.output_text) {
        return null;
    }

    return JSON.parse(response.output_text);
}