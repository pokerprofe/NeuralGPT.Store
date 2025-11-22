# IRENE-SECOPS INTEGRITY ENGINE
# No toca Windows. Solo vigila archivos del proyecto NeuralGPT.Store.

function Test-Integrity {
    param(
        [string] = ".\public_html"
    )
    Get-ChildItem  -Recurse | ForEach-Object {
        try {
            BFE7BAAEDA4C4DEFAF6B2C8BBB4936195D3049ECBB25ED8D0CE2E9A5EB98091E = Get-FileHash .FullName -Algorithm SHA256
            "$(.FullName)  $(BFE7BAAEDA4C4DEFAF6B2C8BBB4936195D3049ECBB25ED8D0CE2E9A5EB98091E.Hash)" | Out-File -Append ".\leads_engine\logs\integrity_log.txt"
        } catch {}
    }
}
