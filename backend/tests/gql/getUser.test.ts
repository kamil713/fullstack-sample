import { makeExecutableSchema } from '@graphql-tools/schema';
import { testGraphQLQuery } from './testGraphQLQuery';
import typeDefs from '../../src/gql/typeDefs';
import resolvers from '../../src/gql/resolvers';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

describe("Testing getting a user", () => {
    const GetUser = `
    query GetUser($id: ID!) {
      getUser(id: $id) {
        id
        username
        email
      }
    }
  `;

    it("gets the desired user", async () => {
        const userId = uuidv4();
        const username = faker.internet.username();
        const email = faker.internet.email();

        const modifiedResolvers = {
            ...resolvers,
            Query: {
                ...resolvers.Query,
                getUser: async (parent: any, args: { id: string }) => {
                    if (args.id === userId) {
                        return {
                            id: userId,
                            username,
                            email,
                        };
                    }
                    throw new Error("User not found");
                },
            },
        };

        const mockSchema = makeExecutableSchema({
            typeDefs,
            resolvers: modifiedResolvers,
        });

        const queryResponse = await testGraphQLQuery({
            schema: mockSchema,
            source: GetUser,
            variableValues: { id: userId },
        });

        const result = queryResponse.data ? queryResponse.data.getUser : null;

        expect(result).toEqual({
            id: userId,
            username,
            email,
        });
    });
});
