import { vote, voteTally } from "../../shared/sharedTypes";


export class VoteTallier {
    tallyVotes(votes: vote[]) {
        const filmAndVotes: voteTally[] = [];
        votes.forEach((vote) => {
            const filmId = vote.filmId;
            const filmVote = filmAndVotes.find((filmVote) => filmVote.filmId === filmId);
            if (filmVote) filmVote.votes++;
            else filmAndVotes.push({ filmId, votes: 1 });
        });

        const sortedFilmAndVotes = filmAndVotes.sort((a, b) => b.votes - a.votes);
        return sortedFilmAndVotes;
    }
}
