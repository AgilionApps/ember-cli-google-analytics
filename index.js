'use strict';

var merge = require('lodash-node/compat/objects/merge');
var googleAnalyticsConfigDefaults = {
  globalVariable: 'ga',
  tracker: 'analytics.js',
  webPropertyId: null,
  cookieDomain: null,
  cookieName: null,
  cookieExpires: null
};

function analyticsTrackingCode(config) {
  var gaConfig = {};
  if (config.cookieDomain != null) {
    gaConfig.cookieDomain = config.cookieDomain;
  }
  if (config.cookieName != null) {
    gaConfig.cookieName = config.cookieName;
  }
  if (config.cookieExpires != null) {
    gaConfig.cookieExpires = config.cookieExpires;
  }

  if (Object.keys(gaConfig).length === 0) {
    gaConfig = "'auto'";
  } else {
    gaConfig = JSON.stringify(gaConfig);
  }

  return [
    "<script>",
    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
    "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),",
    "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)",
    "})(window,document,'script','//www.google-analytics.com/analytics.js','" + config.globalVariable + "');",
    "",
    "" + config.globalVariable + "('create', '" + config.webPropertyId + "', " + gaConfig + ");",
    "" + config.globalVariable + "('send', 'pageview');",
    "</script>"
  ];
}

function gaTrackingCode(config) {
  return [
    "<script>",
    "var _gaq = _gaq || [];",
    "_gaq.push(['_setAccount', '" + config.webPropertyId + "']);",
    "_gaq.push(['_trackPageview']);",
    "",
    "(function() {",
    "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
    "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
    "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
    "})();",
    "</script>"
  ];
}

module.exports = {
  name: 'ember-cli-google-analytics',
  contentFor: function(type, config) {
    var googleAnalyticsConfig = merge({}, googleAnalyticsConfigDefaults, config.googleAnalytics || {});

    if (type === 'head' && googleAnalyticsConfig.webPropertyId != null) {
      var content;

      if (googleAnalyticsConfig.tracker === 'analytics.js') {
        content = analyticsTrackingCode(googleAnalyticsConfig);
      } else if (googleAnalyticsConfig.tracker === 'ga.js') {
        content = gaTrackingCode(googleAnalyticsConfig);
      } else {
        throw new Error('Invalid tracker found in configuration: "' + googleAnalyticsConfig.tracker + '". Must be one of: "analytics.js", "ga.js"');
      }

      return content.join("\n");
    }

    return '';
  }
};
