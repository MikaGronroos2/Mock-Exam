const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
    await User.deleteMany({});
});

describe('Testing the User Routes, /login and /signup', () => {

    describe("POST /api/users/signup", () => {
        it('should signup a new user with valid credentials', async () => {
            // Creating User Data for the test
            const userData = {
                email: "superusertest@test.com",
                password: "123#Hash"
            };

            // Create a new user
            const response = await api.post('/api/users/signup').send(userData);

            // Check the status
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('token');

        })

        it('should not work because the email is not valid', async () => {
            // Creating the Failed User Data for the test
            const failData = {
                email:"superuser",
                password:"123#Hash"
            }

            const response = await api.post('/api/users/signup').send(failData);

            // Check the status
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe("POST /api/users/login", () => {
        it('should login with valid credentials', async () => {
            const userData = {
                email: "superusertest@test.com",
                password: "123#Hash"
            };

            const response = await api.post('/api/users/login').send(userData);

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('token')
        })

        it('should not login with invalid credentials', async () => {
            const failData = {
                email:"superuser",
                password:"123#Hash"
            }

            const response = await api.post('/api/users/login').send(failData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        })
    })
})


afterAll(() => {
    mongoose.connection.close();
});