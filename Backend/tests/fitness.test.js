const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Fitness = require("../models/fitnessModel");

let token = null;

const fitnessPosts = [
    {
        title:"Push-ups",
        date:"05-02-2024",
        duration: 20,
        caloriesBurned: 100
    },
    {
        title:"Sit-Ups",
        date:"10-10-2024",
        duration: 100,
        caloriesBurned: 200
    },
    {
        title:"Middle-ups",
        date:"02-01-2010",
        duration: 50,
        caloriesBurned: 2500
    },
    {
        title:"Burn-ups",
        date:"20-12-2010",
        duration: 120,
        caloriesBurned: 69
    },
    {
        title:"Divide-ups",
        date:"15-10-2024",
        duration: 220,
        caloriesBurned: 10
    },
]

beforeAll(async () => {
        await User.deleteMany({});
        const result = await api.post("/api/users/signup").send({ email: "hashitest@test.com", password: "123#Hash"})
        token = result.body.token
});

describe("To make sure there are data in /api/fitness ", () => {
    beforeEach(async () => {
        await Fitness.deleteMany({});
        await api.post("/api/fitness")
        .set("Authorization", "bearer " + token)
        .send(fitnessPosts[0])
        .send(fitnessPosts[1])
        .send(fitnessPosts[2])
        .send(fitnessPosts[3]);
    });

    it(' 2.2 // Should return all fitnessData as JSON when GET /api/fitness is called', async () => {
        const response = await api.get("/api/fitness/")
        .set("Authorization", "bearer " + token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it(' 2.1 // should post a fitnessData', async () => {
        const newFitnessData = {
        title:"Divide-ups",
        date:"12-10-2024",
        duration: 220,
        caloriesBurned: 10
        };

        const response = await api
        .post("/api/fitness")
        .set("Authorization", "bearer " + token)
        .send(newFitnessData)

        expect(response.status).toBe(201);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
    })

    it(' 2.3 // should GET a single fitnessData entry by using an ID', async () => {
        const data = await Fitness.findOne();
        console.log("DATAAAAA ON TÄÄÄLLÄ")
        console.log(data);
        const response = await api.get("/api/fitness/" + data._id).set("Authorization", "bearer " + token)

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
    })
})


afterAll(() => {
    mongoose.connection.close();
})