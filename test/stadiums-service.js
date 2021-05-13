"use strict";

const axios = require("axios");

class StadiumsService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async addStadium(stadium) {
    try {
      const response = await axios.post(this.baseUrl + "/api/stadiums", stadium);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getStadiums() {
    try {
      const response = await axios.get(this.baseUrl + "/api/stadiums");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneStadium(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/stadiums/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllStadiums() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/stadiums");
      return response.data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = StadiumsService;
