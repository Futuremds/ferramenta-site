import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');
const { exec, execSync, spawn, cwd, stdin } = require('child_process');

import { app, BrowserWindow, ipcMain, shell } from "electron"
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { time } from 'console';


// Obtém o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);

// Obtém o diretório atual
const __dirname = path.dirname(__filename);
console.log(__dirname);

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('interface.html'); // Carrega o arquivo HTML da interface
}

ipcMain.handle('executar-script', async (event, args) => {
  console.log('Script Node.js executado com os argumentos:', args);

  // Aqui você pode rodar qualquer código Node.js
  const resultado = `Script executado com sucesso! Argumentos: ${args}`;
  return resultado;
});

function editarPágina(filePath, args, folder) {
  console.log('start edititing')
  try {
    // 1. Ler o arquivo HTML
    const html = fs.readFileSync(filePath, 'utf-8');

    // 2. Carregar o HTML no cheerio
    let $ = cheerio.load(html);
    const edits = {
      '#titulo': args.get('titulo'), // Altera o conteúdo do elemento com id "titulo"
      '#CNPJ': args.get('CNPJ'),
      '#instagram': args.get('instagram'), // Altera o conteúdo de todos os elementos com a classe "paragrafo"
      '#nossamissao': args.get('nossamissao'),
      '#sobre': args.get('sobre'),
      '#rodape': args.get('rodape'),
      '#appid': args.get('appid'),
      '#metapixel': args.get('metapixel'),
      '#telefone' : args.get('telefone'),
      '#metatag' : args.get('metatag')
    };
    4// 3. Aplicar as edições
    
    $('title').html(folder)
    for (const [selector, newContent] of Object.entries(edits)) {
      if (selector == '#instagram') {
        $(selector).attr('href', newContent)
      } else if (selector == '#metapixel') {
        $(selector).html(newContent);
      } else if (selector == '#appid') {
        const script = `<script>
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '${newContent}',
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
          </script>`
        $(selector).replaceWith(script)
      } else if (selector == '#metatag') {
        $('head').append(newContent)
      } else {
        $(selector).html(newContent); // Substitui o conteúdo do elemento

      }
    }
    const anal = edits['#telefone'].replace(/(\d{2})(\d{5})(\d{4})/, `($1) $2-$3`)
    console.log(anal)
    const rolagrossona = $.html()
    const emailedit = rolagrossona.replace(/E-mail:(.*?).com/g, `E-mail: ${args.get('email').split('.')[0]}.com`)
    const numberedit = emailedit.replace(/(\()(\d{2})(\))( )(\d+)(-)(\d{4})/g, `${edits['#telefone'].replace(/(\d{2})(\d{5})(\d{4})/, `($1) $2-$3`)}`)
    const novapagina = numberedit.replace(/(wa.me\/).*?(\?text)/, `$1${edits['#telefone']}$2`)
    const nou = cheerio.load(novapagina)
    nou('.elementor-spacer-inner').attr('style', 'height: 150px')

    // 4. Retornar o HTML modificado como string
    return nou.html();
  } catch (error) {
    console.error('Erro ao editar o arquivo HTML:', error);
    return null;
  }
}

const filePath = 'backup.html'


ipcMain.handle('editar-página', async (event, args) => {
  console.log('Script Node.js executado com os argumentos:', args);

  // Aqui você pode rodar qualquer código Node.js
  const foldername = args.get('titulo').toLowerCase().replaceAll(' ', '-')
  const modifiedHtml = editarPágina(filePath, args, foldername)
  fs.writeFileSync('./deployment/index.html', modifiedHtml)
  const ignoreList = ['node_modules', 'cu.js', 'main.js', 'interface.html', 'outcu.txt', 'package.json', 'package-lock.json', 'penes.html', 'backup.html', 'preload.js', 'scriptanal.js']
  fs.writeFileSync('.gitignore', ignoreList.join('\n'))
  
  /*try {
    const commands = ['git init','git remote remove origin', `git remote add origin ${args.get('github')}`, 'git branch -M main', 'git add .', 'git commit -m "commit"', 'git push -u origin main']
    for(let command of commands) {
      try {
        const resultado = execSync(command).toString();
        console.log(resultado)
      } catch (err) {
        console.error(`Erro: ${err.message}`)
        continue
      }
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }

  
  const token = 'DJqRrghyY3UIoEj0aKP3fLgH'
  fetch('https://api.vercel.com/v11/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`
    },
    body: JSON.stringify({
      buildCommand: null,
      commandForIgnoringBuildStep: null,
      devCommand: null,
      environmentVariables: [{
        key: '',
        target: 'production',
        gitBranch: 'main',
        type: 'system',
        value: ''
      }],
      framework: null,
      gitRepository: {
        repo: args.get('github'),
        type: 'github'
      },
      installCommand: null,
      name: foldername,
      skipGitConnectDuringLink: true,
      outputDirectory: null,
      publicSource: null,
      rootDirectory: null,
      serverlessFunctionRegion: null,
      serverlessFunctionZeroConfigFailover: true,
      oidcTokenConfig: {
        enabled: true,
        issuerMode: 'global'
      },
      enableAffectedProjectsDeployments: true
    })
  })
    */
   // Comando para implantar na Vercel
const diretorio = './deployment'
const login = 'vercel login'
const comando = `vercel projects add ${foldername}`;
const comando2 = 'vercel';
const comandos = ['vercel login --github',`vercel projects add ${foldername}`,`vercel link --yes --project ${foldername}`, 'vercel --prod']

// Executa o comando
for (let comando of comandos) {
  execSync(comando, { shell: true, cwd: diretorio });
}
fs.rmdir('./deployment/.vercel', {recursive: true, force: true},(err) => {if(err) {console.log('vai pro krl')} else {console.log('ai sim pai')}})
});



app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

