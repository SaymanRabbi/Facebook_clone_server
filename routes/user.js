const express = require("express");
const {
  register,
  activateAccount,
  login,
  sendVerification,
  findUser,
  sendResetPasswordCode,
  validateResetCode,
  changesPassword,
  getProfile,
  updateProfilePicture,
  updateCover,
  updateDetails,
  addFriend,
  cancelFriendRequest,
  follow,
  unfollow,
  acceptFriendRequest
} = require("../controllers/user");
const { authUser } = require("../Middlewers/auth");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/activate", authUser, activateAccount);
router.post("/sendVerification", authUser, sendVerification);
router.post("/finduser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changesPassword", changesPassword);
router.get("/getProfile/:username", authUser,getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/updateCover", authUser, updateCover);
router.put("/updateDetails", authUser, updateDetails);
router.put('/addFriend/:id', authUser, addFriend);
router.put('/cancelFriendRequest/:id', authUser, cancelFriendRequest);
router.put('/follow/:id', authUser, follow);
router.put('/unfollow/:id', authUser, unfollow);
router.put('/acceptFriendRequest/:id', authUser, acceptFriendRequest);
// router.post("/auth",authUser, Userauth);

module.exports = router;
