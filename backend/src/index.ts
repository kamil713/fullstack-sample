// ### docs
// https://www.apollographql.com/docs/apollo-server/data/subscriptions#enabling-subscriptions
// https://www.apollographql.com/docs/apollo-server/api/express-middleware

import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import typeDefs from './gql/typeDefs.js';
import resolvers from './gql/resolvers.js';
import { createContext } from './gql/context.js';

interface MyContext {
    token?: string;
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({
        schema,
        context: async (ctx) => {
            return createContext(ctx.extra.request, ctx.extra.response);
        },
    },
    wsServer
);

const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => createContext(req, res),
    }),
);


await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4000/`);
console.log('🚀 Subscriptions ready at ws://localhost:4000/graphql');
