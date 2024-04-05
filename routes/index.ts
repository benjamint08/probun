// Every helper function has a way to change the status code of the response.
import { Failure, SendJSON, Success } from "../helper";
import { query } from "../query";

export async function GET(req: Request): Promise<Response> {
    const name = await query(req, "name"); 

    // Using the helper function "Success" to return a successful response with a message "Everything is working!
    return SendJSON({
        message: `${name ? `Hello, ${name}!` : "Hello, World!"}`,
    }, 200)
}

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        // This is how you can access the body of a POST request ^
        // If this fails, it will throw an error, but it won't crash the server, because the "handle" function
        // is wrapped in a try-catch block in the main handler function.
        // @ts-ignore
        if(body.data === "hi") {
            return Success("Hello friend!")
        }

        // Send JSON with this simple function.
        return SendJSON({
            message: "You just sent a post request!"
        })
    } catch (error) {
        // This is an easy way to send a failure response with a message. Default status is 400. But its changeable.
        return Failure("Invalid JSON.")
    }
}