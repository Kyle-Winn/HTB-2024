export type voteTally = {filmId: filmId, votes: number};
export type vote = { filmId: filmId, match: boolean}

export type filmId = string;
export type sessionId = string;
export type userId = string;

export type genre = 'action' | 'comedy' | 'drama' | 'horror' | 'romance' | 'sci-fi' | 'thriller';
