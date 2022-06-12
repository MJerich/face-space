const { Reaction, Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getThoughtById({ params }, res) {
        console.log(params.thoughtId)
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // add thought to user
    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    // remove thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    // add reaction to thought
    addReaction({ params, body }, res) {
        console.log(params)
        Reaction.create(body)
            .then(({ _id }) => {
                console.log(_id)
                return Thought.findOneAndUpdate(
                    { _id: params.thoughtId },
                    { $push: { reaction: _id } },
                    { new: true }
                );
            })
            .then((dbReactionData) => {
                if (!dbReactionData) {
                    res.status(404).json({ message: "No thought found with this id!" });
                    return;
                }
                res.json(dbReactionData);
            })
            .catch((err) => res.json(err));
    },
    // remove reaction
    removeReaction({ params }, res) {
        Reaction.findOneAndDelete({ _id: params.reactionId })
            .then((deletedReaction) => {
                console.log(deletedReaction)
                if (!deletedReaction) {
                    res.status(404).json({ message: "No reaction with this id!" });
                    return;
                }
                res.json(deletedReaction);
            })
            .catch((err) => res.json(err));
    },

};

module.exports = thoughtController;