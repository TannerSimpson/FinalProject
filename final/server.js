const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://TannerSimpson:0H5jsKGhUoRQFG19@cluster0.emtozuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });
const accountSchema = new mongoose.Schema({
  name: String,
  nameLast: String,
  username: String,
  password: String,
  img: String,
  school: String,
  useages: [String],
});

const Account = mongoose.model("Account", accountSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/accounts", (req, res) => {
  getAccounts(res);
});

const getAccounts = async (res) => {
  const accounts = await Account.find();
  res.send(accounts);
};

app.get("/api/accounts/:id", (req, res) => {
  getAccount(req.params.id, res);
});

const getAccount = async (id, res) => {
  const account = await Account.findOne({ _id: id });
  res.send(account);
};

app.post("/api/accounts", upload.single("img"), (req, res) => {
  const result = validateAccount(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const account = new Account({
    name: req.body.name,
    nameLast: req.body.nameLast,
    username: req.body.username,
    password: req.body.password,
    school: req.body.school,
    useages: req.body.useages.split(","),
  });

  if (req.file) {
    account.img = "images/" + req.file.filename;
  }

  createAccount(account, res);
});

const createAccount = async (account, res) => {
  const result = await account.save();
  res.send(account);
};

app.put("/api/accounts/:id", upload.single("img"), (req, res) => {
  const result = validateAccount(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  updateAccount(req, res);
});

const updateAccount = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    nameLast: req.body.nameLast,
    username: req.body.username,
    password: req.body.password,
    school: req.body.school,
    useages: req.body.useages.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Account.updateOne({ _id: req.params.id }, fieldsToUpdate);

  res.send(result);
};

app.delete("/api/accounts/:id", (req, res) => {
  removeAccount(res, req.params.id);
});

const removeAccount = async (res, id) => {
  const account = await Account.findByIdAndDelete(id);
  res.send(account);
};

function validateAccount(account) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    nameLast: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    school: Joi.string().min(3).required(),
    useages: Joi.allow(""),
    _id: Joi.allow(""),
  });

  return schema.validate(account);
}

app.listen(3000, () => {
  console.log("I'm listening");
});