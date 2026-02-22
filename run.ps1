$backend = Start-Process powershell -ArgumentList "
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
" -PassThru

$frontend = Start-Process powershell -ArgumentList "
cd frontend
npm install
npm run dev
" -PassThru

Write-Host "Services running. Press Ctrl+C to stop."

try {
    Wait-Process -Id $backend.Id, $frontend.Id
}
finally {
    Stop-Process -Id $backend.Id -Force
    Stop-Process -Id $frontend.Id -Force
}
