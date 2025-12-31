param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Name
)

$ProgressPreference = 'SilentlyContinue'

try {
    $obj = @{
        path        = $Path
        name        = $Name
        keyExists   = $false
        valueExists = $false
        valueType   = $null
        valueData   = $null
    }

    if (Test-Path $Path) {
        $obj.keyExists = $true
        $regKey = Get-Item $Path

        $raw = $regKey.GetValue($Name, $null, 'DoNotExpandEnvironmentNames')

        if ($null -ne $raw) {
            $obj.valueExists = $true
            $obj.valueType = $regKey.GetValueKind($Name).ToString()
            $obj.valueData = $raw
        }
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')

}
catch {
    Write-Error $_
    exit 1
}
