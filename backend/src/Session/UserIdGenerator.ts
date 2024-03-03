import { sessionId, userId } from "../../../shared/sharedTypes";
import { SessionData } from "./SessionController";

export class UserIdGenerator {
    private userIds: string[] = [];

    private readonly sessionIdLength = 4;
    private readonly userIdLength = 8;
    private readonly characters = '0123456789';

    generateUniqueSessionId(sessionsMap: Map<sessionId, SessionData>) {
        let sessionId;
        let maxAttempts = 100;

        // Come on wtf a do while loop?? LMAO
        do {
            sessionId = this.randomString(this.sessionIdLength);
            maxAttempts--;
        } while (sessionsMap.has(sessionId) && maxAttempts > 0);
        return sessionId;
    }

    generateUniqueUserId() {
        let userId;
        let maxAttempts = 100;

        do {
            userId = this.randomString(this.userIdLength);
            maxAttempts--;
        } while (this.userIds.includes(userId) && maxAttempts > 0);
        this.userIds.push(userId);
        return userId;
    }

    private randomString(length: number) {
        let result = '';
        const charactersLength = this.characters.length;
        for ( let i = 0; i < length; i++ ) result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    }

    removeUsers(users: userId[]) {
        this.userIds = this.userIds.filter((userId) => !users.includes(userId));
    }
}
