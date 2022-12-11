export class SessionInfo {
    id: number;
    url: string;
    totalImages: number;
    type: string;
    isFinished: boolean;
    createdAt: Date;
    updatedAt: Date;
    targetImageUrl: string;

    public constructor(init?: Partial<SessionInfo>) {
        Object.assign(this, init);
    }
}