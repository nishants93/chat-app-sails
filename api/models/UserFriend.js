/**
 * UserFriend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user_1 : {
      model: 'user',
      via : 'id'
    },
    user_2 : {
      model: 'user',
      via : 'id'
    },
    is_friend : {
      type : 'integer'
    },
    is_blocked : {
      type : 'boolean'
    },
    blocker_id : {
      model: 'user',
      via : 'id'
    }
  }
};
