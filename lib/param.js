// @bun
async function param(req){const url=new URL(req.url);let splitUrl=req.url.split("/");let id=splitUrl[splitUrl.length-1];if(id===""){id=splitUrl[splitUrl.length-2]}if(!id){return null}else{return id}}export{param};
