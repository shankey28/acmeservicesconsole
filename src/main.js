const inquirer = require("inquirer");
const Amplify = require('aws-amplify').Amplify;
const Auth = require('aws-amplify').Auth;
const awsconfig = require('./aws-exports');
Amplify.configure(awsconfig);
const applicants = require("./modules/applicantInfo");

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

const applicantsList = async (username,token)=>{
    return {
        type: "list",
        name: "comment",
        message: "Choose applicant to comment",
        choices: await applicants.getApplicants(username,token)

    }
}

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
    recruiterWorkFlow(userInfo)
    }
    else if(userInfo.tenant == "employer")
    {
        employerWorkFlow(userInfo)

    }
})
.catch((err)=>{
    console.log("Username/Password is not correct: ",err)
})
}
).catch((err)=>{
    console.log(err)
})


const recruiterWorkFlow =  ({token,username,tenant})=> {
    applicants.getApplicants(username,token).then((result)=> {
        const candidatelist = [];
        const candidateUserNames = result.map((item)=>item.userName);
        result.forEach((item)=>{
            candidatelist.push({[item.userName] : item.id})
        });
        //Get Recruiters choice
        inquirer.prompt([{
            type: "list",
            name: "recruiterchoice",

            message: "What would you like to do?",
            choices: ["Comment on resume","Refer to employer"]
        },{
                type:"list",
                name: "applicant",
                message: "Chose an applicant",
                choices: candidateUserNames
            }]
    ).then(answer => {
            if(JSON.stringify(answer.recruiterchoice).search("Comment") != -1)
            {   
                //Get the applicant username for which comment needs to be added
                const applicantUserName = answer.applicant;

                //Get recruiters comment
                inquirer.prompt({
                    type:"input",
                    name:"comment",
                    message:"Enter your comment"
                }).then((answer)=>{
                    const candidate = candidatelist.filter((item) => item[applicantUserName]);
                    //Add recruiter comment 
                    applicants.addComment(candidate[0][applicantUserName],answer.comment,token)
                    .then((res)=>{
                        if(res)
                        console.log("Comment added successfully");
                    })

                }).catch((err)=>{
                    console.log("Error adding comment");
                })


            }
            else {
                //Refer candidate to employer
                const applicantUserName = answer.applicant;
                const candidate = candidatelist.filter((item) => item[applicantUserName]);
                const applicantInfo = {
                    appStatus : "SubmittedToEmployer",
                    candidateID : candidate[0][applicantUserName],
                    candidateUserName : applicantUserName,
                    recruiterName : username
                }

                applicants.updateApplicantInfo(applicantInfo,token)
                .then((res) => console.log("Candidate referred to employer succesfully"))
                .catch((err)=>console.log("Error referring candidate",err));

            }
           
    })
  })
}


const employerWorkFlow =  ({token,username,tenant})=> {
    applicants.getApplicants(username,token).then((result)=> {
        const candidates = result.data.listApplicantProfileNs.items;
        const candidateUserNames = candidates.map((item)=>item.userName);
        inquirer.prompt([{
            type: "list",
            name: "employerchoice",
            message: "What would you like to do?",
            choices: ["Interview Candidate","Extend and offer"]
        },{
                type:"list",
                name: "applicant",
                message: "Chose an applicant",
                choices: candidateUserNames
            }]
    ).then(answer => {
            console.log(answer);
    })
  })
}