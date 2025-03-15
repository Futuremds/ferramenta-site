import{createRequire}from"module";let require=createRequire(import.meta.url),cheerio=require("cheerio"),{exec,execSync,spawn,cwd,stdin}=require("child_process");import{app,BrowserWindow,ipcMain,shell}from"electron";import fs from"fs";import path from"path";import{fileURLToPath}from"url";import fetch from"node-fetch";import{time}from"console";let __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);function createWindow(){new BrowserWindow({width:1366,height:768,webPreferences:{nodeIntegration:!1,contextIsolation:!0,preload:path.join(__dirname,"preload.js")}}).loadFile("interface.html")}function editarPágina(e,t,o){console.log("start edititing");try{var r,a,i,n=fs.readFileSync(e,"utf-8"),l=cheerio.load(n),s={"#titulo":t.get("titulo"),"#CNPJ":t.get("CNPJ"),"#instagram":t.get("instagram"),"#nossamissao":t.get("nossamissao"),"#sobre":t.get("sobre"),"#rodape":t.get("rodape"),"#appid":t.get("appid"),"#metapixel":t.get("metapixel"),"#telefone":t.get("telefone"),"#metatag":t.get("metatag")};l("title").html(o);for([r,a]of Object.entries(s))"#instagram"==r?l(r).attr("href",a):"#metapixel"==r?l(r).html(a):"#appid"==r?(i=`<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '${a}',
      cookie     : true,
      xfbml      : true,
      version    : 'v19.0'
    });
    
    FB.AppEvents.logPageView();   
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>`,l(r).replaceWith(i)):"#metatag"==r?l("head").append(a):l(r).html(a);var c=s["#telefone"].replace(/(\d{2})(\d{5})(\d{4})/,"($1) $2-$3");console.log(c);var d=l.html().replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,""+t.get("email")).replace(/(?:\+?\d{1,3}\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}/g,""+s["#telefone"].replace(/(\d{2})(\d{5})(\d{4})/,"($1) $2-$3")).replace(/(wa.me\/).*?(\?text)/,`$1${s["#telefone"]}$2`),p=cheerio.load(d);return p(".elementor-spacer-inner").attr("style","height: 150px"),p.html()}catch(e){return console.error("Erro ao editar o arquivo HTML:",e),null}}console.log(__dirname),ipcMain.handle("executar-script",async(e,t)=>(console.log("Script Node.js executado com os argumentos:",t),"Script executado com sucesso! Argumentos: "+t));let filePath="backup.html";ipcMain.handle("editar-página",async(e,t)=>{console.log("Script Node.js executado com os argumentos:",t);var o,r=t.get("titulo").toLowerCase().replaceAll(" ","-"),t=editarPágina(filePath,t,r);fs.writeFileSync("./deployment/index.html",t),fs.writeFileSync(".gitignore",["node_modules","cu.js","main.js","interface.html","outcu.txt","package.json","package-lock.json","penes.html","backup.html","preload.js","scriptanal.js"].join("\n"));for(o of["vercel login --github","vercel projects add "+r,"vercel link --yes --project "+r,"vercel --prod"])execSync(o,{shell:!0,cwd:"./deployment"});fs.rmdir("./deployment/.vercel",{recursive:!0,force:!0},e=>{e?console.log("vai pro krl"):console.log("ai sim pai")})}),app.whenReady().then(createWindow),app.on("window-all-closed",()=>{"darwin"!==process.platform&&app.quit()}),app.on("activate",()=>{0===BrowserWindow.getAllWindows().length&&createWindow()});
