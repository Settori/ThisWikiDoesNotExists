import OpenAI from "openai";
import type {Article} from "~/types/wiki";

export const getRandomTopic = async (language: string): Promise<string> => {
    const { openAiSecret } = useRuntimeConfig().public;

    const client = new OpenAI({
        apiKey: openAiSecret,
        dangerouslyAllowBrowser: true,
    });

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: getLocalizedRandomTitlePrompt(language),
    });

    return response.output_text;
}

export const getWikiPage = async (topic: string, language: string): Promise<Article | null> => {
    const { openAiSecret } = useRuntimeConfig().public;

    const client = new OpenAI({
        apiKey: openAiSecret,
        dangerouslyAllowBrowser: true,
    });

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: [
            {"role": "system", "content": getLocalizedSystemPrompt(language)},
            {"role": "user", "content": getLocalizedUserPrompt(topic, language)}
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
                        section1Title: {
                            type: "string"
                        },
                        section1Content: {
                            type: "string"
                        },
                        section2Title: {
                            type: "string"
                        },
                        section2Content: {
                            type: "string"
                        },
                        section3Title: {
                            type: "string"
                        },
                        section3Content: {
                            type: "string"
                        },
                        section4Title: {
                            type: "string"
                        },
                        section4Content: {
                            type: "string"
                        },
                        similarTopics: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                    },
                    required: ["title", "section1Title", "section1Content", "section2Title", "section2Content", "section3Title", "section3Content", "section4Title", "section4Content", "similarTopics"],
                    additionalProperties: false,
                },
            }
        }
    });

    if (!response.output_text) {
        return null;
    }

    const data = JSON.parse(response.output_text);

    return {
        title: data?.title || '',
        sections: [
            {
                title: data?.section1Title || '',
                content: data?.section1Content || '',
            },
            {
                title: data?.section2Title || '',
                content: data?.section2Content || '',
            },
            {
                title: data?.section3Title || '',
                content: data?.section3Content || '',
            },
            {
                title: data?.section4Title || '',
                content: data?.section4Content || '',
            },
        ],
        similarTopics: data?.similarTopics,
    }
}

export const getRandomTopics = async (count: number, language: string): Promise<string[]> => {
    const { openAiSecret } = useRuntimeConfig().public;

    const client = new OpenAI({
        apiKey: openAiSecret,
        dangerouslyAllowBrowser: true,
    });

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: [
            {"role": "user", "content": getLocalizedRandomTitlesPrompt(count, language)}
        ],
        text: {
            format: {
                type: "json_schema",
                name: "wiki_page",
                schema: {
                    type: "object",
                    properties: {
                        topics: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                    },
                    required: ["topics"],
                    additionalProperties: false,
                },
            }
        }
    });

    return JSON.parse(response.output_text).topics;
}

const getLocalizedSystemPrompt = (language: string) => {
    if (language === 'pl') {
        return 'Generujesz fałszywą stronę wiki z tytułem, treścią podzieloną na sekcje i listą 10 powiązanych tematów. To jest dla zabawy, więc generuj losowe nieprawdziwe artykuły. Wszystkie artykuły muszą być powiązane z przeszłością lub teraźniejszością. Podziel treść na sekcje z tytułami. Każda treść sekcji musi mieć co najmniej 8 zdań.';
    }

    return 'You generate a fake wiki page with title, content divided into sections and list of 10 related topics. This is for fun purposes, so generate random an untrue articles. All articles has to be related to the past or present time. Divide content into sections with titles. Each section content has to have at least 8 sentences.';
}
const getLocalizedUserPrompt = (topic: string, language: string) => {
    if (language === 'pl') {
        return `Wygeneruj stronę wiki o temacie "${topic}"`;
    }

    return `Generate a wiki page about "${topic}"`;
}

const getLocalizedRandomTitlePrompt = (language: string) => {
    if (language === 'pl') {
        return 'Napisz tytuł dla losowej strony wiki. Może być głupi, nierealny i zabawny.';
    }

    return 'Write a title for a random wiki page. It can be silly and unreal, make it funny.';
}

const getLocalizedRandomTitlesPrompt = (count: number, language: string) => {
    if (language === 'pl') {
        return `Napisz ${count} tytułów dla losowej strony wiki. Może być głupi, nierealny i zabawny.`;
    }

    return `Write ${count} titles for a random wiki page. It can be silly and unreal, make it funny.`;
}

