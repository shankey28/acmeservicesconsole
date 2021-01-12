const applicants = require("./modules/applicantInfo");
const inquirer = require("inquirer");
const logger = require("./api/cw");

const applicantWorkFlow =  ({token,username,tenant})=> {
    //Get Applicant status data choice
    applicants.getApplicantStatus(username,token).then((res)=>{
        if(res.appStatus.localeCompare("EmployerOffered") ==0)
        {
            inquirer.prompt({
                type: "list",
                name: "applicantchoice",
                message: "What would like to do?",
                choices: ["Accept Offer","Reject Offer"]
            }).then((answer)=>{
                if(JSON.stringify(answer.applicantchoice).search("Accept") != -1)
                {
                    const applicantInfo = {
                        //Set the applicant status to job interview
                        appStatus : "ApplicantAccepted",
                        candidateID : res.id,
                        candidateUserName : username
                    }
                    applicants.updateApplicantInfo(applicantInfo,token).then((res)=>{
                        applicants.updateActivity(username,"OfferAccepted").then((res)=>{
                            console.log("Offer Accepted!")
                            logger.processLogs(username,tenant,`Candidate ${username} Accepted offer`)
                    
                        })
                    }).catch((err)=>console.log("Error Accepting Offer"));

                }
                else
                {
                    const applicantInfo = {
                        //Set the applicant status to job interview
                        appStatus : "ApplicantRejected",
                        candidateID : res.id,
                        candidateUserName : userName
                    }
                    applicants.updateApplicantInfo(applicantInfo,token).then((res)=>{
                        applicants.updateActivity(userName,"OfferRejected").then((res)=>{
                            console.log("Offer rejected")
                            logger.processLogs(username,tenant,`Candidate ${username} Accepted offer`)
                        })
                    }).catch((err)=>console.log("Error rejecting offer"));

                }
            })
        }
        else if(res.appStatus.localeCompare("EmployerInterview") ==0)
        {
            inquirer.prompt({
                type: "list",
                name: "applicantchoice",
                message: "What would like to do?",
                choices: ["Accept Interview","Reject Interview"]
            }).then((answer)=>{
                if(JSON.stringify(answer.applicantchoice).search("Accept") != -1)
                {
                    const applicantInfo = {
                        //Set the applicant status to job interview
                        appStatus : "InterviewAccepted",
                        candidateID : res.id,
                        candidateUserName : username
                    }
                    applicants.updateApplicantInfo(applicantInfo,token).then((res)=>{
                        applicants.updateActivity(username,"InterviewAccepted").then((res)=>{
                            console.log("Interview Accepted!")
                            logger.processLogs(username,tenant,`Candidate ${username} Accepted Interview`)
                    
                        })
                    }).catch((err)=>console.log("Error Accepting Interview"));

                }
                else
                {
                    const applicantInfo = {
                        //Set the applicant status to job interview
                        appStatus : "InterviewRejected",
                        candidateID : res.id,
                        candidateUserName : userName
                    }
                    applicants.updateApplicantInfo(applicantInfo,token).then((res)=>{
                        applicants.updateActivity(userName,"InterviewRejected").then((res)=>{
                            console.log("Interview rejected")
                            logger.processLogs(username,tenant,`Candidate ${username} Rejected Interview`)
                        })
                    }).catch((err)=>console.log("Error rejecting Interview"));

                }
            })
        }
        else
        {
            console.log("No Interview/Offers to Accept or Reject")
        }

    })
}


module.exports = {
    applicantWorkFlow
}