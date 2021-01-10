const inquirer = require("inquirer");
const Amplify = require('aws-amplify').Amplify;
const Auth = require('aws-amplify').Auth;
const awsconfig = require('./aws-exports');
Amplify.configure(awsconfig);
const recruiter = require("./recruiter");
const employer = require("./employer");
const applicant = require("./applicant");
const admin = require("./admin");


loginprompt = [
    {
        type: "input",
        name: "username",
        message: "Please type username:"
    },
    {
        type: "password",
        name: "password",
        message: "Please type password:"
    }

]


const parseUserInfo =  (authRes) => new Promise((res,rej)=>{
        try
        {
        const token = authRes.signInUserSession.accessToken.jwtToken;
        const usergrps = authRes.signInUserSession.idToken.payload["cognito:groups"];
        const username = authRes.username;
        const tenant = usergrps[0];
         res({token,username,tenant});
        }
        catch(err)
        {
            rej(err);
        }


    })


inquirer.prompt(loginprompt).then((loginanswer) => {
Auth.signIn(loginanswer).then((res)=>{
    return parseUserInfo(res)
    
}
).then((userInfo)=> {
    if(userInfo.tenant == "recruiter")
    {
        recruiter.recruiterWorkFlow(userInfo);
    }
    else if(userInfo.tenant == "employer")
    {
        employer.employerWorkFlow(userInfo)

    }
    else if(userInfo.tenant == "admins")
    {
       admin.adminWorkFlow(userInfo)

    }
    else if(userInfo.tenant == "applicants")
    {
        applicant.applicantWorkFlow(userInfo)

    }
})
.catch((err)=>{
    console.log("Username/Password is not correct: ",err)
})
}
).catch((err)=>{
    console.log(err)
})


