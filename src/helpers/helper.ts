async function SendJSON(json: any, status: number = 200): Promise<Response> {
    return new Response(JSON.stringify(json), {
        headers: {
            "Content-Type": "application/json"
        },
        status
    });
}

function Success(message: string, status: number = 200): Promise<Response> {
    return SendJSON({
        message
    }, status);
}

function Failure(message: string, status: number = 400): Promise<Response> {
    return SendJSON({
        message
    }, status);
}

function ServerFailure(message: string, status: number = 500): Promise<Response> {
    return SendJSON({
        message
    }, status);
}

function Redirect(destination: string, status: number = 302): Response {
    return new Response(null, {
        status,
        headers: {
            "Location": destination
        }
    });
}

function Html(html: string, status: number = 200): Response {
    return new Response(html, {
        headers: {
            "Content-Type": "text/html"
        },
        status
    });
}

export { SendJSON, Success, Failure, ServerFailure, Redirect, Html };