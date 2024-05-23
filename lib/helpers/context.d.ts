type ContextType = {
    json: (json: object, status?: number) => Promise<Response>;
    pretty: (json: object, status?: number) => Promise<Response>;
    text: (text: string, status?: number) => Promise<Response>;
    html: (html: string, status?: number) => Promise<Response>;
    error: (message: string, status?: number) => Promise<Response>;
    success: (message: string, status?: number) => Promise<Response>;
    redirect: (url: string, status?: number) => Promise<Response>;
    sendFile: (filePath: string, status?: number) => Promise<Response>;
    readHtml: (filePath: string) => Promise<string>;
    query: {
        get: (key: string) => string | null;
    };
    req: Request;
};
declare function Context(request: Request): ContextType;
export { Context, type ContextType };
