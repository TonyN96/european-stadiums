"use strict";

const Joi = require("@hapi/joi");
const Stadium = require("../models/stadium");
const User = require("../models/user");
const ImageStore = require('../utils/image-store');
const env = require('dotenv');
env.config();

const Stadiums = {
    index: {
        handler: async function (request, h) {
            try {
                const stadiums = await Stadium.find().populate("addedBy").lean();
                const users = await User.find().lean();
                const mapsKey = process.env.mapsKey;
                const stadiumsCount = stadiums.length;
                const usersCount = users.length;
                let spainStadiums = [];
                let germanyStadiums = [];
                let italyStadiums = [];
                let englandStadiums = [];
                let franceStadiums = [];
                for (let x = 0; x < stadiums.length; x++) {
                    if (stadiums[x].country == "England") {
                        englandStadiums.push(stadiums[x]);
                    } else if (stadiums[x].country == "France") {
                        franceStadiums.push(stadiums[x]);
                    } else if (stadiums[x].country == "Germany") {
                        germanyStadiums.push(stadiums[x]);
                    } else if (stadiums[x].country == "Italy") {
                        italyStadiums.push(stadiums[x]);
                    } else if (stadiums[x].country == "Spain") {
                        spainStadiums.push(stadiums[x]);
                    }
                }
                return h.view('home', {
                    title: 'European Stadiums',
                    mapsKey: mapsKey,
                    usersCount: usersCount,
                    stadiumsCount: stadiumsCount,
                    spainStadiums: spainStadiums,
                    germanyStadiums: germanyStadiums,
                    italyStadiums: italyStadiums,
                    englandStadiums: englandStadiums,
                    franceStadiums: franceStadiums
                });
            } catch (err) {
               return h.view('home', { errors: [{ message: err }] })
            }
        },
    },
    addStadiumView: {
        handler: function (request, h) {
            return h.view('add-stadium', { title: 'Add a Stadium' });
        },
    },
    addStadium: {
        validate: {
            payload: {
                name: Joi.string().required(),
                country: Joi.string().required(),
                city: Joi.string().required(),
                capacity: Joi.number().integer().required(),
                built: Joi.number().integer().min(1800).max(2021).required(),
                club: Joi.string().required(),
                xcoord: Joi.string().required(),
                ycoord: Joi.string().required(),
                imagefile: Joi.any().required(),
            },
            options: {
                abortEarly: false,
            },
            failAction: function (request, h, error) {
                return h
                    .view("add-stadium", {
                        title: "Error adding stadium..",
                        errors: error.details,
                    })
                    .takeover()
                    .code(400);
            },
        },
        handler: async function (request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const result = await ImageStore.uploadImage(data.imagefile);
                const imageUrl = result.url;
                let coords = [data.xcoord, data.ycoord];
                const newStadium = new Stadium({
                    name: data.name,
                    country: data.country,
                    city: data.city,
                    capacity: data.capacity,
                    built: data.built,
                    club: data.club,
                    coords: coords,
                    addedBy: user._id,
                    imageUrl: imageUrl,
                });
                await newStadium.save();
                return h.redirect("/home");
            } catch (err) {
                return h.view("add-stadium", { errors: [{ message: err.message }] });
            }
        },
        payload: {
            multipart: true,
            output: 'data',
            maxBytes: 209715200,
            parse: true
        }
    },
    deleteStadium: {
        handler: async function (request, h) {
            try {
                const stadiumId = request.params.id;
                const stadium = Stadium.findById(stadiumId);
                await Stadium.deleteOne(stadium);
                return h.redirect("/home");
            } catch (err) {
                return h.view("home", { errors: [{ message: err.message }] });
            }
        }
    },
    editStadiumView: {
        handler: async function (request, h) {
            const stadiumId = request.params.id;
            const stadium = await Stadium.findById(stadiumId).lean();
            return h.view('edit-stadium', { stadium: stadium });
        },
    },
    editStadium: {
        validate: {
            payload: {
                name: Joi.string().required(),
                country: Joi.string().required(),
                city: Joi.string().required(),
                capacity: Joi.number().integer().required(),
                built: Joi.number().integer().min(1850).max(2021).required(),
                club: Joi.string().required(),
                xcoord: Joi.string().required(),
                ycoord: Joi.string().required(),
                imagefile: Joi.any().required(),
            },
            options: {
                abortEarly: false,
            },
            failAction: async function (request, h, error) {
                const stadiumId = request.params.id;
                const stadium = await Stadium.findById(stadiumId).lean();
                return h
                    .view("edit-stadium", {
                        stadium: stadium,
                        title: "Error editing stadium..",
                        errors: error.details,
                    })
                    .takeover()
                    .code(400);
            },
        },
        handler: async function (request, h) {
            try {
                const userId = request.auth.credentials.id;
                const user = await User.findById(userId);
                const stadiumId = request.params.id;
                const data = request.payload;
                const result = await ImageStore.uploadImage(data.imagefile);
                const imageUrl = result.url;
                let coords = [data.xcoord, data.ycoord];
                await Stadium.updateOne(
                    { _id: stadiumId },
                    {
                        name: data.name,
                        country: data.country,
                        city: data.city,
                        capacity: data.capacity,
                        built: data.built,
                        club: data.club,
                        coords: coords,
                        addedBy: user._id,
                        imageUrl: imageUrl,
                    }
                );
                return h.redirect("/home");
            } catch (err) {
                const stadiumId = request.params.id;
                const stadium = await Stadium.findById(stadiumId).lean();
                return h.view("edit-stadium", { stadium: stadium, errors: [{ message: err.message }] });
            }
        },
        payload: {
            multipart: true,
            output: 'data',
            maxBytes: 209715200,
            parse: true
        }
    }
};

module.exports = Stadiums;