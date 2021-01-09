const {
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    CreateLogStreamCommand,
    PutLogEventsCommand,
  } = require("@aws-sdk/client-cloudwatch-logs");

const moment = require("moment")

  export default {

      async processLogs(cred,username, usergroup, action){
          const currmin = moment().format("mm") % 10
          const streamname = usergroup +"-"+ moment().subtract(currmin,"m").format("YYYY-MM-DD-HH-mm");
          let cwclient = new CloudWatchLogsClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });

          const params = {
              logGroupName: "acme-resume-services",
              logStreamNamePrefix: streamname,
          }

          const streaminfo = await cwclient.send(new DescribeLogStreamsCommand(params))

          const logeventdata = await this.putLogStreamData(cred,username, usergroup, action,streaminfo, streamname);

          return logeventdata;

      },

      async putLogStreamData(cred,username, usergroup, action,streaminfo, streamname){

        const date = new Date().valueOf();
        let cwclient = new CloudWatchLogsClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });

        //Log stream does not exist
        if(streaminfo.logStreams.length == 0)
        {
            const logstreamparams = {
                logGroupName: "acme-resume-services",
                logStreamName: streamname,
            }  
           await cwclient.send(new CreateLogStreamCommand(logstreamparams))

            let logeventsparams = {
                logEvents: [ /* required */
                  {
                    message: "username:"+username + ", usergroup:"+usergroup +  " , action:" + action , /* required */
                    timestamp: date /* required */
                  },
                  /* more items */
                ],
                logGroupName: "acme-resume-services", /* required */
                logStreamName: streamname, /* required */
              }

            await cwclient.send(new PutLogEventsCommand(logeventsparams))
        }
        else //Logstream exists
        {
            let logeventsparams = {
                logEvents: [ /* required */
                  {
                    message: "username:"+username + ", usergroup:"+usergroup +  " , action:" + action , /* required */
                    timestamp: date /* required */
                  },
                  /* more items */
                ],
                logGroupName: "acme-resume-services", /* required */
                logStreamName: streamname, /* required */
                sequenceToken: streaminfo.logStreams[0].uploadSequenceToken
              }

            await cwclient.send(new PutLogEventsCommand(logeventsparams))

        }

      }

  }