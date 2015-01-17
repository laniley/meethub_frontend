import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("login", {
    path: "/login"
  });

  this.route("members-area", {
    path: "/"
  }, function() {
    this.route("map", {
      path: "/map"
    }, function() {
      this.route("friends");
      this.route("events");
      this.route("locations");
      this.route("messages");
    });

    this.route("calendar", {
      path: "/"
    }, function() {
      this.route("friends");
      this.route("events");
      this.route("locations");
      this.route("messages");
    });

    this.route("meethubs", {
      path: "/meethubs"
    }, function() {
      this.route("map");
      this.route("calendar");
    });

    this.route("messages", {
      path: "/messages"
    }, function() {
      this.route("map");
      this.route("calendar");
    });

    this.route("friends", function() {
      this.route("calendar");
      this.route("map");
    });

    this.route("events");
    this.route("locations");
  });
});

export default Router;