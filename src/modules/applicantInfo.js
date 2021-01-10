"use strict";
/**
* This shows how to use standard Apollo client on Node.js
*/

global.WebSocket = require('ws');
require('es6-promise').polyfill();
require('isomorphic-fetch');

// Require exports file with endpoint and auth info
const aws_exports = require('../aws-exports');

// Require AppSync module
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;

const url = aws_exports.aws_appsync_graphqlEndpoint;
const region = aws_exports.aws_appsync_region;
const type = AUTH_TYPE.AMAZON_COGNITO_USER_POOLS;


const Auth = require('aws-amplify').Auth;

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag');
let client;

const listfemaleapplicants = gql(`
query listapplicants{
    listApplicantProfileNs(filter:{gender:{eq:Female}})
    {
      items
      {
        id
        userName
        appStatus
        email
      }
    }
  }
`)

const listApplicant = gql(`
query listApplicant($userName: String){
    listApplicantProfileNs(userName:$userName){
      items
      {
        id
        appStatus
      }
    }
  
  }
`)



const listByFocus = gql(`
query getApplicantsbyCareerFocus($caFocus:CareerFocus!,$yOe:String) {
    byCareerFocus(caFocus:$caFocus, yOe: { eq: $yOe }) {
      items 
      {
        id
        userName
        appStatus
        email
      }
    }
  }

`)

const insertComment = gql(`
mutation addcomment($candidateID: ID!, $comment: String!, $applicantEmail: String){
    createRecuriterCommentN(input:{ 
        candidateID: $candidateID
        comment: $comment
        applicantEmail: $applicantEmail

    })
    {
      id
    }
  }
`);

const updateProfile = gql(`
mutation updateprofile($candidateID:ID!,$candidateUserName:String!,$appStatus:ApplicantStatus,$employer:String) {
    updateApplicantProfileN(input:{
        id:$candidateID,
        userName:$candidateUserName,
        appStatus:$appStatus,
        employer:$employer})
    {
      id
    }
  } 
`);

const createActivity = gql(`
mutation createActivity($userName: String!,$activity:ApplicantAction){
    createApplicantActivityN(input:{
        userName:$userName,
        activity:$activity})
    {
      id
    }
  }

`);




// Set up Apollo client
function initializeClient(token){
     client = new AWSAppSyncClient({
        url: url,
        region: region,
        auth: {
            type: type,
            jwtToken: token
        },
        disableOffline: true      //Uncomment for AWS Lambda
    });
    

}


const getApplicants =  (username,token)=> new Promise((res,rej)=>{
    if(!client)
    initializeClient(token);

    if(username.localeCompare("brooklynf") == 0 || username.localeCompare("employerf") == 0){

            client.hydrated().then(function (client) {
                //Now run a query
                client.query({ query: listfemaleapplicants })
                    .then(function logData(result) {
                        res(result.data.listApplicantProfileNs.items);
                    })
                    .catch((err)=>{
                         rej(false);
                    });
            
            });
    }
    else if(username.localeCompare("atlanta4") == 0 || username.localeCompare("employer4") == 0)
    {
        client.hydrated().then(function (client) {
            //Now run a query
            client.query({ query: listByFocus,variables:{caFocus:"Other", yOe: "Morethan4"}  })
                .then(function logData(result) {
                    res(result.data.byCareerFocus.items);
                })
                .catch((err)=>{
                     rej(false);
                });
        
        });

    }
    else if(username.localeCompare("memphiso") == 0 || username.localeCompare("employero") == 0)
    {
        client.hydrated().then(function (client) {
            //Now run a query
            client.query({ query: listByFocus,variables:{caFocus:"Other",yOe: "Lessthan4"}  })
                .then(function logData(result) {
                    res(result.data.byCareerFocus.items);
                })
                .catch((err)=>{
                     rej(false);
                });
        
        });

    }
    else if(username.localeCompare("stlouish") == 0 || username.localeCompare("employerh") == 0)
    {
        client.hydrated().then(function (client) {
            //Now run a query
            client.query({ query: listByFocus,variables:{caFocus:"HealthCare"}  })
                .then(function logData(result) {
                    res(result.data.byCareerFocus.items);
                })
                .catch((err)=>{
                     rej(false);
                });
        
        });

    }

});



const getApplicantStatus =  (userName,token)=> new Promise((res,rej)=>{

    if(!client)
    initializeClient(token);

    client.hydrated().then(function (client) {
            //Now run a query
        client.query({ query: listApplicant, variables:{userName: userName} })
        .then(function logData(info) {
            //console.log('results of mutate: ', data);
            res(info.data.listApplicantProfileNs.items[0]);
        })
        .catch((err)=>{
            console.log(err)
            rej(false);
        });

    
    });

});


const addComment =  (candidateInfo,comment,token)=> new Promise((res,rej)=>{

        if(!client)
        initializeClient(token);

        const info = candidateInfo.split(",")

        client.hydrated().then(function (client) {
                //Now run a query
            client.mutate({ mutation: insertComment, variables:{candidateID: info[0],comment: comment, applicantEmail: info[1]} })
            .then(function logData(data) {
                //console.log('results of mutate: ', data);
                res(true)
            })
            .catch((err)=>{
                console.log(err)
                rej(false);
            });

        
        });

});


const updateActivity =  (userName,activity,token)=> new Promise((res,rej)=>{

    if(!client)
    initializeClient(token);

    client.hydrated().then(function (client) {
            //Now run a query
        client.mutate({ mutation: createActivity, variables:{userName: userName, activity: activity} })
        .then(function logData(data) {
            //console.log('results of mutate: ', data);
            res(true)
        })
        .catch((err)=>{
            console.log(err)
            rej(false);
        });

    
    });

});


//Recruiter to Employer mapping to assign employer when recruiter submits for interview
const recruiterMapping = {
    brooklynf:"employerf",
    atlanta4:"employer4",
    stlouish:"employerh",
    memphiso:"employero"
}

const updateApplicantInfo =  (applicantInfo,token)=> new Promise((res,rej)=>{

    if(!client)
    initializeClient(token);

    let {appStatus,employer,candidateID,candidateUserName,recruiterName} = applicantInfo;

    if(!employer && appStatus == "SubmittedToEmployer")
    {
        employer = recruiterMapping[recruiterName];

    }

    client.hydrated().then(function (client) {
            //Now run a query
        client.mutate({ mutation: updateProfile, variables:{candidateID:candidateID,candidateUserName:candidateUserName,appStatus:appStatus,employer:employer} })
        .then(function logData(data) {
            //console.log('results of mutate: ', data);
            res(true)
        })
        .catch((err)=>{
            console.log(err)
            rej(false);
        });

    
    })
    .catch((err)=>{
        console.log(err)
        rej(false);
    });;

});


module.exports = {
    getApplicants,
    addComment,
    updateApplicantInfo,
    getApplicantStatus,
    updateActivity
}

