import { Html } from "../../helper";

export async function GET(req: Request): Promise<Response> {
    // Send HTML with this simple function.
    return Html("<h1>Hello, World!</h1>");
}