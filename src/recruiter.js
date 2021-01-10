const applicants = require("./modules/applicantInfo");
const logger = require("./api/cw");
const inquirer = require("inquirer");

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
            applicants.getApplicants(username,token).then((result)=> {
                let candidatelist = [];
                let candidateUserNames = result.map((item)=> item.userName);
                result.forEach((item)=>{
                    candidatelist.push({[item.userName] : item.id +","+item.userName})
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
                    logger.processLogs(username,tenant,`Candidate ${applicantUserName} added comment`)
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

                if(candidateUserNames.length == 0) {
                    console.log("No candidates to refer");
                    return;
                }

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
            .then((res) => {
                console.log("Candidate referred to employer succesfully");
                logger.processLogs(username,tenant,`Candidate ${applicantUserName} resume submitted to employer`)
            })
            .catch((err)=>console.log("Error referring candidate",err));

        })

    })
}
       
}).catch((err)=>console.log("Recruiter comment/refer process exited with error!",err));

}

module.exports = {
    recruiterWorkFlow

}