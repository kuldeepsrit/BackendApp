import { HttpStatusCodeType, HTTPSTATUS } from "../config/http.config"
import { ErrorCodeEnum, ErrorCodeEnumValue } from "../enums/error-code.enum";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumValue;

    constructor(
        message: string,
        statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        errorCode?: ErrorCodeEnumValue
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}


export class HttpException extends AppError{

    constructor( message ="Http exception error ",statusCode: HttpStatusCodeType,  errorCode?:ErrorCodeEnumValue ){
        super(message , statusCode,errorCode);
    }
}

export class NotFoundException extends AppError{

    constructor( message ="Resources Not Found",  errorCode?:ErrorCodeEnumValue ){
        super(message , 
            HTTPSTATUS.NOT_FOUND,
            errorCode ||ErrorCodeEnum.RESOURCE_NOT_FOUND
 );
    }
}

export class BadRequestException extends AppError{

    constructor( message ="Bad Request",  errorCode?:ErrorCodeEnumValue ){
        super(message, 
            HTTPSTATUS.BAD_REQUEST,
            errorCode ||ErrorCodeEnum.VALIDATION_ERROR
 );
    }
}

export class UnauthorizedException extends AppError{

    constructor( message ="Unauthorized access",  errorCode?:ErrorCodeEnumValue ){
        super(message, 
            HTTPSTATUS.UNAUTHORIZED,
            errorCode ||ErrorCodeEnum.ACCESS_UNAUTHORIZED
 );
  }
}


export class InternalServerException extends AppError{

    constructor( message ="Internal Server Error",  errorCode?:ErrorCodeEnumValue ){
        super(message, 
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode ||ErrorCodeEnum.INTERNAL_SERVER_ERROR
            
        );
    }
}

