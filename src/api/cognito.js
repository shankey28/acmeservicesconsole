var AWS = require('aws-sdk');
const aws_exports = require('../aws-exports');
// var credentials = new AWS.SharedIniFileCredentials({profile: 'amplify-cli'});
// AWS.config.credentials = credentials;

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18',region: 'us-east-1'});

const userpoolId = aws_exports.aws_user_pools_id;


const createUser =  (loginInfo) =>{
        let {email, usergroup,username, password} = loginInfo;
        if(usergroup != "admin") 
        //the actual cognito usergroup name is in dynamic key name represented by the usergroup value
         usergroup  =  loginInfo[usergroup];
        var params = {
            UserPoolId: userpoolId, /* required */
            Username: username, /* required */
            ForceAliasCreation: false,
            TemporaryPassword: password,
            UserAttributes: [
              {
                Name: 'email', /* required */
                Value: email
              },
              {
                Name: 'email_verified', /* required */
                Value: 'True'
              },
              /* more items */
            ],

          };

          cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
            if (err){
                console.log("Error creating user: ",err)

            } 
            else {

                var confirmpwdparams = {
                    Password: password, /* required */
                    UserPoolId: userpoolId, /* required */
                    Username: username, /* required */
                    Permanent: true 
                  };
                  cognitoidentityserviceprovider.adminSetUserPassword(confirmpwdparams, function(err, data) {
                    if (err){
                        console.log(err, err.stack); // an error occurred
                    } 
                    else   {
                        var params = {
                            GroupName: usergroup, /* required */
                            UserPoolId: userpoolId, /* required */
                            Username: username /* required */
                          };
                          cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                            }
                            else {
                                console.log("User created!");         
                            }             // successful response
                          });
    
                    }  
                  });


            }      // successful response
          });

}

module.exports = {
    createUser
}