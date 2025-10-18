# Quick Reference - Notifiche Push Sessioni

## 🚀 Avvio Rapido

1. **Avvia l'app**: `./start-desktop.sh` (o `.bat` su Windows)
2. **Vai a Eventi**: Click su "Eventi" nel menu
3. **Configura sessioni**: Inserisci nome e orario nella tabella
4. **Ricevi notifiche**: A 10 e 5 minuti prima

## 📋 Checklist Funzionalità

- ✅ Notifiche native di sistema (Windows/macOS/Linux)
- ✅ Notifiche in-app visibili su tutte le pagine
- ✅ Funziona con app ridotta a icona
- ✅ Avvisi a 10 minuti (arancione)
- ✅ Avvisi a 5 minuti (rosso urgente)
- ✅ Click su notifica riporta app in primo piano
- ✅ Persistenza dati in localStorage
- ✅ Nessuna notifica duplicata

## 🎨 Colori Notifiche

| Tempo       | Colore    | Urgenza   |
|-------------|-----------|-----------|
| 10 minuti   | 🟠 Arancione | Normale   |
| 5 minuti    | 🔴 Rosso     | Critica   |

## ⚙️ Configurazione

### Formato Orario
- Usa il campo time HTML: formato `HH:MM`
- Esempio: `14:30` per le 2:30 PM

### Nomi Sessioni
- Campo testo libero
- Esempio: "Free Practice 1", "Qualifiche", "Gara"

## 🔔 Tipi di Notifiche

### Notifica a 10 minuti
```
Titolo: "Avviso Sessione - 10 minuti"
Corpo:  "⚠️ Attenzione: Mancano 10 minuti alla sessione '[Nome]' alle ore [Orario]"
```

### Notifica a 5 minuti
```
Titolo: "AVVISO URGENTE - 5 minuti"
Corpo:  "⚠️ AVVISO URGENTE: Mancano 5 minuti alla sessione '[Nome]' alle ore [Orario]"
```

## 🧪 Test Rapido

1. Inserisci sessione con orario = **ora corrente + 11 minuti**
2. Aspetta 1-2 minuti
3. Dovresti vedere notifica a 10 minuti
4. Aspetta altri 5 minuti
5. Dovresti vedere notifica a 5 minuti

## 📱 Dove Appaiono

### Notifiche Sistema
- **Windows**: Action Center (angolo basso-destra)
- **macOS**: Notification Center (angolo alto-destra)
- **Linux**: Notification daemon (varia per DE)

### Notifiche In-App
- Sempre in **alto a destra** nell'app
- Visibili su **qualsiasi pagina**
- Auto-chiusura dopo **30 secondi**
- Chiusura manuale con **X**

## ⏱️ Tempistiche

- Controllo ogni **60 secondi**
- Notifica 10 min: appare tra **9-10 minuti** prima
- Notifica 5 min: appare tra **4-5 minuti** prima
- Ogni notifica mostrata **una sola volta**

## 🔧 Troubleshooting

### Notifiche non appaiono?

**Verifica Autorizzazioni Sistema**
- Windows: Impostazioni > Sistema > Notifiche
- macOS: Preferenze > Notifiche > Racing Car Manager
- Linux: Controlla notification daemon

**Verifica Configurazione**
- Orari in formato HH:MM
- App in modalità Desktop (non browser)
- Controlla console DevTools (F12) per errori

### Come testare velocemente?

Modifica temporaneamente `notificationService.js`:
```javascript
// Cambia riga 55 da:
if (diffMinutes <= 10 && diffMinutes >= 9 && ...

// A:
if (diffMinutes <= 10 && diffMinutes >= 0 && ...
```
Poi imposta orario a 1-10 minuti da ora.
**Ricorda di ripristinare!**

## 📚 Documentazione Completa

- **Testing**: `NOTIFICATION_TESTING_GUIDE.md`
- **Implementazione**: `NOTIFICATION_IMPLEMENTATION.md`
- **Riassunto**: `NOTIFICATION_SUMMARY.md`

## 🎯 Funzionalità Chiave

| Feature | Status |
|---------|--------|
| Notifiche globali | ✅ |
| Push native OS | ✅ |
| Multi-pagina | ✅ |
| App minimizzata | ✅ |
| Persistenza dati | ✅ |
| Sicurezza | ✅ (0 vulnerabilità) |
| Build | ✅ (0 errori) |

## 💡 Tips

1. **Pianifica in anticipo**: Inserisci le sessioni con almeno 15 minuti di anticipo
2. **Nomi descrittivi**: Usa nomi chiari per le sessioni
3. **Desktop mode**: Per notifiche native, usa sempre l'app desktop
4. **Volume notifiche**: Configura il volume nelle impostazioni di sistema

## 🎉 Pronto!

Il sistema è completamente operativo e pronto all'uso. Buone gare! 🏎️
