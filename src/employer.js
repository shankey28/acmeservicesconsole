const applicants = require("./modules/applicantInfo");
const inquirer = require("inquirer");
const logger = require("./api/cw");

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
                 //Filter candidates that are submitted to employer
                 if(item.appStatus == "SubmittedToEmployer")
                 {
                  candidateUserNames.push(item.userName);
                 }
                 return candidateUserNames;
             },[]);

             if(candidateUserNames.length == 0) 
             {
                 console.log("No candidates to Interview");
                 employerWorkFlow({token,username,tenant});
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
         //Get the applicant username that needs to be interviewed
         const applicantUserName = answer.applicant;
         const candidate = candidatelist.filter((item) => item[applicantUserName]);
         const applicantInfo = {
             //Set the applicant status to job interview
             appStatus : "EmployerInterview",
             candidateID : candidate[0][applicantUserName],
             candidateUserName : applicantUserName,
             employer : username
         }
         //Set candidate status to EmployerInterview
         applicants.updateApplicantInfo(applicantInfo,token)
         .then((res) => {
             console.log("Candidate scheduled for interview");
             logger.processLogs(username,tenant,`Schedule candidate ${applicantUserName} for Interview`);
             employerWorkFlow({token,username,tenant});
         })
         .catch((err)=>console.log("Error scheduling candidate interview",err));

         })

     }
     )
     }
     else { //Offer candidate flow

         //Get the list of All Applicants
         applicants.getApplicants(username,token).then((result)=> {
             let candidatelist = [];
             let candidateUserNames = result.reduce((candidateUserNames, item)=> {
                 //Filter candidates who are interviewed already
                 if(item.appStatus == "InterviewAccepted")
                 {
                  candidateUserNames.push(item.userName);
                 }
                 return candidateUserNames;
             },[]);

             if(candidateUserNames.length == 0) {
                 console.log("No candidates to offer")
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
             //Set the applicant status to job offered
             appStatus : "EmployerOffered",
             candidateID : candidate[0][applicantUserName],
             candidateUserName : applicantUserName,
             recruiterName : username
         }
         //Set the applicant status to EmployerOffered
         applicants.updateApplicantInfo(applicantInfo,token)
         .then((res) => {
             console.log("Candidate offered employment succesfully");
             logger.processLogs(username,tenant,`Offered candidate ${applicantUserName}`);
             employerWorkFlow({token,username,tenant});
         })
         .catch((err)=>console.log("Error referring candidate",err));

     })


 })

}

}).catch((err)=>console.log("Recruiter comment/refer process exited with error!",err));

}


module.exports = {
    employerWorkFlow
}