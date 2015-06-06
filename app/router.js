import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route("login", {
    path: "/login"
  });

  this.route("members-area", {
    path: "/"
  }, function() {

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

    this.route("friends", function() {
      this.route("calendar", function() {
        this.route("list", function() {
          this.route("friend", {
            path: "/:friend_id"
          });
        });
      });
      this.route("map");
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

  this.route('privacy-policy');
});
