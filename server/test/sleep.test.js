const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../index');
const Sleep = require('../models/sleepdb');
const User = require('../models/userdb');

let token = '';
let userId = '';
let sleepId = '';

beforeAll(async () => {
    await User.deleteMany({});
    await Sleep.deleteMany({});

    const res = await request(app)
        .post('/api/user/login')
        .send({ email: 'test@example.com', password: 'password' });

    token = res.body.token;
    userId = res.body.user._id;
});

describe ('Sleep Api', () => {

    describe('POST /sleep', () => {
        it('should POST a sleep record', async () => {
            const res = await request(app)
                .post('/api/sleep')
                .set('Authorization', `Bearer ${token}`)
                .send({ hours: 8, timestamp: new Date() });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('hours', 8);
            sleepId = res.body._id;
        });

        it('should not POST a sleep record without hours field', async () => {
            const res = await request(app)
                .post('/api/sleep')
                .set('Authorization', `Bearer ${token}`)
                .send({ timestamp: new Date() });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Hours and timestamp are required.');
        });
    });

    describe('GET /sleep/:userId', () => {
        it('should GET all the sleep records of a user', async () => {
            const res = await request(app)
                .get(`/api/sleep/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
        });
    });

    describe('PUT /sleep/:recordId', () => {
        it('should UPDATE a sleep record', async () => {
            const res = await request(app)
                .put(`/api/sleep/${sleepId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ hours: 7 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Record updated successfully.');
        });

        it('should not UPDATE a non-existent sleep record', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/sleep/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ hours: 7 });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Record not found.');
        });
    });

    describe('DELETE /sleep/:recordId', () => {
        it('should DELETE a sleep record', async () => {
            const res = await request(app)
                .delete(`/api/sleep/${sleepId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Record deleted successfully.');
        });

        it('should not DELETE a non-existent sleep record', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/sleep/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Record not found.');
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});