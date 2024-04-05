export async function cors(req: Request, props: any): Promise<void> {
    // props is { customHeaders: Headers }
    props.customHeaders.set("Access-Control-Allow-Origin", "*");
    return;
}