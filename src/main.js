const inquirer = require("inquirer");
const Amplify = require("aws-amplify").Amplify;
const Auth = require("aws-amplify").Auth;
const awsconfig = require("./aws-exports");
Amplify.configure(awsconfig);
const recruiter = require("./modules/recruiter");
const employer = require("./modules/employer");
const applicant = require("./modules/applicant");
const admin = require("./modules/admin");

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
];

const parseUserInfo = (authRes) =>
  new Promise((res, rej) => {
    try {
      const token = authRes.signInUserSession.accessToken.jwtToken;
      const usergrps =
        authRes.signInUserSession.idToken.payload["cognito:groups"];
      const username = authRes.username;
      const tenant = usergrps[0];
      res({ token, username, tenant });
    } catch (err) {
      rej(err);
    }
  });

inquirer
  .prompt(loginprompt)
  .then((loginanswer) => {
    Auth.signIn(loginanswer)
      .then((res) => {
        return parseUserInfo(res);
      })
      .then((userInfo) => {
        if (JSON.stringify(userInfo.tenant).search("recruiter") != -1) {
          recruiter.recruiterWorkFlow(userInfo);
        } else if (JSON.stringify(userInfo.tenant).search("employer") != -1) {
          employer.employerWorkFlow(userInfo);
        } else if (JSON.stringify(userInfo.tenant).search("admins") != -1) {
          admin.adminWorkFlow(userInfo);
        } else if (JSON.stringify(userInfo.tenant).search("applicants") != -1) {
          applicant.applicantWorkFlow(userInfo);
        }
      })
      .catch((err) => {
        console.log("Username/Password is not correct: ", err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