export const getDummyData = (): Article => {
    return {
        title: 'Homoseksualny związek Jarosława Kaczyńskiego i bezdomnego',
        sections: [
            {
                title: 'Tło wydarzenia',
                content: 'W historii współczesnej Polski niewiele plotek wywołało równie wiele kontrowersji, co rzekomy homoseksualny związek Jarosława Kaczyńskiego, lidera partii Prawo i Sprawiedliwość, z bezimiennym bezdomnym z Warszawy. Według miejskich legend, ich pierwsze spotkanie miało miejsce podczas spontanicznego spaceru po warszawskiej Starówce, gdzie Kaczyński, znany z zamiłowania do kotów i samotnych przechadzek, miał zauważyć bezdomnego śpiącego na ławce. Ich rozmowa miała być tak inspirująca, że obaj postanowili kontynuować spotkania. Temat szybko podchwyciły tabloidy, kreując sensacyjną opowieść. Relacje medialne sugerowały, że to wyjątkowa więź oparta na empatii i wzajemnym zrozumieniu. Historyjka zainteresowała również środowiska artystyczne, które stworzyły liczne parodie, piosenki i wiersze poświęcone temu tematowi. Choć informacja była niezweryfikowana, niektórzy komentatorzy polityczni snuli daleko idące spekulacje. Opowieści o tej znajomości na dobre zadomowiły się w polskiej popkulturze.'
            },
            {
                title: 'Przebieg i codzienność związku',
                content: 'Wieści donoszą, że związek Jarosława Kaczyńskiego i bezdomnego rozwijał się w ukryciu przed opinią publiczną. Według niepotwierdzonych źródeł, regularnie spotykali się w małej kawiarence nieopodal Placu Zbawiciela. Podczas tych spotkań dzielili się poglądami na temat polityki, filozofii i życia codziennego. Bezdomny, znany jako Pan Boguś, miał mieć wyjątkowy wpływ na decyzje polityczne Kaczyńskiego, co potwierdzają różne anegdoty opowiadane przez „świadków”. Publicysta jednej z gazet sugerował nawet, że niektóre kluczowe reformy powstały przy wspólnym stole w tej kawiarence. Mimo ogromnego ryzyka, obaj chcieli pozostać wierni swojej relacji i dzielić zarówno radości, jak i smutki. Informacje te wzbudzały kontrowersje zarówno wśród zwolenników, jak i przeciwników polityka. Powstały także piosenki uliczne na temat ich domniemanej codziennej rutyny. Wydaje się, że legenda narosła w znacznej mierze przez społeczne zapotrzebowanie na sensacje.',
            },
            {
                title: 'Reakcje społeczne i medialne',
                content: 'Temat homoseksualnego związku jednej z najważniejszych postaci polskiej polityki z osobą bezdomną był szeroko komentowany zarówno w kraju, jak i za granicą. Programy telewizyjne, radiowe oraz internetowe portale prześcigały się w szukaniu „dowodów” na rzekomą relację. Wśród społeczeństwa polskiego pojawiły się mieszane uczucia: od szoku, przez śmiech, aż po wybuchy gniewu zwolenników tradycyjnych wartości. Niektórzy publicyści oceniali, że plotka jest pożywką dla trolli internetowych i satyryków, którzy z zapałem tworzyli kolejne memy oraz filmiki na ten temat. Pojawiły się także głosy nawołujące do empatii i tolerancji wobec wszystkich osób, niezależnie od ich preferencji i statusu społecznego. Po stronie opozycji pojawiły się żarty, ale i pytania o prawdziwy wymiar życia osobistego polskich polityków. Z drugiej strony, środowiska konserwatywne zaprzeczały i wyśmiewały cały temat, uznając go za polityczną prowokację. Ostatecznie związek ten przeszedł do kategorii miejskich legend.'
            },
            {
                title: 'Miejsce związku w kulturze popularnej',
                content: 'W kolejnych latach historia o domniemanym homoseksualnym związku Jarosława Kaczyńskiego i bezdomnego stała się inspiracją dla twórców kultury popularnej. W teatrze powstały przynajmniej dwa przedstawienia nawiązujące do tego wątku, w których duet przedstawiany był jako alegoria niemożliwej, lecz prawdziwej bliskości. Znani malarze zorganizowali wspólną wystawę obrazów pt. „Polityka na ulicy”, gdzie postacie wzorowane na Kaczyńskim i bezdomnym były centralnym motywem. W internecie pojawiły się liczne pastisze i krótkie filmy animowane, opowiadające kolejne przygody nierozłącznej pary. Temat przedostał się także do satyry politycznej, stanowiąc pretekst do krytyki zjawisk społecznych i politycznych w Polsce. W niektórych kręgach uważano nawet, że meme inspirowany tą opowieścią wypromował tolerancję wobec osób LGBT. Dla młodszych odbiorców stał się natomiast żartem na lekcjach WOS-u czy podczas przerw w szkole. Mimo że cała historia nie ma żadnych podstaw w rzeczywistości, jej wpływ na popkulturę był widoczny przez długi czas. Na forach internetowych do dziś pojawiają się dyskusje i nowe interpretacje tej miejskiej legendy.'
            }
        ],
        similarTopics: [
            "Bla bla bla bla",
            "Ble ble ble ble",
            "Blu blu blu blu",
            "Bla bla bla bla",
            "Ble ble ble ble",
            "Blu blu blu blu",
            "Bla bla bla bla",
            "Ble ble ble ble",
            "Blu blu blu blu",
            "Bla bla bla bla",
        ]
    };
}