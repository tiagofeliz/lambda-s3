class Logger {

    constructor() {
        this.logs = [];
    }

    get count() {
        return this.logs.length;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`);
    }

    log(message, obj = null) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        if(obj != null){
            console.log(`${timestamp} - ${message}`, obj);
        }else{
            console.log(`${timestamp} - ${message}`);
        }
    }

}

module.exports = Logger;