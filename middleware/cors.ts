export async function cors(req: Request, props: any): Promise<void> {
    // props is { customHeaders: Headers }
    props.headers.set("Access-Control-Allow-Origin", "*");
    return;
}