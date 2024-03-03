import { vote, voteTally } from "../../shared/sharedTypes";


export class VoteTallier {
    tallyVotes(votes: vote[]) {
        const filmAndVotes: voteTally[] = [];
        votes.forEach((vote) => {
            const filmId = vote.filmId;
            const filmVote = filmAndVotes.find((filmVote) => filmVote.filmId === filmId);

            if (filmVote) filmVote.votes.push(vote.match);
            else filmAndVotes.push({ filmId, votes: [vote.match] });
        });

        return filmAndVotes;
    }
}
