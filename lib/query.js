// @bun
async function query(req,query2){const url=new URL(req.url);const params=url.searchParams;const value=params.get(query2);if(!value){return null}else{return value}}export{query};
