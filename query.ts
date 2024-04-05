export async function query(req: Request, query: string): Promise<string | null> {
  // Get all the query parameters from the URL
  const url = new URL(req.url);
  const params = url.searchParams;

  // Retrieve the value of the query parameter
  const value = params.get(query);

  if (!value) {
    return null;
  } else {
    return value;
  }
}