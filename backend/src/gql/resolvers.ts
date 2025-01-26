import { v4 } from "uuid";
import { GqlContext } from "./context";
import { todos } from "./db.js";
import { log } from "./logger.js";

interface User {
    id: string;
    username: string;
    email?: string;
}

interface Todo {
    id: string;
    title: string;
    description?: string;
}

const NEW_TODO = "NEW TODO";

const resolvers = {
    Query: {
        getUser: log(async (
            parent: any,
            args: {
                id: string;
            },
            ctx: GqlContext,
            info: any
        ): Promise<User> => {
            return {
                id: v4(),
                username: "dave",
            };
        }),

        getTodos: log(async (
            parent: any,
            args: null,
            ctx: GqlContext,
            info: any
        ): Promise<Array<Todo>> => {
            console.log("Running getTodos");
            return todos;
            }
        ),
    },

    Mutation: {
        addTodo: log(async (
            _: any,
            { title, description }: { title: string; description?: string },
            { pubsub }: GqlContext
        ) => {
            const newTodo = { id: v4(), title, description };
            todos.push(newTodo);
            await pubsub.publish(NEW_TODO, { newTodo });
            return newTodo;
            }
        ),
    },

    Subscription: {
        newTodo: {
            subscribe: log(
                async (_: any, __: any, { pubsub }: GqlContext) =>
                pubsub.asyncIterableIterator(NEW_TODO),
            ),
        },
    },
};

export default resolvers;