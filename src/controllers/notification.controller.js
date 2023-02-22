const express = require('express');
const aunthenticate = require('../middlewares/aunthenticate');
const User = require('../models/user.model');
const router = express.Router();

router.get("/:username",aunthenticate, async (req, res) => {
    try {
        const username = req.params.username;
        const isUser = await User.findOne(
            { username: username },
            { isNewNotifications: 1, notifications: 1, _id: 0 },
        ).lean().exec();
        
        return res.status(200).send({ data: isUser });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});

router.patch("/seen/:username",aunthenticate, async (req, res) => {
    try {
        const username = req.params.username;
        const isUser = await User.findOneAndUpdate(
            { username: username },
            { $set: { isNewNotifications: false } },
            { new: true },
        ).lean().exec();
        
        return res.status(200).send({ data: isUser });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});


module.exports = router;