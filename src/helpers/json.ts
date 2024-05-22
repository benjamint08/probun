export async function json(req: Request): Promise<Object>{
    // @ts-ignore
    const readableStream = await req.body.getReader().read();
    const uint8Array = readableStream.value;
    const bodyString = new TextDecoder().decode(uint8Array);
    let body: any = {};
    bodyString.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        // decode value because it is URL encoded
        body[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return body;
}