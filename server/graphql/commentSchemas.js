var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var CommentModel = require('../models/Comments');

// Comments Schema
var commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      text: {
        type: GraphQLString
      },
      createdAt: {
        type: GraphQLString
      },
      updatedAt: {
        type: GraphQLString
      },
      book: {
        type: bookType,
        resolve: function (comment) {
          return Book.findById(comment.bookId).exec();
        }
      }
    }
  }
});

var RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    comments: {
      type: new GraphQLList(commentType),
      resolve(parent, args) {
        return Comment.find();
      }
    },
    comment: {
      type: commentType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Comment.findById(args.id);
      }
    }
  }
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addComment: {
      type: commentType,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        bookId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let comment = new Comment({
          text: args.text,
          bookId: args.bookId
        });
        return comment.save();
      }
    },
    deleteComment: {
      type: commentType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return Comment.findByIdAndRemove(args.id);
      }
    },
    updateComment: {
      type: commentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return Comment.findByIdAndUpdate(
          args.id,
          { $set: { text: args.text } },
          { new: true }
        );
      }
    }
  }
});

module.exports = new GraphQLSchema({query: RootQuery, mutation: Mutation});