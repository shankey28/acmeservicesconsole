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
      }
    }
  }
`)
const getApplicantsbyCareerFocus = gql(`
query getApplicantsbyCareerFocus($caFocus:CareerFocus!,$yOe:YearOfExperience!) {
    byCareerFocus(input: {caFocus:$caFocus, yOe: { eq: $yOe }}) {
      items 
      {
        id
        userName
      }
    }
  }

`)

const listByFocus = gql(`
query getApplicantsbyCareerFocus($caFocus:CareerFocus!,$yOe:String!) {
    byCareerFocus(caFocus:$caFocus, yOe: { eq: $yOe }) {
      items 
      {
        id
        userName
      }
    }
  }

`)

const insertComment = gql(`
mutation addcomment($candidateID: ID!, $comment: String!){
    createRecuriterCommentN(input:{ 
        candidateID: $candidateID
        comment: $comment
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

    if(username == ("brooklynf" || "employerf")){

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
    else if(username == ("atlanta4" || "employer4"))
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
    else if(username == ("memphiso" || "employero"))
    {
        client.hydrated().then(function (client) {
            //Now run a query
            client.query({ query: listByFocus,variables:{caFocus:"Other"}  })
                .then(function logData(result) {
                    res(result.data.byCareerFocus.items);
                })
                .catch((err)=>{
                     rej(false);
                });
        
        });

    }
    else if(username == ("stlouish" || "employerh"))
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


const addComment =  (id,comment,token)=> new Promise((res,rej)=>{

        if(!client)
        initializeClient(token);

        client.hydrated().then(function (client) {
                //Now run a query
            client.mutate({ mutation: insertComment, variables:{candidateID: id,comment: comment } })
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

//Recruiter to Employer mapping
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
    updateApplicantInfo
}

