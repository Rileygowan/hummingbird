"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet, (callback));
    },
    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection('tweets').find().toArray(callback);
    },

    addLike: function(user, likes) {
      db.collection('tweets').find(user).insertOne(likes);
    }
    //     { user: data.user },
    //     { $set:
    //       {
    //         likes: likes;
    //       }
    //     }
    // }
    // removeLike: function() {
    //   db.collection('tweets')
    }
};


// db.collection.update(
//    { _id: ObjectId("557914833ac61e518e6103ab") }, //update doc with this id
//    { $set:
//       {
//         "dataValue.default": [
//          "default A",
//          "default B"
//          ]
//       }
//    }
// )