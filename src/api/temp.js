var AWS = require('aws-sdk');
const aws_exports = require('../aws-exports');
// var credentials = new AWS.SharedIniFileCredentials({profile: 'amplify-cli'});
// AWS.config.credentials = credentials;

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18',region: 'us-east-1'});

const userpoolId = aws_exports.aws_user_pools_id;


const createUserGroup =  (groupname,role_arn) =>{
    var params = {
        GroupName: groupname, /* required */
        UserPoolId: userpoolId, /* required */
        RoleArn: role_arn
      };
      cognitoidentityserviceprovider.createGroup(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

}

createUserGroup("recruitero","arn:aws:iam::592740107858:role/us-east-1_z1BhQlLkL-recruiterGroupRole")