const express = require("express");
const app = express();
const Joi = require("joi");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

mongoose.connect("mongodb+srv://TannerSimpson:0H5jsKGhUoRQFG19@cluster0.emtozuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });

const accountSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    school: String,
    gradeLevel: String
});

const Account = mongoose.model("Account", accountSchema);

app.get("/accounts", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).send("Error fetching accounts.");
    }
});

app.post("/accounts", async (req, res) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        school: Joi.string().required(),
        gradeLevel: Joi.string().required()
    });

    try {
        const validatedData = await schema.validateAsync(req.body);

        const { firstName, lastName, username, password, school, gradeLevel } = validatedData;

        const newAccount = new Account({ firstName, lastName, username, password, school, gradeLevel });
        await newAccount.save();

        res.status(200).send('Submission successful!');
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
});

app.listen(3000, () => {
    console.log("Server is listening ");
});