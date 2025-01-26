export const log = (
    resolver: Function
) => {
    return async (parent: any, args: any, context: any, info: any) => {
        console.log('Start logging');

        const result = await resolver(parent, args, context, info);

        console.log('Finished call to resolver');

        return result;
    };
};