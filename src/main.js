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
        //Get Recruiters choice
        inquirer.prompt({
            type: "list",
            name: "recruiterchoice",

            message: "What would you like to do?",
            choices: ["Comment on resume","Refer to employer"]
        }
    ).then(answer => {
            if(JSON.stringify(answer.recruiterchoice).search("Comment") != -1)
            {   

                //Get the list of All Applicants
                applicants.getApplicantsByRecruiter(username,token).then((result)=> {
                    let candidatelist = [];
                    let candidateUserNames = result.map((item)=> item.userName);
                    result.forEach((item)=>{
                        candidatelist.push({[item.userName] : item.id})
                    });
                inquirer.prompt({
                    type:"list",
                    name: "applicant",
                    message: "Chose an applicant",
                    choices: candidateUserNames
                }).then((answer)=>{
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

                })
            })
                

            }
            else { //Refer candidate flow

                //Get the list of All Applicants
                applicants.getApplicantsByRecruiter(username,token).then((result)=> {
                    let candidatelist = [];
                    let candidateUserNames = result.reduce((candidateUserNames, item)=> {
                        if(item.appStatus == "New")
                        {
                         candidateUserNames.push(item.userName);
                        }
                        return candidateUserNames;
                    },[]);

                    if(candidateUserNames.length == 0) return;

                    result.forEach((item)=>{
                        candidatelist.push({[item.userName] : item.id})
                    });

                inquirer.prompt({
                    type:"list",
                    name: "applicant",
                    message: "Chose an applicant",
                    choices: candidateUserNames
                }).then((answer)=>{
                const applicantUserName = answer.applicant;
                const candidate = candidatelist.filter((item) => item[applicantUserName]);
                const applicantInfo = {
                    appStatus : "SubmittedToEmployer",
                    candidateID : candidate[0][applicantUserName],
                    candidateUserName : applicantUserName,
                    recruiterName : username
                }
                //Refer candidate to employer
                applicants.updateApplicantInfo(applicantInfo,token)
                .then((res) => console.log("Candidate referred to employer succesfully"))
                .catch((err)=>console.log("Error referring candidate",err));

            })

        })
    }
    console.log("No candidates available to refer currently")
           
    }).catch((err)=>console.log("Recruiter comment/refer process exited with error!",err));

}





const employerWorkFlow =  ({token,username,tenant})=> {
       //Get Recruiters choice
        inquirer.prompt({
            type: "list",
            name: "recruiterchoice",

            message: "What would you like to do?",
            choices: ["Comment on resume","Refer to employer"]
        }
    ).then(answer => {
            if(JSON.stringify(answer.recruiterchoice).search("Comment") != -1)
            {   

                //Get the list of All Applicants
                applicants.getApplicants(username,token).then((result)=> {
                    let candidatelist = [];
                    let candidateUserNames = result.map((item)=> item.userName);
                    result.forEach((item)=>{
                        candidatelist.push({[item.userName] : item.id})
                    });
                inquirer.prompt({
                    type:"list",
                    name: "applicant",
                    message: "Chose an applicant",
                    choices: candidateUserNames
                }).then((answer)=>{
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

                })
            })
                

            }
            else { //Refer candidate flow

                //Get the list of All Applicants
                applicants.getApplicants(username,token).then((result)=> {
                    let candidatelist = [];
                    let candidateUserNames = result.reduce((candidateUserNames, item)=> {
                        if(item.appStatus == "New")
                        {
                         candidateUserNames.push(item.userName);
                        }
                        return candidateUserNames;
                    },[]);

                    if(candidateUserNames.length == 0) return;

                    result.forEach((item)=>{
                        candidatelist.push({[item.userName] : item.id})
                    });

                inquirer.prompt({
                    type:"list",
                    name: "applicant",
                    message: "Chose an applicant",
                    choices: candidateUserNames
                }).then((answer)=>{
                const applicantUserName = answer.applicant;
                const candidate = candidatelist.filter((item) => item[applicantUserName]);
                const applicantInfo = {
                    appStatus : "SubmittedToEmployer",
                    candidateID : candidate[0][applicantUserName],
                    candidateUserName : applicantUserName,
                    recruiterName : username
                }
                //Refer candidate to employer
                applicants.updateApplicantInfo(applicantInfo,token)
                .then((res) => console.log("Candidate referred to employer succesfully"))
                .catch((err)=>console.log("Error referring candidate",err));

            })

        })
    }
    console.log("No candidates available to refer currently")
           
    }).catch((err)=>console.log("Recruiter comment/refer process exited with error!",err));

}



const employerWorkFlow =  ({token,username,tenant})=> {
       //Get Employer's choice
       inquirer.prompt({
        type: "list",
        name: "employerchoice",

        message: "What would you like to do?",
        choices: ["Interview Candidate","Make a job offer"]
    }
).then(answer => {
        if(JSON.stringify(answer.employerchoice).search("Interview") != -1)
        {   

            //Get the list of All Applicants
            applicants.getApplicants(username,token).then((result)=> {
                let candidatelist = [];
                let candidateUserNames = result.reduce((candidateUserNames, item)=> {
                    if(item.appStatus == "SubmittedToEmployer")
                    {
                     candidateUserNames.push(item.userName);
                    }
                    return candidateUserNames;
                },[]);
                if(candidateUserNames.length == 0) return;
                result.forEach((item)=>{
                    candidatelist.push({[item.userName] : item.id})
                });
            inquirer.prompt({
                type:"list",
                name: "applicant",
                message: "Chose an applicant",
                choices: candidateUserNames
            }).then((answer)=>{
            //Get the applicant username that needs to be interviewed

            const applicantUserName = answer.applicant;
            const candidate = candidatelist.filter((item) => item[applicantUserName]);
            const applicantInfo = {
                appStatus : "EmployerInterview",
                candidateID : candidate[0][applicantUserName],
                candidateUserName : applicantUserName,
                employer : username
            }
            //Refer candidate to employer
            applicants.updateApplicantInfo(applicantInfo,token)
            .then((res) => console.log("Candidate scheduled for interview"))
            .catch((err)=>console.log("Error scheduling candidate interview",err));

            })
        })
            console.log("No candidates available for Interview")
        }
        else { //Refer candidate flow

            //Get the list of All Applicants
            applicants.getApplicants(username,token).then((result)=> {
                let candidatelist = [];
                let candidateUserNames = result.reduce((candidateUserNames, item)=> {
                    if(item.appStatus == "New")
                    {
                     candidateUserNames.push(item.userName);
                    }
                    return candidateUserNames;
                },[]);

                if(candidateUserNames.length == 0) return;

                result.forEach((item)=>{
                    candidatelist.push({[item.userName] : item.id})
                });

            inquirer.prompt({
                type:"list",
                name: "applicant",
                message: "Chose an applicant",
                choices: candidateUserNames
            }).then((answer)=>{
            const applicantUserName = answer.applicant;
            const candidate = candidatelist.filter((item) => item[applicantUserName]);
            const applicantInfo = {
                appStatus : "SubmittedToEmployer",
                candidateID : candidate[0][applicantUserName],
                candidateUserName : applicantUserName,
                recruiterName : username
            }
            //Refer candidate to employer
            applicants.updateApplicantInfo(applicantInfo,token)
            .then((res) => console.log("Candidate referred to employer succesfully"))
            .catch((err)=>console.log("Error referring candidate",err));

        })

    })
    console.log("No candidates eligible for Offer")
}

}).catch((err)=>console.log("Recruiter comment/refer process exited with error!",err));

}

