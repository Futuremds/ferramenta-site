const { contextBridge, ipcRenderer } = require('electron');

// Expõe uma API segura para o processo de renderização
contextBridge.exposeInMainWorld('electronAPI', {
    executarScript: (args) => ipcRenderer.invoke('editar-página', args)
});