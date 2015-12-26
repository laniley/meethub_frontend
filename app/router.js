import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("login", { path: "/login" });
  this.route("index", { path: "/" }, function() {
    this.route("bugreports", function() {
      this.route("create");
    });
    this.route("meethubs", {
      path: "/meethubs"
    }, function() {
      this.route("map", function() {});
      this.route("calendar", function() {
        this.route("list");
      });
      this.route("comments", function() {
        this.route("meethub", {
          path: "/:meethub_id"
        });
      });
    });
    this.route("messages", {
      path: "/messages"
    }, function() {
      this.route("map");
      this.route("calendar", function() {
        this.route("list");
      });
    });

    this.route("events", function() {
      this.route("map");
      this.route("calendar");
      this.route('event', {
        path: "/:event_id"
      });
    });
    this.route("locations", function() {
      this.route("map");
      this.route("calendar");
    });

  });
  this.route('friends');
  this.route('privacy-policy');
});

export default Router;
