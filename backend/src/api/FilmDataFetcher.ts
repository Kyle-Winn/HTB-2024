import axios from 'axios';

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

type filmId = string;

export class FilmDataFetcher {
    private readonly API_KEY: string = '27eb4530';
    private readonly BASE_URL: string = `http://www.omdbapi.com/?apikey=${this.API_KEY}&`;

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

    // TODO: One from each genre randomly or something. They select genres, random from those genres.
    getRandomFilmTitle(): string {
        const titles = [
            'The Shawshank Redemption',
            'The Godfather',
            'The Dark Knight',
            'The Godfather: Part II',
            '12'
        ];
        const randomIndex = Math.floor(Math.random() * titles.length);
        return titles[randomIndex];
    }

    private parseFilmData(filmData: any): FilmData {
        return {
            title: filmData.Title,
            year: filmData.Year,
            rated: filmData.Rated,
            runtime: filmData.Runtime,
            genre: filmData.Genre,
            director: filmData.Director,
            filmId: filmData.imdbID,
            poster: filmData.Poster
        };
    }

    // TODO: Duplicates
    async getXRandomFilms(x: number): Promise<FilmData[]> {
        const films: FilmData[] = [];
        for (let i = 0; i < x; i++) {
            const randomTitle = this.getRandomFilmTitle();
            const film = await this.fetchFilm(randomTitle);
            if (film) films.push(film);
        }
        return films;
    }
}
