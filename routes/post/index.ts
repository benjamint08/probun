export async function handle(req: Request): Promise<Response> {
    return new Response("You just did a post request to /!");
}