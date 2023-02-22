const Story = require("../models/story.model");
const User = require("../models/user.model");

const router = require("express").Router();

router.post("/addstory", async (req, res) => {
    try {
        const { userId, imgUrl } = req.body;
        
        const user = await User.findById( userId ).lean().exec();

        if (!userId || !imgUrl)
            return res.status(400).send({ error: "userid and imgUrl is require" });
        if (!user)
            return res.status(401).send({ error: "user is not exist" });
        
        const story = await Story.create(req.body);

        const update=await User.findByIdAndUpdate(
            userId ,
            { $addToSet: { storys: story._id } },
            { new: true },
            
        );
        console.log(update)
        


        const removeStoryAfter24H = async() => {
            await User.findByIdAndUpdate(
                 userId ,
                { $pull: {storys:story._id} },
                { new: true },
            )
        }

        setTimeout(removeStoryAfter24H, 1000 * 60 * 60 * 24);
        
        return res.status(201).send(story);
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
});

router.delete("/deletestory/:id", async (req, res) => {
    try {
        const storyId = req.params.id;
        const { userId } = req.body;
        
        const user = await User.findById(userId).lean().exec();
        const isStory = await Story.findOne({ _id: storyId }).lean().exec();

        if (!userId)
            return res.status(400).send({ error: "userid is require" });
        if (!user)
            return res.status(401).send({ error: "user is not exist" });
        if (!isStory)
            return res.status(402).send({ error: "story is not exist" });
        
        if (userId.toString() !== isStory.userId.toString()) {
            return res.status(403).send({ error: "you can not delet this story" });
        }
        await Story.findByIdAndDelete(storyId);
        

        await User.findByIdAndUpdate(
            userId ,
            { $pull: { storys: storyId } },
            { new: true },
            
        );
        
        


        
        return res.status(201).send({message:"story delet succesfully",data:isStory});
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
});

module.exports = router;