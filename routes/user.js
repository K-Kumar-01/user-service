const { Router } = require("express");
const {
  createUser,
  fetchAllUsers,
  getSingleUserDetail,
} = require("../controllers");

const router = Router();

router.post("/create", createUser);
router.get("/all", fetchAllUsers);
router.get("/:id", getSingleUserDetail);

module.exports = router;
