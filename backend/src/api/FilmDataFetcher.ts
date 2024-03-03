import axios from 'axios';
import { genre } from '../../../shared/sharedTypes';
import { ChatGptSuggestor } from './ChatGptSuggestor';

export interface FilmData {
    title: string;
    year: string;
    rated: string;
    runtime: string;
    genre: string[];
    director: string;
    filmId: filmId;
    poster: string;
}

const movieTitles = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'The Godfather: Part',
    '12',
    'Schindler\'s List',
    'The Lord of the Rings: The Return of the King',
    'Pulp Fiction',
    'The Good, the Bad and the Ugly',
    'Fight Club',
    'Forrest Gump',
    'Inception',
    'The Lord of the Rings: The Fellowship of the Ring',
    'The Lord of the Rings: The Two Towers',
    'Star Wars: Episode V - The Empire Strikes Back',
    'The Matrix',
    'Goodfellas',
    'One Flew Over the Cuckoo\'s Nest',
    'Seven Samurai',
    'Se7en',
    'City of God',
    'The Silence of the Lambs',
    'It\'s a Wonderful Life',
    'Life Is Beautiful',
    'The Usual Suspects',
    'Léon: The Professional',
    'Spirited Away',
    'Saving Private Ryan',
    'American History X',
    'The Green Mile',
    'Interstellar',
    'Psycho',
];


type filmId = string;

export class FilmDataFetcher {
    private readonly API_KEY: string = '27eb4530';
    private readonly BASE_URL: string = `http://www.omdbapi.com/?apikey=${this.API_KEY}&`;

    private chatGptSuggestor: ChatGptSuggestor = new ChatGptSuggestor();

    private cachedFilmMaps: Map<string, FilmData> = new Map<filmId, FilmData>();

    async fetchFilm(title: string, year?: number): Promise<FilmData | undefined> {
        const isFilmCached = this.cachedFilmMaps.has(title);
        if (isFilmCached) return Promise.resolve(this.cachedFilmMaps.get(title) || undefined);

        const encodedTitle = encodeURIComponent(title);
        let url = `${this.BASE_URL}&type=movie&t=${encodedTitle}`;
      
        if (year) url += `&y=${year}`;
      
        try {
            const response = await axios.get<any>(url)
            if (response.status != 200) throw new Error(`HTTP error! status: ${response.status}`);

            const isFilmOkay = response.data.Response === "True";
            const filmData = this.parseFilmData(response.data);
            if (isFilmOkay) this.cachedFilmMaps.set(title, filmData);

            return isFilmOkay ? filmData : undefined;
        } catch (error) {
            console.error('There was a problem fetching the film data:', error);
            return undefined;
        }
    }

    getRandomFilmTitle(): string {
        const randomIndex = Math.floor(Math.random() * movieTitles.length);
        return movieTitles[randomIndex];
    }

    private parseFilmData(filmData: any): FilmData {
        return {
            title: filmData.Title,
            year: filmData.Year,
            rated: filmData.Rated,
            runtime: filmData.Runtime,
            genre: filmData.Genre.split(', '),
            director: filmData.Director,
            filmId: filmData.imdbID,
            poster: filmData.Poster
        };
    }

    async getXRandomFilms(x: number, genres: genre[]): Promise<FilmData[]> {
        const films: FilmData[] = [];
        const selectedTitles = new Set<string>();

        //this.chatGptSuggestor.getMovieTitles(genres, x);  //TODO: then loop through titles and fetch them
        while (films.length < x) {
            const randomTitle = this.getRandomFilmTitle();
    
            if (!selectedTitles.has(randomTitle)) {
                const film = await this.fetchFilm(randomTitle);
                if (!film) continue;
                films.push(film);
                selectedTitles.add(randomTitle);
            }
    
            if (selectedTitles.size >= movieTitles.length) break;
        }
        return films;
    }
}
