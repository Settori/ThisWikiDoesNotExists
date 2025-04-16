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
    console.log("generowanie strony wiki")
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
        title: 'Buraczany Zegarek Czasoprzestrzenny',
        sections: [
            {
                title: 'Historia Powstania',
                content: 'Buraczany Zegarek Czasoprzestrzenny swoją genezę zawdzięcza niecodziennym badaniom prowadzonym na początku XXI wieku w Instytucie Rzeczy Niepotrzebnych w Pińczowie. Grupa naukowców wpadła na pomysł połączenia biologii z kwantową teorią czasu podczas eksperymentów na burakach cukrowych. Legendarny profesor Eugeniusz Miazga, uznawany za ojca tego urządzenia, twierdził, że pewne warzywa posiadają ukryte właściwości temporalne. Pierwszy prototyp powstał w roku 2008 i początkowo służył do odmierzania czasu fermentacji kiszonek. Już po kilku miesiącach odkryto, że zegarek sam zmienia godzinę w zależności od pozycji użytkownika w czasoprzestrzeni. Szybko zainteresowały się nim zarówno kucharki, jak i amatorzy podróży w czasie. Wykorzystywano go także w tajnych eksperymentach wojskowych, jednak ich wyniki nigdy nie zostały ujawnione. Projekty dalszego rozwoju zegarka wciąż trwają, lecz do dziś zachowano wiele tajemnic konstrukcyjnych.',
            },
            {
                title: 'Zasada Działania',
                content: 'Kluczowym składnikiem Buraczanego Zegarka Czasoprzestrzennego jest specjalnie wyhodowany burak energetyczny, którego struktura komórkowa generuje słabe impulsy elektromagnetyczne. Impulsy te wykorzystywane są do tworzenia mikroskopijnych zakrzywień czasoprzestrzennych. Zegarek posiada wskaźnik analogowy napędzany mikroprądnica z buraka i cyfrowy wyświetlacz, który sam synchronizuje się z najbliższą linią czasu. Użytkownik może wybrać, czy chce śledzić upływ czasu liniowego, czy też czas lokalny wedle porządku historycznego wybranego regionu. Gdy urządzenie wykryje zaburzenie w czasoprzestrzeni, wskazówki zaczynają obracać się w przeciwną stronę, a burak świeci delikatnym purpurowym światłem. Specjalna membrana z wosku pszczelego chroni wnętrze zegarka przed wysychaniem i utratą właściwości kwantowych. Urządzenie jest całkowicie ekologiczne i rozkłada się po zakończeniu działania. Można też zmienić tryb zegarka na „kiszonkowy”, co pozwala na ręczną regulację strumienia czasu.',
            },
            {
                title: 'Praktyczne Zastosowania',
                content: 'W pierwszych latach użytkowania Buraczany Zegarek Czasoprzestrzenny znalazł wiernych fanów wśród ogrodników i historyków. W Polskim Związku Kulinarno-Temporalnym urządzenie stało się podstawowym narzędziem do ustalania autentycznych receptur kuchni regionalnej w poszczególnych epokach. Kilka egzemplarzy używanych było przez turystów historycznych do omijania okresów nieurodzaju. Zegarek przydał się również podczas kilku eksperymentów teleportacyjnych w laboratoriach w Namysłowie, gdzie jego wytrzymałość na skoki czasowe uznano za przełomową. W ochronie środowiska wykorzystywano zegarek do obserwacji wzrostu roślin w alternatywnych liniach czasu, co pozwoliło przewidywać niektóre katastrofy rolnicze. Jego popularność rosła także wśród kolekcjonerów osobliwych przedmiotów, którzy cenili go za unikalność i walory estetyczne. Pojawiły się nawet plotki, że zegarek został raz wykorzystany do przywrócenia czasu młodości pewnej marchewki. Mimo kontrowersji, do dziś zachwyca i zadziwia użytkowników na całym świecie.',
            },
            {
                title: 'Współczesne Mity i Kontrowersje',
                content: 'Ze względu na niezwykłe właściwości Buraczanego Zegarka Czasoprzestrzennego narosło wokół niego wiele mitów i legend. Najsłynniejsza z nich mówi, że jeśli ustawić zegarek pomiędzy dwiema beczkami kiszonych buraków, można na chwilę zobaczyć przeszłość własnego podwórka. Inni twierdzą, że urządzenie spontanicznie resetuje się podczas pełni księżyca, co miało rzekomo doprowadzić do zagubienia podróżnika w roku 1822. Pojawiały się także głosy, że zegarek sprzyja tylko osobom z dokładnie 12 złotymi zębami, jednak naukowcy nie potwierdzili tych opinii. Krytycy twierdzą, iż rozkładający się burak może prowadzić do nieprzewidywalnych wahań mieszkania w czasoprzestrzeni, zwłaszcza w blokach z wielkiej płyty. Kontrowersje budzi także brak zgody co do patentu konstrukcji oraz ochrony praw autorskich. Mimo tego spirala entuzjazmu wokół zegarka nie maleje. Nieustannie trwają debaty na temat jego bezpieczeństwa w codziennym użyciu, jak również wpływu na tradycyjne obrzędy świąteczne. Niektórzy sugerują, że bez buraczanego zegarka trudno dziś wyznaczyć prawdziwy czas w żadnej rodzinie.',
            }
        ],
        similarTopics: [
            "Bla bla bla bla",
            "Ble ble ble ble",
            "Blu blu blu blu",
        ]
    };
}