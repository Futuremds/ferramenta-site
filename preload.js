let{contextBridge,ipcRenderer}=require("electron");contextBridge.exposeInMainWorld("electronAPI",{executarScript:e=>ipcRenderer.invoke("editar-página",e)});
