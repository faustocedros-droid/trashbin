# VBA Macro Security Analysis Report

## File Analyzed
**Filename:** `03_Race_Imola_25_29_Sett_2025.xlsm`  
**File Type:** Microsoft Excel 2007+ (OpenXML with VBA macros)  
**Analysis Date:** Generated from oletools scan

---

## Executive Summary

This document contains a security analysis of VBA macros found in the Excel workbook. The analysis has identified several security concerns including:
- Hard-coded file system paths
- Shell command execution
- External executable invocations
- Potentially unsafe file operations

---

## Macro Overview

The workbook contains multiple VBA modules:
- **Questa_cartella_di_lavoro.cls** - Workbook module (empty)
- **Foglio29.cls** - Main dashboard with extensive VBA code containing CommandButton event handlers
- Multiple empty sheet modules (Foglio1-54)
- **Modulo1.bas** - Empty module

---

## Security Findings

### 🔴 HIGH SEVERITY

#### 1. Shell Command Execution
**Location:** `Foglio29.cls - CommandButton23_Click()`
```vba
Shell "rundll32.exe C:\WINDOWS\system32\shimgvw.dll,ImageView_Fullscreen " & percorso, vbNormalFocus
```
**Risk:** Direct shell command execution with user-controllable path variable
**Impact:** Could potentially be exploited for command injection

#### 2. Python Script Execution
**Location:** `Foglio29.cls - CommandButton29_Click()`
```vba
percorsoScript = "C:\Users\faust\MotecLogGenerator\app_converter.py"
comando = "cmd.exe /c python """ & percorsoScript & """"
Shell comando, vbNormalFocus
```
**Risk:** Executes external Python script via cmd.exe
**Impact:** Depends on the Python script content (not analyzed)

### 🟡 MEDIUM SEVERITY

#### 3. Hard-Coded File System Paths
Multiple hard-coded absolute paths pointing to local drives:

**D: Drive Paths:**
- `D:\Vetture\Lamborghini\Lamborghini Huracan Super Trofeo EVO 2\Manual Lamborghini Huracan ST Rev_06 last release 31012023.pdf`
- `D:\Vetture\Lamborghini\Gt3Evo2\EngineersHandbook.pdf`
- `D:\Dati\HuracanGt3Evo2\GeneralDocuments\RegolamentoSportivo_gt_endurance.pdf`
- `D:\Dati\HuracanGt3Evo2\GeneralDocuments\2025_cigt_regolamento_tecnico.pdf`
- `D:\Vetture\Lamborghini\Gt3Evo2\Windarab_v73_Handbuchpdf.pdf`
- `D:\Vetture\Lamborghini\Gt3Evo2\Huracan GT3 Evo2 Driver Manual_250422_210611(1).pdf`
- `D:\Dati\HuracanGt3Evo2\GeneralDocuments\BoP.pdf`
- `D:\Dati\Huracan ST\2025\Sport&Tech bulletins\LST EU SPORTING REG. 2025_final .pdf`
- `D:\Dati\Huracan ST\2025\Sport&Tech bulletins\TECHNICAL REG. 2025_Rev02 2025.02.20.pdf`
- `D:\Dati\Huracan ST\2025\04_Race_Mugello_ItalianGT_10_13_Lug_2025\ElencoIscritti.pdf`
- `D:\Dati\HuracanGt3Evo2\GeneralDocuments\Programma.pdf`

**C: Drive Paths:**
- `C:\Users\faust\Desktop\Start-up Manual for Pi Toolbox_v3_us.pdf`
- `C:\Vetture\Lamborghini\Lamborghini Huracan Super Trofeo EVO 2\Warnings.jpg`
- `C:\Users\faust\OneDrive\Appunti e Note\2025\Gt Italiano\Setting Suggeriti Ausilii Guida.jpg`
- `C:\Users\faust\MotecLogGenerator\app_converter.py`

**Risk:** 
- Files will not be found on other systems
- Exposes internal directory structure
- Contains username information (`faust`)

#### 4. External URL Access
**Location:** `Foglio29.cls - CommandButton2_Click()`
```vba
url = "https://www.windy.com"
ThisWorkbook.FollowHyperlink Address:=url, NewWindow:=True
```
**Risk:** Opens external website
**Impact:** Low - legitimate weather service

