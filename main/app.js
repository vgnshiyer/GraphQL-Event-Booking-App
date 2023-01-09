const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const uri = "mongodb+srv://admin:admin123@testcluster1.s25eazv.mongodb.net/event-react-graphql?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const Event = require('./models/event')

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(res => {
                return res.map(r => {
                    return {...r._doc, _id: r.id};
                })
            }).catch(err => {
                console.log(err);
                throw err;
            });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
            .save().then(res => {
                console.log(res);
                return {...res._doc, _id: res._doc._id.toString()};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("connection established")
    app.listen(3000);
}).catch((err => {
    console.log(err);
}));