import Ember from 'ember';

export default Ember.Controller.extend({

  isGerman: function() {
    if(Ember.I18n.locale === 'de')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('Ember.I18n.locale'),

  actions: {
    sendMail: function() {

      if(document.getElementById('bugreport-text').value.length > 0)
      {
        var body = navigator.appCodeName + "\r\n"
                 + navigator.platform + "\r\n"
                 + navigator.appName + "\r\n"
                 + navigator.appVersion + ":\r\n \r\n"
                 + escape(document.getElementById('bugreport-text').value);

        var mail = "mailto:bugs@meethubs.net"
                 + "?subject=" + escape("Bugreport - Meethub")
                 + "&body=" + encodeURIComponent(body)
        ;

        window.location.href = mail;
      }
    }
  }
});
