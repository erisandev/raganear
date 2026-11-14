# Generate Voice Narration for RAGA Protocol Demo (Male Voice: Microsoft David Desktop)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft David Desktop")
$synth.Rate = 0  # Normal natural speaking rate

$audioDir = "D:\Hackathon Project\raga-nearhack\worker-daemon\audio-temp"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$segments = @(
    @{
        File = "01-hook.wav"
        Text = "For four years, the Web-3 industry treated NFTs as static JPEGs with zero operational utility. Meanwhile, autonomous AI workers face a critical vulnerability: they require human private keys, leaving them exposed to key-theft and liquidation. We built RAGA Protocol for NEAR Hackathon 2026. RAGA transforms NFTs into productive, rentable smart accounts on NEAR Protocol where the contract is the sole parent authority, and zero human private keys exist."
    },
    @{
        File = "02-telemetry.wav"
        Text = "Look at the live telemetry: deployed on NEAR Testnet at raga-protocol-mw93m309.testnet with deterministic sub-account derivations. Every transaction is verifiable on Nearblocks explorer without mocks or simulated delays."
    },
    @{
        File = "03-why-and-how.wav"
        Text = "Why RAGA? Because we transform passive digital art into sovereign capital. Here is How It Works in four honest stages: Mint sovereign identity, commit a time-locked lease, enforce NEP-178 anti-theft transfer freeze, and stream autonomous yield directly to the owner vault."
    },
    @{
        File = "04-workspace.wav"
        Text = "In our Foundry Workspace, we have four active workers live on testnet. Our top bar features a zero-trust role switcher between Tenant, Owner, Operator, and Judge. Notice Chronos Oracle-03: bound to agent-oracle-03.raga-protocol-mw93m309.testnet."
    },
    @{
        File = "05-mint-studio.wav"
        Text = "The Mint Studio allows users to forge sovereign workers in four guided steps: define agent identity, select specialized capabilities, derive the hierarchical sub-account, and stake storage deposit with custom streaming rates."
    },
    @{
        File = "06-leasing.wav"
        Text = "Through time-locked micro-leasing, renters lease worker compute by depositing NEAR. The smart contract calculates nanosecond expiration and delegates execution authority to the tenant."
    },
    @{
        File = "07-transfer-freeze.wav"
        Text = "Now observe our core security invariant: NEP-178 Transfer Freeze. If an owner attempts to transfer or sell the agent while a lease is active, the transaction is completely locked! The contract panics and prevents owner rugpulls, protecting the tenant's SLA."
    },
    @{
        File = "08-dispatch.wav"
        Text = "As an authorized tenant, we dispatch cross-contract proxy calls through the agent sub-account via execute_as_agent. Every successful workload increments tasks completed and builds dynamic reputation on-chain."
    },
    @{
        File = "09-vault.wav"
        Text = "In the Fleet Vault, one hundred percent of rental fees route directly to the token owner's pool. Owners can withdraw accumulated streaming revenue on-demand with zero intermediary cuts."
    },
    @{
        File = "10-auditor-closing.wav"
        Text = "Our Auditor Lab proves keyless isolation with live JSON-RPC telemetry. RAGA is one hundred percent open-source, fully verified on NEAR Testnet, and live at raganear.vercel.app. Thank you!"
    }
)

Write-Host "Generating audio segments..."
foreach ($seg in $segments) {
    $outPath = Join-Path $audioDir $seg.File
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($seg.Text)
    Write-Host "Generated: $($seg.File)"
}
$synth.Dispose()
Write-Host "All audio segments generated successfully!"
