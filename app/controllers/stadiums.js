"use strict";

const { string } = require("@hapi/joi");
const Stadium = require("../models/stadium");
const User = require("../models/user");
const ImageStore = require('../utils/image-store');

const Stadiums = {
    index: {
        handler: async function (request, h) {
            try {
                const stadiums = await Stadium.find().populate("addedBy").lean();
                return h.view('home', {
                    title: 'European Stadiums',
                    stadiums: stadiums,
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
        handler: async function (request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const result = await ImageStore.uploadImage(data.imagefile);
                const imageUrl = result.url;
                const newStadium = new Stadium({
                    name: data.name,
                    location: data.location,
                    capacity: data.capacity,
                    built: data.built,
                    club: data.club,
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
        handler: async function (request, h) {
            try {
                const userId = request.auth.credentials.id;
                const user = await User.findById(userId);
                const stadiumId = request.params.id;
                const data = request.payload;
                const result = await ImageStore.uploadImage(data.imagefile);
                const imageUrl = result.url;
                await Stadium.updateOne(
                    { _id: stadiumId },
                    {
                        name: data.name,
                        location: data.location,
                        capacity: data.capacity,
                        built: data.built,
                        club: data.club,
                        addedBy: user._id,
                        imageUrl: imageUrl,
                    }
                );
                return h.redirect("/home");
            } catch (err) {
                return h.view("home", { errors: [{ message: err.message }] });
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