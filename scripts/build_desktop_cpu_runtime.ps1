$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$Python = Join-Path $RepoRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $Python)) { throw "Python environment is missing." }

$Dist = Join-Path $RepoRoot "desktop\dist\features"
$Work = Join-Path $RepoRoot "desktop\build\cpu-runtime"
& $Python -m PyInstaller `
    --noconfirm `
    --clean `
    --onedir `
    --name practice-lab-cpu-runtime `
    --paths $RepoRoot `
    --collect-all yt_dlp `
    --collect-all torch `
    --collect-all natten `
    --collect-all allin1fix `
    --collect-all demucs_infer `
    --hidden-import practice_lab.compute_device `
    --hidden-import practice_lab.jpop_sections `
    --hidden-import practice_lab.timing `
    --hidden-import practice_lab.audio_timing `
    --distpath $Dist `
    --workpath $Work `
    --specpath (Join-Path $RepoRoot "desktop\build") `
    (Join-Path $RepoRoot "desktop\backend_entry.py")
if ($LASTEXITCODE -ne 0) { throw "Failed to build the CPU runtime." }

$Runtime = Join-Path $Dist "practice-lab-cpu-runtime\practice-lab-cpu-runtime.exe"
& $Runtime --check-runtime windows-cpu
if ($LASTEXITCODE -ne 0) { throw "The CPU runtime check failed." }
