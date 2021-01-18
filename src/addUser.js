var AWS = require("aws-sdk");
const inquirer = require("inquirer");
const adduser = require("./api/cognito");
// var credentials = new AWS.SharedIniFileCredentials({profile: 'amplify-cli'});
// AWS.config.credentials = credentials;

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: "us-east-1",
});

loginprompt = [
  {
    type: "input",
    name: "username",
    message: "Please type username:",
  },
  {
    type: "password",
    name: "password",
    message: "Please type password:",
  },
  {
    type: "input",
    name: "email",
    message: "Please type email:",
  },
  {
    type: "list",
    name: "usergroup",
    message: "Select usergroup",
    choices: ["admins", "employer", "recruiter"],
  },
  {
    type: "list",
    name: "employer",
    message: "Select employer",
    when: function (answers) {
      return answers.usergroup == "employer";
    },
    choices: ["employerf", "employero", "employerh", "employer4"],
  },
  {
    type: "list",
    name: "recruiter",
    message: "Select recruiter",
    when: function (answers) {
      return answers.usergroup == "recruiter";
    },
    choices: ["recruiterf", "recruitero", "recruiterh", "recruiter4"],
  },
];

inquirer
  .prompt(loginprompt)
  .then((loginanswer) => {
    adduser.createUser(
      ({ username, password, email, usergroup } = loginanswer)
    );
  })
  .catch((err) => {
    console.log("error: ", err);
  });
