export async function powered(req: Request, props: any): Promise<void> {
    // props is { headers: Headers }
    props.headers.set("X-Powered-By", "ProBun");
    return;
}