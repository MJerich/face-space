const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            match: [
                /.+\@.+\..+/,
                'Please add a valid email address.',
            ],
            required: [true, 'Please enter Email Address'],
            unique: true
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
);

// get total number of friends
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

// create the User model useing the schema
const User = model('User', UserSchema);

// export the model
module.exports = User;