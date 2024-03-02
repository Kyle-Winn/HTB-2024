export enum Direction {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface Card {
    id: string;
}

export interface Movie {
    filmId: string;
    title: number;
    year: string;
    rated: number;
    runtime: string;
    director: string;
    genre: string[];
    poster: string,
}

export interface Genre {
    genre: string;
    selected: boolean;
}

export type vote = { filmId: string, match: boolean}

export const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western'];