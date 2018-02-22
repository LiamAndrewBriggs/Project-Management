const request = require('supertest')
const frm = require('../server.js');
const assert = require('chai').assert


suite("Route checks", () => {
    test('Should load home page with welcome message', () => {
        request(frm).get("/home")
        .expect(200)
        .expect(/Everything you need to plan a party, all in one place/)
    })
    test('Should not load projects as need to log in', () => {
        request(frm).get("/user/partys")
        .expect(401)
    })
    test('Should not be able to find venue as does not exist', () => {
        request(frm).get("/venues/gwdbhjwfyfwtyc")
        .expect(404)
    })
    test('Should be able to find venue as it does exist', () => {
        request(frm).get("/venues/5a8b0c5d147767221c51b5d8")
        .expect(200)
    })
    test('Should be able to see that we revieve JSON data, example that no user is logged in', () => {
        request(frm).get("/venues")
        .expect(200)
        .expect({loggedIn: "No User"})
    })
})