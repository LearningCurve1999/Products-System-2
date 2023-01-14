class AppError extends Error{
    constructor(message,status){
        super();
        this.message = message;
        this.status = status;
    } //Custom Handling Error 
}
module.exports = AppError;
//exports then require to the target path