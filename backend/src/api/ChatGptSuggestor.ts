import { genre } from './../../../shared/sharedTypes';
import axios from 'axios';

export class ChatGptSuggestor {
    private readonly apiKey: string | undefined;
    private readonly endpoint: string = 'https://api.openai.com/v1/completions';

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || undefined;
    }

    async getMovieTitles(genres: genre[], titlesAmount: number) {
        //await this.queryOpenAI(genres, titlesAmount);
    }

    private async queryOpenAI(genres: genre[], titleNumber: number): Promise<void> {
        let prompt;
        if (genres) prompt = `Can you give me ${titleNumber} movie titles under these genres: ${genres.join(', ')}?`
        else prompt = `Can you give me ${titleNumber} popular movie titles?`

        try {
            const response = await axios.post(this.endpoint,
                {
                    model: 'gpt-3.5-turbo-1106',
                    prompt: prompt,
                    temperature: 0.7,
                    max_tokens: 100,
                    top_p: 1.0,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            console.log('Response:', response.data.choices[0].text.trim());
        } catch (error) {
            console.error('Error querying OpenAI:', error);
        }
    }
}
