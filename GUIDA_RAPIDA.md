# Guida Rapida - Come Vedere le Modifiche Dopo il Merge

## Il Tuo Problema
✗ Hai fatto il merge di una pull request  
✗ Gli screenshot mostrano le modifiche corrette  
✗ Ma quando avvii l'app, vedi ancora la versione vecchia  

## La Soluzione Rapida

### Passo 1: Ferma l'app
Se l'app è in esecuzione, chiudila.

### Passo 2: Scegli il comando giusto

#### OPZIONE A: Per sviluppo quotidiano (CONSIGLIATA)
```bash
./start-desktop.sh
```
✓ Si ricarica automaticamente quando modifichi il codice  
✓ Vedi sempre le ultime modifiche  
✓ Perfetto per sviluppo

#### OPZIONE B: Per testare la build di produzione (NUOVA!)
```bash
./start-desktop-prod.sh
```
✓ Ricostruisce l'app con le ultime modifiche  
✓ Testa la versione che darai agli utenti  
✓ Perfetto prima di creare l'installer

#### OPZIONE C: Per creare l'installer
```bash
cd frontend
npm run electron-build-win     # Windows
# oppure
npm run electron-build-mac     # macOS
# oppure
npm run electron-build-linux   # Linux
```
✓ Crea un installer con il codice aggiornato  
✓ Necessario dopo ogni modifica importante

### Passo 3: Verifica
L'app ora dovrebbe mostrare la visualizzazione corretta che vedi negli screenshot!

## Quando Usare Quale Opzione?

| Situazione | Comando da Usare |
|------------|------------------|
| Sto sviluppando | `./start-desktop.sh` |
| Ho appena fatto merge | `./start-desktop.sh` o `./start-desktop-prod.sh` |
| Voglio testare la build | `./start-desktop-prod.sh` |
| Devo distribuire l'app | `npm run electron-build-*` |

## Perché Succede?

L'app desktop può funzionare in due modi:

1. **Modo Sviluppo** - Usa il server React (si aggiorna da solo)
2. **Modo Produzione** - Usa file compilati (vanno ricostruiti)

Se usi l'app compilata o l'installer senza ricostruire, vedi la versione vecchia!

## Documentazione Completa

Per maggiori dettagli:
- 📖 [SOLUZIONE_VISUALIZZAZIONE.md](SOLUZIONE_VISUALIZZAZIONE.md) - Soluzione dettagliata
- 📖 [DESKTOP_MODES_GUIDE.md](DESKTOP_MODES_GUIDE.md) - Guida completa modalità
- 📖 [ISSUE_RESOLUTION_SUMMARY.md](ISSUE_RESOLUTION_SUMMARY.md) - Riepilogo tecnico

## Aiuto Rapido

### L'app mostra ancora la versione vecchia?
1. Assicurati di aver chiuso completamente l'app
2. Prova a cancellare la cache: `cd frontend && rm -rf node_modules/.cache`
3. Riavvia con `./start-desktop-prod.sh`

### Errori durante l'avvio?
Controlla che:
- Node.js sia installato: `node --version`
- Python sia installato: `python3 --version`
- Le dipendenze siano installate: `cd frontend && npm install`

---

**Nota:** Questo problema è ora risolto! I nuovi script assicurano che vedi sempre le ultime modifiche.
