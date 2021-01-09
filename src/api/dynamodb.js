
const {DynamoDBClient,DescribeTableCommand, DeleteTableCommand,CreateTableCommand,BatchWriteItemCommand,ScanCommand} = require("@aws-sdk/client-dynamodb");
import parse from "csv-parse/lib/sync";


export default {

      async checkTableExists(tablename,cred) {
         let dbclient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });
          try{
          let data = await dbclient.send(new DescribeTableCommand({TableName:tablename}));
          console.log("Table exists: ", data)
          return true;
          }
          catch(err)
          {
              console.log("Table does not exist",err);
              return false;

          }
        


    },

     async createTable(tablename,cred){
        let dbclient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });
        let params = {
            TableName : tablename,
            KeySchema: [       
                { AttributeName: "year", KeyType: "HASH"},  //Partition key
            ],
            AttributeDefinitions: [       
                { AttributeName: "year", AttributeType: "S" },
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };
        
        try{
            let data = await dbclient.send(new CreateTableCommand(params));
            console.log("Table created: ", data)
            return true;
            }
            catch(err)
            {
                console.log("Error creating table",err);
                return false;
  
            }

    },
    async deleteTable(tablename,cred)
    {
        let dbclient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });
         
         let params ={TableName:tablename};
         try{
            let data = await dbclient.send(new DeleteTableCommand(params));
            console.log("Table deleted: ", data)
            return true;
            }
            catch(err)
            {
                console.log("Error deleting table",err);
                return false;
  
            }

        

    },
    async readFileAsText(file){
        let content = new Promise((res)=>{
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                res(fileReader.result);
                console.log("text converted: ",e);
            };
            return fileReader.readAsText(file);
        });
        return content ;
    },
    async updateTable(tablename,file,cred){
        const params = {RequestItems:{}};
        let dbclient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });

          const contents = await this.readFileAsText(file);

          const data = parse(contents,{columns:true});
          let tableitems = [];
          data.forEach((item)=>{
              tableitems.push({PutRequest:{
                Item:{
                    year: {S:item["year"]},
                    title: {S:item["title"]}
                  }
              }
          });
        });
            params.RequestItems = {
                [tablename] : tableitems 
            }
          try{
             let res = await dbclient.send(new BatchWriteItemCommand(params));
             console.log("Success updating DDB table: ",res);
             return true;
          }
          catch(err){
              console.log("Error updating table: ",err)
              return false;

          }

    },

    async getTableData(tablename,cred){
        let dbclient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: cred.accessKeyId,
                secretAccessKey: cred.secretAccessKey,
                sessionToken: cred.sessionToken
            }
          });
         
         let params ={TableName:tablename};

         try{
            let res = await dbclient.send(new ScanCommand(params));
            console.log("Success retrieving DDB table: ",res);
            return res;
         }
         catch(err){
             console.log("Error retrieving table data: ",err)
             return false;

         }


    }
}

