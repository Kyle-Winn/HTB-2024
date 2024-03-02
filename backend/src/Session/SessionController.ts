import { BroadcastEngine } from '../BroadcastEngine';
import { VoteTallier } from '../VoteTallier';
import { FilmDataFetcher, FilmData } from '../api/FilmDataFetcher';
import { UserIdGenerator } from './UserIdGenerator';

export interface SessionData {
    sessionId: string;
    userIds: string[];
    films: FilmData[];
    votingStarted: boolean;
    winningFilm?: filmId;
    votes: vote[];
    maxUsers: number;
    usersVoted: Set<userId>;
}

export interface UserSessionData {
    genres: string[];
    maxUsers: number;
}

export type vote = { filmId: filmId, match: boolean}
export type sessionId = string;
export type userId = string;
export type filmId = string;

/*
Flow,
1. One user creates session
2. Other users join session
3. Session starts (if max users reached), sends films to users
4. Users match films (purely frontend)
5. Users send votes to server
6. Once all votes sent, server tallies votes
7. Server sends winning movie to users
*/

export class SessionController {
    private sessionsMap: Map<sessionId, SessionData> = new Map<sessionId, SessionData>();
    private filmsPerSession = 10;

    private userIdGenerator = new UserIdGenerator();
    private filmDataFetcher = new FilmDataFetcher();
    private broadcastEngine = new BroadcastEngine();
    private voteTallier = new VoteTallier();

    async createSession(userSessionData: UserSessionData) {
        const sessionId = this.userIdGenerator.generateUniqueSessionId(this.sessionsMap);
        const userId = this.userIdGenerator.generateUniqueUserId();
        const filmsForSession = await this.fetchFilmsForSession();
        const sessionData: SessionData = {
            sessionId,
            userIds: [userId],
            films: filmsForSession,
            votingStarted: false,
            votes: [],
            maxUsers: userSessionData.maxUsers,
            usersVoted: new Set<userId>()
            // TODO: Date started, so we can end session after a certain time so no memory leaks
        };

        this.sessionsMap.set(sessionId, sessionData);
        return { userId: userId, films: sessionData.films};
    }

    addUserToSession(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');

        const users = sessionData.userIds;
        if (sessionData.maxUsers <= users.length) throw new Error('Session is full');

        const userId = this.userIdGenerator.generateUniqueUserId();
        users.push(userId);

        if (users.length === sessionData.maxUsers) sessionData.votingStarted = true;
        this.broadcastEngine.broadcastSessionStarted('Session started');

        return { userId: userId, films: sessionData.films }
    }

    private endSession(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');

        const winningFilmId = this.voteTallier.tallyVotes(sessionData.votes);
        this.broadcastEngine.broadcastWinningFilm(winningFilmId);
        sessionData.winningFilm = winningFilmId;

        this.sessionsMap.delete(sessionId);
        this.userIdGenerator.removeUsers(sessionData.userIds);
    }

    addVotesToSession(sessionId: sessionId, userId: userId, votes: vote[]) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');
        if (!sessionData.votingStarted) throw new Error('Voting has not started yet');

        sessionData.votes.push(...votes)
        sessionData.usersVoted.add(userId);

        const allUsersVoted = sessionData.maxUsers == sessionData.usersVoted.size;
        if (allUsersVoted) this.endSession(sessionId);
    }

    async fetchFilmsForSession(): Promise<FilmData[]> {
        return await this.filmDataFetcher.getXRandomFilms(this.filmsPerSession);;
    }
    
    getWinningFilm(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');
        if (!sessionData.winningFilm) throw new Error('Winning film not found');
        return sessionData.winningFilm;
    }

    hasVotingStarted(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');
        return sessionData.votingStarted;
    }
}
