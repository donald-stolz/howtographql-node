const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => {
            return context.db.query.links({}, info);
        },
    },
    Mutation: {
        // 2
        post: (root, args, context, info) => {
            return context.db.mutation.createLink(
                {
                    data: {
                        url: args.url,
                        description: args.description,
                    },
                },
                info
            );
        },
        // updateLink: (root, args) => {
        //     let index = links.findIndex(link => link.id == args.id);
        //     let temp = links[index];
        //     if (temp) {
        //         temp.description = args.description
        //             ? args.description
        //             : temp.description;
        //         temp.url = args.url ? args.url : temp.url;
        //         links[index] = temp;
        //     }
        //     return temp;
        // },
        // deleteLink: (root, args) => {
        //     let index = links.findIndex(link => link === args.id);
        //     links.splice(index, 1);
        // },
    },
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: './src/generated/prisma.graphql',
            endpoint: 'https://us1.prisma.sh/donald-stolz-8c6189/database/dev',
            secret: 'mysecret123',
            debug: true,
        }),
    }),
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
