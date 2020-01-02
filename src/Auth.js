const Axios = require('axios');
const Logger = require('./Logger');
const btoa = require("btoa");

class Auth {

    constructor() {
        this.AUTH_SERVER = process.env.AUTH_SERVER;
        this.AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;
        this.AUTH_GRANT_TYPE = 'client_credentials';
        this.TOKEN_TYPE = 'Basic ';
    }

    async authenticate({clientId, clientSecret}){

        let logger = new Logger();
        let encodedSecret = btoa(`${clientId}:${clientSecret}`);
        let basicToken = `${this.TOKEN_TYPE}${encodedSecret}`;
        let url = `${this.AUTH_SERVER}${this.AUTH_ENDPOINT}?grant_type=${this.AUTH_GRANT_TYPE}`;
        let token = null;

        await Axios.post(url, {}, {
            headers: {
                'Authorization': `${basicToken}`,
                'Content-Type': `application/x-www-form-urlencoded`
            }
        })
        .then(function (res) {
            logger.log(`[INFO] Token request successfully sent.`, res);
            token = res.data.access_token;
        })
        .catch(function (error) {
            logger.log(`[ERROR] Token request failed with error: `, error);
        })
        
        return token;
    }

}

module.exports = Auth;