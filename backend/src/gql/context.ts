import { Request, Response } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { IncomingMessage, ServerResponse } from 'http';

const pubsub = new PubSub();

export interface GqlContext {
    req: Request | IncomingMessage;
    res?: Response | ServerResponse;
    pubsub: PubSub;
}

export const createContext = (
    req: Request | IncomingMessage,
    res?: Response | ServerResponse
): GqlContext => ({
    req,
    res,
    pubsub,
});