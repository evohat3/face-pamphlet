const router = require('express').Router();
const {
  getUsers,
  createUser,
  getSingleUser
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser)

router.route('/:userId').get(getSingleUser);


module.exports = router;
