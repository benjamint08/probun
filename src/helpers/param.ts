export async function param(req: Request): Promise<string | null>{
    const url = new URL(req.url);
    let splitUrl = req.url.split("/");
    let id = splitUrl[splitUrl.length - 1];
    if(id === "") {
        id = splitUrl[splitUrl.length - 2];
    }
    if (!id) {
        return null
    } else {
        // We make sure to remove query params ?...
        return id.replace(/\?.*/, "");
    }
}