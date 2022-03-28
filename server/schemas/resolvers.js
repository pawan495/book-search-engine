const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
   Query: {
      me: async (parent, args, context) => {
         if (context.user) {
            const userData = await User.findOne({
               _id: context.user._id,
            }).select("-__v -password");

            return userData;
         }

         throw new AuthenticationError("Not logged in");
      },
   },
   Mutation: {
      addUser: async (parent, args) => {
         const user = await User.create(args);
         // return a JWT to stay logged in
         const token = signToken(user);
         return { token, user };
      },
      login: async (parent, { email, password }) => {
         // check if user exists
         const user = await User.findOne({ email });
         if (!user) {
            throw new AuthenticationError("Incorrect credentials");
         }

         // check if password is correct
         const correctPw = await user.isCorrectPassword(password);
         if (!correctPw) {
            throw new AuthenticationError("Incorrect credentials");
         }

         // return a JWT to stay logged in
         const token = signToken(user);
         return { token, user };
      },
      saveBook: async (parent, args, context) => {
         // if logged in
         if (context.user) {
            // find user by id
            const bookData = await User.findByIdAndUpdate(
               { _id: context.user._id },
               // add new book data to user
               { $push: { savedBooks: args } },
               // return newly updated data
               { new: true }
            );

            return bookData;
         }
      },
      removeBook: async (parent, args, context) => {
         // if logged in
         if (context.user) {
            // find user by id
            const bookData = await User.findOneAndUpdate(
               { _id: context.user._id },
               // then remove book from array by matching the book id
               { $pull: { savedBooks: { bookId: args.bookId } } },
               // return new data
               { new: true }
            );

            return bookData;
         }
      },
   },
};

module.exports = resolvers;
