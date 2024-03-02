import { filmId, vote } from "./Session/SessionController";

type voteTally = {filmId: filmId, votes: number};

export class VoteTallier {
    tallyVotes(votes: vote[]) {
        const filmAndVotes: voteTally[] = [];
        votes.forEach((vote) => {
            const filmId = vote.filmId;
            const filmVote = filmAndVotes.find((filmVote) => filmVote.filmId === filmId);
            if (filmVote) filmVote.votes++;
            else filmAndVotes.push({ filmId, votes: 1 });
        });

        const winningFilm = filmAndVotes.reduce((acc, curr) => acc.votes > curr.votes ? acc : curr);
        return winningFilm.filmId;
    }
}
