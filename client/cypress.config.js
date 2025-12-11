const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://mehmetcelalsuogluportfolio.onrender.com",
    video: true,          
    screenshotOnRunFailure: true,
  },
});
