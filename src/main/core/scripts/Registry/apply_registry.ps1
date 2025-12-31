# We must have a Type parameter because depending on the registry entry we edit, it stores the value with a different type.
# So in order to make this script reusable we must pass that in and keep track of that in the JS.

param(
    [Parameter(Mandatory = $true)]
    [string]$Path,   # e.g. HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection

    [Parameter(Mandatory = $true)]
    [string]$Name,   # e.g. AllowTelemetry

    [Parameter(Mandatory = $true)]
    [string]$Type,   # e.g. DWord, String, QWord, etc.

    [Parameter(Mandatory = $true)]
    [string]$Value   # will be converted based on $Type
)

$ProgressPreference = 'SilentlyContinue'

try {

    # Ensure the key exists; if not, create it
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -Force | Out-Null
    }

    # Convert the incoming string into the correct .NET type based on registry type
    $typedValue = switch ($Type.ToLower()) {
        "dword" { [int]$Value }
        "qword" { [long]$Value }
        "string" { [string]$Value }
        "expandstring" { [string]$Value }
        "multistring" { $Value -split ";" }
        default { $Value }
    }

    # If the value already exists → Set
    if (Get-ItemProperty -Path $Path -Name $Name -ErrorAction SilentlyContinue) {
        Set-ItemProperty -Path $Path -Name $Name -Value $typedValue | Out-Null
    }
    # If the value does NOT exist → Create
    else {
        New-ItemProperty -Path $Path -Name $Name -PropertyType $Type -Value $typedValue | Out-Null
    }
}
catch {
    Write-Error $_
    exit 1
}
