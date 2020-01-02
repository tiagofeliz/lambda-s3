const Aws = require('aws-sdk');

class SSMManager {
    
    constructor() {
        this.awsSSM = new Aws.SSM();
        this.SSM_Param = 'lambda-backoffice-payment-lot';
        this.Decryption = true
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
            Name: this.SSM_Param,
            WithDecryption: this.Decryption
        };
       
        let request = await this.awsSSM.getParameter(params).promise();
       
        return request.Parameter.Value;
    }

}

module.exports = SSMManager;