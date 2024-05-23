import * as path from "path/posix";

type ContextType = {
  json: (json: object, status?: number) => Promise<Response>;
  pretty: (json: object, status?: number) => Promise<Response>;
  text: (text: string, status?: number) => Promise<Response>;
  html: (html: string, status?: number) => Promise<Response>;
  error: (message: string, status?: number) => Promise<Response>;
  success: (message: string, status?: number) => Promise<Response>;
  redirect: (url: string, status?: number) => Promise<Response>;
  sendFile: (filePath: string, status?: number) => Promise<Response>;
  readHtml: (filePath: string) => Promise<string>;
  query: {
    get: (key: string) => string | null;
  };
  req: Request;
};

function Context(request: Request): ContextType {
  const json = async (json: object, status: number = 200) => {
    return new Response(JSON.stringify(json), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const pretty = async (json: object, status: number = 200) => {
    return new Response(JSON.stringify(json, null, 2), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const text = async (text: string, status: number = 200) => {
    return new Response(text, {
      status,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  };

  const html = async (html: string, status: number = 200) => {
    return new Response(html, {
      status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  };

  const error = async (message: string, status: number = 500) => {
    return json({ error: message }, status);
  };

  const success = async (message: string, status: number = 200) => {
    return json({ message }, status);
  };

  const redirect = async (url: string, status: number = 302) => {
    return new Response(null, {
      status,
      headers: {
        Location: url,
      },
    });
  };

  const sendFile = async (filePath: string, status: number = 200) => {
    const file = Bun.file(filePath);
    let rawFileName = path.basename(filePath);
    rawFileName = rawFileName.replace(/ /g, "_");
    rawFileName = rawFileName.replace(/\\/g, "_");
    rawFileName = rawFileName.split("_")[rawFileName.split("_").length - 1];
    return new Response(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${rawFileName}"`,
      },
      status,
    });
  };

  const query = {
    get: (key: string) => {
      return new URL(request.url).searchParams.get(key);
    },
  };

  const readHtml = async (filePath: string) => {
    if (!filePath.endsWith(".html")) throw new Error("File must be an HTML file");
    const file = await Bun.file(filePath).text();
    return file;
  };

  return {
    json,
    pretty,
    text,
    html,
    error,
    success,
    redirect,
    sendFile,
    readHtml,
    query,
    req: request,
  };
}

export { Context, type ContextType };
