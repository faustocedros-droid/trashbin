# VBA Macro Inventory

## File: 03_Race_Imola_25_29_Sett_2025.xlsm

This document provides a complete inventory of all VBA modules and their functionality in the Excel workbook.

---

## Module Structure

### Total Modules: 56
- 1 Workbook module (Questa_cartella_di_lavoro.cls)
- 54 Sheet modules (Foglio1-54)
- 1 Standard module (Modulo1.bas)

### Modules with Code: 1
- **Foglio29.cls** - Dashboard sheet with 29 command button event handlers

### Empty Modules: 55
All other modules are empty placeholders

---

## Active Module: Foglio29.cls (Dashboard)

### Command Button Event Handlers

#### Navigation Buttons

| Button | Target Sheet | Functionality | Status Bar Text |
|--------|-------------|---------------|-----------------|
| CommandButton1 | Consumi | Fuel consumption sheet | "Consumi" |
| CommandButton4 | DatiEvento | Event information | "Informazioni generali evento" |
| CommandButton5 | Pressioni | Tire pressure calculator | "Calcolatore Pressioni" |
| CommandButton6 | TrackMap | Circuit map | "Mappa tracciato" |
| CommandButton8 | Assetto | Setup and modifications | "Scheda Setup e variazioni" |
| CommandButton11 | SituazioneGomme | Tire usage summary | "Riepilogo Utilizzo Gomme" |
| CommandButton13 | Riepilogo | Summary sheet | "Riepilogo" |
| CommandButton17 | ComandiDashTunnel | Dashboard/tunnel/steering commands | "Comandi Dash Tunnel e Sterzo" |
| CommandButton27 | Tyre Temp Optimiser | Tire temperature optimization | - |
| StrategyEndurance | RunPlanEndurance | Endurance strategy | - |

#### Dynamic Navigation Buttons

| Button | Description | Source Cell | Possible Targets |
|--------|-------------|-------------|------------------|
| CommandButton9 | Run Plan selector | Dashboard!L6 | RunPlanTest1-4, RunPlanFP1-3, RunPlanQ, RunPlanR1-2 |
| CommandButton10 | Session times selector | Dashboard!O6 | Test1-4, FP1-3, Qualy, Race1-2 (maps to Test04, FP1-3, etc.) |

#### Document Access Buttons

| Button | Document Type | File Path | Status Bar Text |
|--------|---------------|-----------|-----------------|
| CommandButton7 | Event Schedule | D:\Dati\HuracanGt3Evo2\GeneralDocuments\Programma.pdf | "Event Schedule" |
| CommandButton12 | Vehicle Manual | D:\Vetture\Lamborghini\...\Manual Lamborghini Huracan ST Rev_06...pdf | "Manuale Huracan ST Evo2" |
| CommandButton15 | Warning Codes | C:\Vetture\Lamborghini\...\Warnings.jpg | "Decodifica Warnings Huracan" |
| CommandButton16 | PI Toolbox Manual | C:\Users\faust\Desktop\Start-up Manual for Pi Toolbox_v3_us.pdf | "Manuale PI toolbox" |
| CommandButton18 | Engineer's Handbook | D:\Vetture\Lamborghini\Gt3Evo2\EngineersHandbook.pdf | "EngineersHandbook" |
| CommandButton19 | Sport Regulations | D:\Dati\HuracanGt3Evo2\GeneralDocuments\RegolamentoSportivo_gt_endurance.pdf | - |
| CommandButton20 | Technical Regulations | D:\Dati\HuracanGt3Evo2\GeneralDocuments\2025_cigt_regolamento_tecnico.pdf | - |
| CommandButton21 | Windarab Manual | D:\Vetture\Lamborghini\Gt3Evo2\Windarab_v73_Handbuchpdf.pdf | - |
| CommandButton22 | Driver Manual | D:\Vetture\Lamborghini\Gt3Evo2\Huracan GT3 Evo2 Driver Manual...pdf | - |
| CommandButton24 | BoP Document | D:\Dati\HuracanGt3Evo2\GeneralDocuments\BoP.pdf | - |
| CommandButton25 | Sporting Regulations 2025 | D:\Dati\Huracan ST\2025\Sport&Tech bulletins\LST EU SPORTING REG...pdf | - |
| CommandButton26 | Technical Regulations 2025 | D:\Dati\Huracan ST\2025\Sport&Tech bulletins\TECHNICAL REG. 2025...pdf | - |
| CommandButton28 | Entry List | D:\Dati\Huracan ST\2025\04_Race_Mugello_ItalianGT...\ElencoIscritti.pdf | - |

#### Action Buttons

| Button | Action | Implementation | Status Bar Text |
|--------|--------|----------------|-----------------|
| CommandButton2 | Open Weather Website | FollowHyperlink to https://www.windy.com | "Situazione Meteo" |
| CommandButton3 | Save Workbook | ThisWorkbook.Save | "Salva il foglio di calcolo" |
| CommandButton14 | Print Selection | Application.Dialogs(xlDialogPrint).Show | "Stampa la selezione" |
| CommandButton23 | View Image | Shell rundll32.exe shimgvw.dll | - |
| CommandButton29 | Convert Data | Execute Python script app_converter.py | - |

