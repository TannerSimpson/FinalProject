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
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://TannerSimpson:Tannerman123@cluster0.emtozuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });
const reviewSchema = new mongoose.Schema({
  name: String,
  description: String,
  comments: [String],
  img: String,
});

const Review = mongoose.model("Review", reviewSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/reviews", (req, res) => {
  getReviews(res);
});

const getReviews = async (res) => {
  const reviews = await Review.find();
  res.send(reviews);
};

app.get("/api/reviews/:id", (req, res) => {
  getReview(req.params.id, res);
});

const getReview = async (id, res) => {
  const review = await Review.findOne({ _id: id });
  res.send(review);
};

app.post("/api/reviews", upload.single("img"), (req, res) => {
  const result = validateReview(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const review = new Review({
    name: req.body.name,
    description: req.body.description,
    comments: req.body.comments.split(","),
    age: req.body.age,
    occupation: req.body.occupation,
    location: req.body.location, 
    date: req.body.date
  });

  if (req.file) {
    review.img = "images/" + req.file.filename;
  }

  createReview(review, res);
});

const createReview = async (review, res) => {
  const result = await review.save();
  res.send(review);
};

app.put("/api/reviews/:id", upload.single("img"), (req, res) => {
  const result = validateReview(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  updateReview(req, res);
});

const updateReview = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
    comments: req.body.comments.split(","),
    age: req.body.age,
    occupation: req.body.occupation,
    location: req.body.location, 
    date: req.body.date
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Review.updateOne({ _id: req.params.id }, fieldsToUpdate);

  res.send(result);
};

app.delete("/api/reviews/:id", (req, res) => {
  removeReview(res, req.params.id);
});

const removeReview = async (res, id) => {
  const review = await Review.findByIdAndDelete(id);
  res.send(review);
};

function validateReview(review) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    comments: Joi.allow(""),
    _id: Joi.allow(""),
    age: Joi.string().min(1).required(), 
    occupation: Joi.string().min(1).required(), 
    location: Joi.string().min(1).required(), 
    date: Joi.string().min(1).required(), 
  });

  return schema.validate(review);
}

app.listen(3000, () => {
  console.log("I'm listening");
});