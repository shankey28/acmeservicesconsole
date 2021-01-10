const applicants = require("./modules/applicantInfo");
const inquirer = require("inquirer");



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
                        })
                    }).catch((err)=>console.log("Error rejecting offer"));

                }
            })
        }
        else
        {
            console.log("No offers to Accept or Reject")
        }

    })
}


module.exports = {
    applicantWorkFlow
}