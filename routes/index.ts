export async function GET(req: Request): Promise<Response> {
    return new Response("You just did a get request to /!");
}

export async function POST(req: Request): Promise<Response> {
    return new Response("You just did a post request to /!");
}