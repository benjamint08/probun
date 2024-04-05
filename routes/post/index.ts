export async function handle(req: Request): Promise<Response> {
    const body = await req.json();
    // This is how you can access the body of a POST request ^
    // If this fails, it will throw an error, but it won't crash the server, because the "handle" function
    // is wrapped in a try-catch block in the main handler function.
    if(body.data === "hi") {
        return new Response("Hello!");
    }
    return new Response("You just did a post request to /!");
}