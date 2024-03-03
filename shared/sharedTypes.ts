export type voteTally = {filmId: filmId, votes: likeRating[]};
export type vote = { filmId: filmId, match: likeRating}
export type likeRating = 0 | 1 | 1.8

export type filmId = string;
export type sessionId = string;
export type userId = string;

export type genre = 'action' | 'comedy' | 'drama' | 'horror' | 'romance' | 'sci-fi' | 'thriller';
