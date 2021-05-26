"use strict";

const axios = require("axios");

class StadiumsService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /* User services */

  async findOneUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async findAllUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
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

  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }

  async editUser(id, user) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/" + id, user);
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

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  /* Stadium services */

  async findOneStadium(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/stadiums/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async findAllStadiums() {
    try {
      const response = await axios.get(this.baseUrl + "/api/stadiums");
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

  async editStadium(id, stadium) {
    try {
      const response = await axios.post(this.baseUrl + "/api/stadiums/" + id, stadium);
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

  /* Review services */

  async findAllReviews() {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async findReviewsByStadium(stadiumId) {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews/" + stadiumId);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async addReview(review) {
    try {
      const response = await axios.post(this.baseUrl + "/api/reviews", review);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllReviews() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/reviews");
      return response.data;
    } catch (e) {
      return null;
    }
  }

}

module.exports = StadiumsService;
