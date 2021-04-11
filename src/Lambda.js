const Logger = require('./Logger');
const Axios = require('axios');
const Util = require('util');
const Aws = require('aws-sdk');
const Async = require('async');
const FormData = require('form-data');
const SSMManager = require('./SSMManager');
const Auth = require('./Auth')

class Lambda {
    
    constructor() {        
        this.logger = new Logger();
        this.targetFolder = "uploaded-receive-files";
    }

    async main(event, callback) {
        this.logger.log("[INFO] Reading options from event:\n", Util.inspect(event, {depth: 5}));
        const bucketName = event.Records[0].s3.bucket.name;
        
        const triggerObject = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

        const targetObject = triggerObject.replace("received", this.targetFolder);
        
        const objectName = triggerObject.split("received/");

        this.logger.log(`[INFO] Bucket source: ${bucketName}`)
        this.logger.log(`[INFO] Trigger object: ${triggerObject}`)
        this.logger.log(`[INFO] Target object: ${targetObject}`)

        const credentials = await this.getSecurityCredentials();

        const token = await this.getToken(credentials);

        this.upload(callback, token, {
            bucketName,
            objectName,
            triggerObject,
            targetObject
        });
        
    }

    async getSecurityCredentials(){
        const ssmManager = new SSMManager();
        return await ssmManager.getCredentials();
    }

    async getToken(credentials){
        const auth = new Auth();
        return await auth.authenticate(credentials);
    }

    upload(callback, token, {bucketName, objectName, triggerObject, targetObject}){
        const awsS3 = new Aws.S3();
        const TOKEN_TYPE = "Bearer ";
        const SERVER = process.env.SERVER
        const ENDPOINT = process.env.ENDPOINT
        const logger = new Logger();
        
        let formData = new FormData();

        Async.waterfall([
            function download(next) {
                awsS3.getObject({
                    Bucket: bucketName,
                    Key: triggerObject
                }, next);
            },
            // Uploading received file to a endpoint using axios (example)
            function upload(response, next) {
                formData.append('data', response.Body, objectName);
                Axios.post(`${SERVER+ENDPOINT}`, formData, {
                    headers: {
                        'Authorization': `${TOKEN_TYPE+token}`,
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                    }
                })
                .then(function (res) {
                    logger.log(`[INFO] Request successfully sent.`, res);
                    next(null, response.ContentType, response.Body);
                })
                .catch(function (error) {
                    logger.log(`[ERROR] Error in request with error: `, error);
                })
            },
            function copy(contentType, data, next) {
                awsS3.putObject({
                    Bucket: bucketName,
                    Key: targetObject,
                    Body: data,
                    ContentType: contentType
                }, next);
            },
            function remove(response, next) {
                awsS3.deleteObject({
                    Bucket: bucketName,
                    Key: triggerObject,
                }, next);
            }
        ], function (err) {
            if (err) {
                logger.log(`[ERROR] Error in upload received file with error: `, err);
            } else {
                logger.log("[INFO] File uploaded successfully");
            }
            callback(null, "message");
        });
    }

}

module.exports = Lambda;