"use strict";

const Stadium = require("../models/stadium");

const Stadiums = {
    index: {
        handler: async function (request, h) {
            const stadiums = await Stadium.find().lean();
            return h.view('home', {
                title: 'European Stadiums',
                stadiums: stadiums,
            });
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
                const data = request.payload;
                const newStadium = new Stadium({
                    name: data.name,
                    location: data.location,
                    capacity: data.capacity,
                    built: data.built,
                    teams: data.teams
                });
                await newStadium.save();
                return h.redirect("/home");
            } catch (err) {
                return h.view("main", { errors: [{ message: err.message }] });
            }
        },
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
};

module.exports = Stadiums;