const { BadRequestError } = require("prattask-cmmn");
const bcryptjs = require("bcryptjs");
const { userCrud } = require("../models/User");
const axios = require("axios").default;
const DAILYPASSURL = `https://dailypass-service.vercel.app/`

exports.createUser = async (req, res, next) => {
  try {
    let user = await userCrud.getOne({
      findBy: { email: req.body.email },
    });
    if (user) {
      throw new BadRequestError("User with same email exists");
    }

    let { password } = req.body;
    password = await bcryptjs.hash(password, 12);

    const createdUser = await userCrud.createOne({
      body: { ...req.body, password },
    });

    const data = await axios.put(`${DAILYPASSURL}dailyPass/user`, {
      user_id: createdUser.id,
    });

    return res
      .status(200)
      .json({ message: "Signed up succesfully", data: data.data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getSingleUserDetail = async (req, res, next) => {
  try {
    const userID = req.params.id;
    let promisesArray = [];
    promisesArray.push(
      axios.get(`${DAILYPASSURL}dailypass/details?userId=${userID}`)
    );

    promisesArray.push(axios.get(`https://content-service.vercel.app/series/all`));
    promisesArray.push(
      userCrud.getOne({
        findBy: { _id: userID },
        selectOpts: "-createdAt -updatedAt -password -__v",
      })
    );

    const result = await Promise.all(promisesArray);
    let userData = result[0].data.data;
    let seriesData = result[1].data.data;
    for (let i = 0; i < userData.series.length; i++) {
      const { lastChapter } = userData.series[i];
      seriesData[i].chapters = seriesData[i].chapters.slice(0, lastChapter);
    }
    res.status(200).json({ ...result[2], series: seriesData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.fetchAllUsers = async (req, res, next) => {
  try {
    // can also use .cursor method for faster
    const users = await userCrud.getMany({
      findBy: {},
      selectOpts: " -password -updatedAt -createdAt",
    });
    return res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
};
