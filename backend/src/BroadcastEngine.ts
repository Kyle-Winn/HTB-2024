import { voteTally } from "../../shared/sharedTypes";

export class BroadcastEngine {
    broadcastWinningFilm(message: voteTally[]) {
        for (const vote of message) {
            console.log(vote.filmId, vote.votes);
        }
    }

    broadcastSessionStarted(message: string) {
        // todo
        console.log(message);
    }
}
