const router = require('express').Router();
const {
    getAllUser,
    createUser,
    deleteUser,
    getUserById,
    updateUser
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUser)
    .post(createUser);

    router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

    module.exports = router;