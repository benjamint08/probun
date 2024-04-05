export async function powered(req: Request, props: any): Promise<void> {
    // props is { customHeaders: Headers }
    props.customHeaders.set("X-Powered-By", "ProBun");
    return;
}