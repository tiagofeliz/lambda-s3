const Aws = require('aws-sdk');

class SSMManager {
    
    constructor() {
        this.awsSSM = new Aws.SSM();
        this.SSM_PARAM = process.env.SSM_PARAM;
        this.decryption = true
    }

    async getCredentials(){
        let credentials = await this.getParameters();
        return {
            "clientId": credentials.split(':')[0],
            "clientSecret": credentials.split(':')[1]
        }
    }

    async getParameters(){
        let params = {
            Name: this.SSM_PARAM,
            WithDecryption: this.decryption
        };
       
        let request = await this.awsSSM.getParameter(params).promise();
       
        return request.Parameter.Value;
    }

}

module.exports = SSMManager;