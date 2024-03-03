import express from 'express';
import { SessionController } from '../Session/SessionController';
import { Request } from 'express';

const router = express.Router();
const sessionController = new SessionController();

// Route to create a session
router.post('/session/create', async (req, res) => {
    const { selectedGenres } = req.body;
    const { userId, films, sessionId } = await sessionController.createSession(selectedGenres);
    res.status(201).send({ userId, films, sessionId, message: 'Session created' });
});

// Route to add a user to a session
router.post('/session/add-user', (req, res) => {
    const { sessionId } = req.body;
    const { userId, films } = sessionController.addUserToSession(sessionId);
    res.send({ userId, films, message: 'User added to session' });
});

// Route to end a session
router.post('/session/vote', (req, res) => {
    const { sessionId, userId, votes } = req.body;
    sessionController.addVotesToSession(sessionId, userId, votes);
    res.send({ message: 'Session ended' });
});

// Route to get the winning film of a session
// Called frequently after client finished matches
router.get('/session/winning-films', (req: Request<{ sessionId: string }>, res) => {
    const { sessionId } = req.query;
    const winningFilmList = sessionController.getWinningFilms(sessionId as string);
    res.send({ winningFilmList });
});

// Route to see if matching has started
// Called frequently after client connects to session
router.get('/session/voting-started', (req: Request<{ sessionId: string }>, res) => {
    const { sessionId } = req.query;
    const votingStarted = sessionController.hasVotingStarted(sessionId as string);
    res.send({ votingStarted });
});

// Route to start voting
router.post('/session/start-voting', (req, res) => {
    const { sessionId } = req.body;
    sessionController.startVoting(sessionId);
    res.send({ message: 'Voting started' });
});

export default router;
