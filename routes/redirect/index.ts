import { Redirect } from "../../utils/helper";

export async function GET(req: Request): Promise<Response> {
    // Redirect to a URL with this simple function.
    return Redirect("https:/youtube.com/watch?v=dQw4w9WgXcQ");
}