### 🔵 LOW SEVERITY

#### 5. AutoExec Macro Triggers
The following macros are triggered on file open:
- `CommandButton1_Click`
- `CommandButton1_MouseMove`
- `CommandButton1_MouseLeave`

**Risk:** Macros execute when ActiveX controls are interacted with
**Impact:** Expected behavior for dashboard interface

---

## Identified IOCs (Indicators of Compromise)

| Type | Value | Context |
|------|-------|---------|
| URL | `https://www.windy.com` | Weather service (legitimate) |
| Executable | `rundll32.exe` | Windows system utility |
| DLL | `shimgvw.dll` | Image viewer DLL |
| Executable | `cmd.exe` | Windows command processor |

---

## Code Analysis: Main Module (Foglio29)

The main VBA module contains 29 command button event handlers that:
1. Navigate between worksheet tabs
2. Open external PDF documents
3. Open external images
4. Execute print dialogs
5. Save the workbook
6. Open external websites
7. Execute external Python scripts

### Functionality Breakdown:

**Navigation Buttons (CommandButton1, 4, 5, 6, 8, 10, 11, 13, 17, 27):**
- Switch between different worksheet tabs
- Use `Sheets().Select` or `Sheets().Activate`
- Status bar messages on mouse hover

**Document Access Buttons (CommandButton12, 15-22, 24-26, 28):**
- Open PDF manuals and regulations
- Use `ThisWorkbook.FollowHyperlink`
- Hard-coded file paths

**Action Buttons:**
- **CommandButton3:** Save workbook
- **CommandButton14:** Print selected sheet
- **CommandButton23:** View image using rundll32
- **CommandButton29:** Execute Python script

---

## Recommendations

### Immediate Actions:

1. **Remove Hard-Coded Paths**
   - Use relative paths where possible
   - Store file paths in a configuration sheet
   - Implement path validation before file access

2. **Sanitize Shell Commands**
   - Validate all input parameters
   - Use parameterized command execution
   - Consider alternatives to Shell() command

3. **Code Review Required**
   - Review `app_converter.py` script content
   - Verify all external file references
   - Check for user input validation

### Long-Term Improvements:

1. **Path Management**
   ```vba
   ' Example: Use a configuration sheet
   Function GetFilePath(ByVal fileName As String) As String
       GetFilePath = Sheets("Config").Range("PathsRoot").Value & fileName
   End Function
   ```

2. **Error Handling**
   - Add file existence checks
   - Implement try-catch blocks
   - Provide user feedback for missing files

3. **Security Hardening**
   - Code sign the VBA project
   - Remove unused empty modules
   - Document all macro functionality
   - Implement macro warnings

4. **Testing**
   - Test on systems without hard-coded paths
   - Verify all button functionality
   - Test with macro security set to high

---

## Macro Functionality Summary

### Dashboard Interface
The workbook appears to be a racing team management dashboard for Lamborghini Huracan racing events with functionality for:
- Event data management
- Tire pressure calculations
- Run plan management
- Setup sheets
- Fuel consumption tracking
- Document access (manuals, regulations, schedules)
- Weather information
- Data conversion tools

### User Interface Elements
- Multiple command buttons with mouse hover status bar messages
- Dynamic sheet selection based on dropdown values
- Print functionality for selected sheets
- External document viewing

---

## Conclusion

The VBA macros serve legitimate business purposes for racing team management. However, the implementation has several security concerns primarily related to:
1. Hard-coded file system paths that will fail on other systems
2. Use of Shell commands without input validation
3. Execution of external scripts

**Severity Assessment:** Medium  
**Recommended Action:** Refactor code to remove hard-coded paths and add input validation

---

## Additional Notes

- The workbook contains extensive Excel formulas (16,000+ cells with formulas)
- Primary sheets: Dashboard, DatiEvento, Pressioni, TrackMap, Consumi, Assetto, etc.
- Multiple run plan sheets for different sessions (Test1-4, FP1-3, Qualy, Race1-2)
- Endurance strategy calculator included
- No evidence of malicious intent - appears to be a legitimate racing data management tool

---

*This analysis was generated based on oletools VBA macro extraction and code review.*
