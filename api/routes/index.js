const express = require('express'),
    router = express.Router(),
    jwt = require('express-jwt'),
    auth = jwt({
        secret: process.env.secret,
        algorithms: ['RS256'],
        userProperty: 'payload'
    }),
    ctrlProfile = require('../controllers/profile'),
    ctrlAuth = require('../controllers/authentication')
    //ctrlStream = require('../controllers/stream'),

router.get('/user', auth, ctrlProfile.profileRead)
//router.get('/stream', ctrlStream.sendStream)
router.post('/signup', ctrlAuth.register)
router.post('/signin', ctrlAuth.login)

module.exports = router
