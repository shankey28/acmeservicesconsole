const applicants = require("../api/applicantInfo");
const inquirer = require("inquirer");
const logger = require("../api/cw");

const adminWorkFlow = ({ token, username, tenant }) => {
  //Get Employer's choice
  inquirer
    .prompt({
      type: "list",
      name: "adminchoice",

      message: "What would you like to do?",
      choices: [
        "See Candidate Activity",
        "Create Invoice",
        "See Invoice Status",
      ],
    })
    .then((answer) => {
      if (JSON.stringify(answer.adminchoice).search("Activity") != -1) {
        //Get the list of All Applicants
        applicants.getApplicants(tenant, token).then((result) => {
          let candidatelist = [];
          let candidateUserNames = result.map((item) => item.userName);
          inquirer
            .prompt({
              type: "list",
              name: "applicant",
              message: "Chose an applicant",
              choices: candidateUserNames,
            })
            .then((answer) => {
              //Get the applicant username whose activity needs to be viewed
              const applicantUserName = answer.applicant;
              //Set candidate status to EmployerInterview
              applicants
                .getApplicantActivity(applicantUserName, token)
                .then((res) => {
                  const activityDetails = res.reduce(
                    (activityDetails, item) => {
                      activityDetails.push({
                        Activity: item.activity,
                        CreatedDate: new Date(item.createdAt),
                      });
                      return activityDetails;
                    },
                    []
                  );
                  console.table(activityDetails);
                  logger.processLogs(
                    username,
                    tenant,
                    `Candidate ${applicantUserName} viewed activity`
                  );
                  adminWorkFlow({ token, username, tenant });
                })
                .catch((err) =>
                  console.log("Error getting candidate activity report", err)
                );
            });
        });
      } else if (JSON.stringify(answer.adminchoice).search("Create") != -1) {
        //Generate Invoice flow

        //Get the list of All Applicants
        applicants.getApplicants(tenant, token).then((result) => {
          let candidatelist = [];
          let candidateUserNames = result.reduce((candidateUserNames, item) => {
            //Filter candidates who are interviewed already
            if (
              ((item.appStatus.localeCompare("InterviewAccepted") == 0 ||
                item.appStatus.localeCompare("EmployerOffered") == 0 ||
                item.appStatus.localeCompare("ApplicantAccepted") == 0 ||
                item.appStatus.localeCompare("ApplicantRejected") == 0) &&
                item.payOpt == "PerInterview" &&
                item.billingStatus == "NotBilled") ||
              (item.appStatus == "ApplicantAccepted" &&
                item.payOpt == "OneTimeFee" &&
                item.billingStatus == "NotBilled")
            ) {
              candidateUserNames.push(item.userName);
            }
            return candidateUserNames;
          }, []);

          if (candidateUserNames.length == 0) {
            console.log("No candidates to create Invoice");
            return;
          }

          result.forEach((item) => {
            candidatelist.push({ [item.userName]: item.id });
          });

          inquirer
            .prompt({
              type: "list",
              name: "applicant",
              message: "Chose an applicant",
              choices: candidateUserNames,
            })
            .then((answer) => {
              const applicantUserName = answer.applicant;
              const candidate = candidatelist.filter(
                (item) => item[applicantUserName]
              );
              const applicantInfo = {
                //Set the applicant status to job offered
                billingStatus: "Billed",
                candidateID: candidate[0][applicantUserName],
                candidateUserName: applicantUserName,
              };
              //Set the applicant status to EmployerOffered
              applicants
                .updateApplicantInfo(applicantInfo, token)
                .then((res) => {
                  console.log("Candidate Invoiced succesfully");
                  logger.processLogs(
                    username,
                    tenant,
                    `Candidate ${applicantUserName} invoiced`
                  );
                  adminWorkFlow({ token, username, tenant });
                })
                .catch((err) =>
                  console.log("Error creating Invoice for candidate", err)
                );
            });
        });
      } else if (JSON.stringify(answer.adminchoice).search("Status") != -1) {
        //Get the list of All Applicants
        applicants.getApplicants(tenant, token).then((result) => {
          const applicantdetails = result.reduce((applicantdetails, item) => {
            applicantdetails.push({
              UserName: item.userName,
              AppStatus: item.appStatus,
              PaymentOption: item.payOpt,
              BillingStatus: item.billingStatus,
            });
            return applicantdetails;
          }, []);
          console.table(applicantdetails);
          logger.processLogs(username, tenant, `viewed invoice status`);
          adminWorkFlow({ token, username, tenant });
        });
      }
    })
    .catch((err) => console.log("Admin process exited with error!", err));
};

module.exports = {
  adminWorkFlow,
};
