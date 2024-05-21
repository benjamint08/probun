declare function SendJSON(json: object, status?: number): Promise<Response>;
declare function Success(message: string, status?: number): Promise<Response>;
declare function SendFile(filePath: any, status?: number): Promise<Response>;
declare function Failure(message: string, status?: number): Promise<Response>;
declare function ServerFailure(message: string, status?: number): Promise<Response>;
declare function Redirect(destination: string, status?: number): Response;
declare function Html(html: string, status?: number): Response;
export { SendJSON, Success, Failure, ServerFailure, Redirect, Html, SendFile };
