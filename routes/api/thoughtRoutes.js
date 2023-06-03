const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    updateThought,
    createThought,
    RemoveThought,
    addComment,
    deleteComment
} = require('../../controllers/thoughtController');


router.route('/').get(getThoughts);

router.route('/:thoughtId').get(getSingleThought).put(updateThought);

router.route('/:userId').post(createThought);


router.route('/:userId/:thoughtId').delete(RemoveThought);

router.route('/:thoughtId/reactions/:userId').post(addComment);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteComment);



module.exports = router;