---

## Event Handler Details

### Mouse Event Handlers

Each navigation and document button has three event handlers:
1. **_Click()** - Primary action when button is clicked
2. **_MouseMove()** - Sets status bar text when mouse hovers over button
3. **_MouseLeave()** - Clears status bar text when mouse leaves button

### Selection Logic

#### CommandButton9 (Run Plan Selection)
```vba
Select Case foglioRunPlan (from cell L6)
    Case "Test1" -> RunPlanTest1
    Case "Test2" -> RunPlanTest2
    Case "Test3" -> RunPlanTest3
    Case "Test4" -> RunPlanTest4
    Case "Fp1" -> RunPlanFP1
    Case "Fp2" -> RunPlanFP2
    Case "FP3" -> RunPlanFP3
    Case "Qualy" -> RunPlanQ
    Case "Race1" -> RunPlanR1
    Case "Race2" -> RunPlanR2
End Select
```

#### CommandButton10 (Session Times Selection)
```vba
Select Case foglioDaAprire (from cell O6)
    Case "Test1" -> Test1
    Case "Test2" -> Test2
    Case "Test3" -> Test3
    Case "Test4" -> Test04  [Note: Maps to "Test04"]
    Case "Fp1" -> FP1
    Case "Fp2" -> FP2
    Case "FP3" -> FP3
    Case "Qualy" -> Qualy
    Case "Race1" -> Race1
    Case "Race2" -> Race2
End Select
```

#### CommandButton14 (Print Selection)
```vba
- Gets selection index from Dashboard!O25
- Looks up sheet name from Motore!C3:C13
- Opens print dialog for selected sheet
```

---

## Shell Commands

### CommandButton23
```vba
percorso = "C:\Users\faust\OneDrive\Appunti e Note\2025\Gt Italiano\Setting Suggeriti Ausilii Guida.jpg"
Shell "rundll32.exe C:\WINDOWS\system32\shimgvw.dll,ImageView_Fullscreen " & percorso, vbNormalFocus
```
**Purpose:** Opens image file in full screen using Windows Image Viewer

### CommandButton29
```vba
percorsoScript = "C:\Users\faust\MotecLogGenerator\app_converter.py"
comando = "cmd.exe /c python """ & percorsoScript & """"
Shell comando, vbNormalFocus
```
**Purpose:** Executes Python script for data conversion (likely Motec telemetry data)

---

## External Dependencies

### Required Files (PDF Documents)
All paths are absolute and system-specific:
- 11 PDF documents (manuals, regulations, schedules)
- 2 Image files (JPG)
- 1 Python script

### Required Sheets
The following sheets must exist in the workbook:
- Dashboard (Foglio29)
- Consumi, DatiEvento, Pressioni, TrackMap, Assetto
- SituazioneGomme, Riepilogo, ComandiDashTunnel
- Tyre Temp Optimiser, RunPlanEndurance
- Test1-4, FP1-3, Qualy, Race1-2
- RunPlanTest1-4, RunPlanFP1-3, RunPlanQ, RunPlanR1-2
- Motore (used for configuration data)

---

## Code Quality Issues

### Hard-Coded Values
- All file paths are hard-coded
- No error handling for missing files
- No validation of user input
- Sheet names are hard-coded

### Missing Error Handling
```vba
' Example from CommandButton14:
On Error Resume Next  ' Suppresses errors
' ... code ...
On Error GoTo 0       ' Resumes normal error handling
```

### Inconsistencies
- CommandButton10 maps "Test4" to sheet "Test04" (note the zero)
- Some buttons have status bar text, others don't
- Inconsistent code formatting

---

## Suggested Improvements

1. **Centralize file path configuration**
   - Store paths in a configuration sheet
   - Allow users to update paths via settings dialog

2. **Add error handling**
   ```vba
   If Dir(pdfPath) <> "" Then
       ThisWorkbook.FollowHyperlink Address:=pdfPath
   Else
       MsgBox "File not found: " & pdfPath, vbExclamation
   End If
   ```

3. **Create helper functions**
   ```vba
   Function OpenDocument(fileName As String)
       Dim fullPath As String
       fullPath = GetBasePath() & fileName
       If FileExists(fullPath) Then
           ThisWorkbook.FollowHyperlink Address:=fullPath
       Else
           MsgBox "Cannot find: " & fileName
       End If
   End Function
   ```

4. **Standardize naming**
   - Use consistent sheet naming (Test04 vs Test4)
   - Add descriptive names to all buttons

---

## Security Considerations

See [VBA_SECURITY_ANALYSIS.md](VBA_SECURITY_ANALYSIS.md) for detailed security assessment.

### Quick Summary:
- ⚠️ Shell command execution (2 instances)
- ⚠️ Hard-coded file paths (15+ instances)
- ⚠️ No input validation
- ✅ No network communication except user-initiated web browser
- ✅ No file system modifications except workbook save
- ✅ No registry access
- ✅ No external ActiveX components

---

*This inventory was generated from VBA code analysis of the workbook.*
