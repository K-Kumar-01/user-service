const express = require("express");
const { errorHandler, NotFoundError, connectDB } = require("prattask-cmmn");
const userRoutes = require("./routes/user");

const app = express();
// const DB_STRING = "mongodb://mongo-user:27017/users";
// const DB_STRING = "mongodb://127.0.0.1:27017/users";
const DB_STRING = "mongodb+srv://kushal:pratilipi@users.obikz.mongodb.net/users?retryWrites=true&w=majority";

connectDB(DB_STRING);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
