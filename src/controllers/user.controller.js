const { Router } = require("express");
const aunthenticate = require("../middlewares/aunthenticate");
const Post = require("../models/post.model");
const router = Router();
const User = require("../models/user.model");

router.get("/currentUser", aunthenticate, async (req, res) => {
  try {
    const user = await req.user;
    const currentUser = await User.findById(user.user._id).lean().exec();
    console.log(user.user);
    user.user.password = null;
    currentUser.password = null;

    return res.status(200).send(currentUser);
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

router.get("/:userid", aunthenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userid).select("-password");

    if (!user) res.status(400).send({ message: "invalid userid" });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limits = req.query.size || 10;

    const skips = (page - 1) * limits;

    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log(req.query);
    //{ password: 0, token: 0, mobile: 0, email: 0,isNewNotifications:0,notifications:0 }
    const users = await User.find(keyword)
      .select("username profilePic")
      .skip(skips)
      .limit(limits);

    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne(
      { username: username },
      { password: 0, token: 0, mobile: 0, email: 0, notifications: 0 }
    )
      .lean()
      .exec();

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/follow/:id", async (req, res) => {
  try {
    //whom wants to follow
    const followerId = req.body.followersUserId;
    // who wants to follow
    const followingId = req.params.id;
    const isfollowingUser = await User.findById(followingId);
    const isfollowerUser = await User.findById(followerId);

    if (!followerId)
      return res
        .status(400)
        .send({ error: "plese provie a userId whome you want to follow" });
    if (!isfollowingUser)
      return res.status(401).send({ error: "following user is not exist" });
    if (!isfollowerUser)
      return res.status(402).send({ error: "followerUser is not exist" });

    const user = await User.findByIdAndUpdate(
      isfollowingUser,
      { $addToSet: { following: followerId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      followerId,
      { $addToSet: { followers: followingId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      followerId,
      {
        $addToSet: {
          notifications: {
            notification: `${isfollowingUser.username} start following you`,
            userPic: isfollowingUser.profilePic,
            timestamps: Date.now(),
          },
        },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      followerId,
      { isNewNotifications: true },
      { new: true }
    );
    return res.status(201).send({
      message: `you start following ${isfollowerUser.username}`,
      data: user,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/unfollow/:id", async (req, res) => {
  try {
    //whom wants to unfollow
    const followerId = req.body.followersUserId;
    // who wants to unfollow
    const followingId = req.params.id;
    const isfollowingUser = await User.findById(followingId);
    const isfollowerUser = await User.findById(followerId);

    if (!followerId)
      return res
        .status(400)
        .send({ error: "plese provie a userId whome you want to follow" });
    if (!isfollowingUser)
      return res.status(401).send({ error: "following user is not exist" });
    if (!isfollowerUser)
      return res.status(402).send({ error: "followerUser is not exist" });

    const user = await User.findByIdAndUpdate(
      isfollowingUser,
      { $pull: { following: followerId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      followerId,
      { $pull: { followers: followingId } },
      { new: true }
    );

    return res
      .status(201)
      .send({ message: `you unfollow ${isfollowerUser.username}`, data: user });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/savepost/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const postId = req.body.postId;

    const isUser = await User.findById(userId).lean().exec();
    const isPost = await Post.findById(postId).lean().exec();

    if (!userId) return res.status(400).send({ error: "userId is required" });
    if (!isUser)
      return res.status(401).send({ error: "this user is not exist" });
    if (!isPost)
      return res.status(402).send({ error: "this post is not exist" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPost: postId } },
      { new: true }
    );

    return res
      .status(201)
      .send({ message: "post saved successfully", data: user });
  } catch (err) {
    return res.status(500).send(error.message);
  }
});

router.patch("/removesavepost/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const postId = req.body.postId;

    const isUser = await User.findById(userId).lean().exec();
    const isPost = await Post.findById(postId).lean().exec();

    if (!userId) return res.status(400).send({ error: "userId is required" });
    if (!isUser)
      return res.status(401).send({ error: "this user is not exist" });
    if (!isPost)
      return res.status(402).send({ error: "this post is not exist" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPost: postId } },
      { new: true }
    );

    return res
      .status(201)
      .send({ message: "post removed successfully", data: user });
  } catch (err) {
    return res.status(500).send(error.message);
  }
});

router.patch("/update/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    // user.header("Access-Control-Allow-Origin", "*");
    // user.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.status(201).send(user);
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/about/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { about: req.body.about },
      {
        new: true,
      }
    ).select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});
//complate ok
router.patch("/update/language/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { languages: req.body.language } },
      {
        new: true,
      }
    ).select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/education/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { education: req.body.education } },
      {
        new: true,
      }
    ).select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/exprience/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { exprience: req.body.exprience } },
      {
        new: true,
      }
    ).select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/skill/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { skills: req.body.skill } },
      {
        new: true,
      }
    ).select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/projects/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projects: req.body.project } },
      {
        new: true,
      }
    )
      .populate({
        path: "projects",
        select: "username profilePic",
      })
      .select("-password");

    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/update/projects/creator/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const creator = await User.findById(req.body.userId).select(
      "username profilePic"
    );
    if (creator) {
      user.projects.forEach((item) => {
        if (
          item._id == req.body.projectId &&
          !item.creator.includes(req.body.userId)
        ) {
          item.creator.push(creator);
          item.creator.push(req.body.userId);
        }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    })
      .populate({ path: "projects", select: "username profilePic" })
      .select("-password");
    console.log(user);

    return res.status(201).send(updatedUser);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();
    res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
