export enum Direction {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface Card {
    id: string;
}

export interface Movie {
    id: string;
    rating: number;
    title: string;
    year: number;
    description: string;
    image: string;
    tags: string[];
}

export interface Genre {
    genre: string;
    selected: boolean;
}


export const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western'];