import { BroadcastEngine } from '../BroadcastEngine';
import { VoteTallier } from '../VoteTallier';
import { FilmDataFetcher, FilmData } from '../api/FilmDataFetcher';
import { UserIdGenerator } from './UserIdGenerator';
import { UserSessionData, filmId, sessionId, userId, vote } from '../../../shared/sharedTypes';

export interface SessionData {
    sessionId: string;
    userIds: string[];
    films: FilmData[];
    votingStarted: boolean;
    winningFilm?: filmId;
    votes: vote[];
    usersVoted: Set<userId>;
    dateStarted: Date;
}

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

// TODO: Start on seperate route, dont set max users on create
export class SessionController {
    private sessionsMap: Map<sessionId, SessionData> = new Map<sessionId, SessionData>();
    private filmsPerSession = 10;

    private userIdGenerator = new UserIdGenerator();
    private filmDataFetcher = new FilmDataFetcher();
    private broadcastEngine = new BroadcastEngine();
    private voteTallier = new VoteTallier();

    constructor() {this.startGarbageCollection();}

    private startGarbageCollection() {
        const checkInterval = 30 * 1000; // 30 seconds
        setInterval(() => {
            this.sessionsMap.forEach((sessionData, sessionId) => {
                const timeElapsed = new Date().getTime() - sessionData.dateStarted.getTime();
                const oneHour = 60 * 60 * 1000;
                if (timeElapsed > oneHour) this.sessionsMap.delete(sessionId);
            });
        }, checkInterval); // 30 seconds
    }

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
            usersVoted: new Set<userId>(),
            dateStarted: new Date()
        };

        this.sessionsMap.set(sessionId, sessionData);
        return { userId: userId, films: sessionData.films};
    }

    addUserToSession(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');

        const users = sessionData.userIds;
        const userId = this.userIdGenerator.generateUniqueUserId();
        users.push(userId);

        return { userId: userId, films: sessionData.films }
    }

    startVoting(sessionId: sessionId) {
        const sessionData = this.sessionsMap.get(sessionId);
        if (!sessionData) throw new Error('Session not found');
        sessionData.votingStarted = true;
        this.broadcastEngine.broadcastSessionStarted('Session started');
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

        const allUsersVoted = sessionData.userIds.length == sessionData.usersVoted.size;
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
