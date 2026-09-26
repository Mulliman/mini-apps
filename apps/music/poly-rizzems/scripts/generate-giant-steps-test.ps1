$appDir = Resolve-Path "$PSScriptRoot\.."
$specsDir = Join-Path $appDir "public\specs"

function Get-Freq([string]$noteName) {
    $regex = '^([A-G])([#b♯♭]?)(\d)$'
    if ($noteName -match $regex) {
        $step = $matches[1]
        $acc = $matches[2]
        $octave = [int]$matches[3]

        $baseSemi = switch ($step) {
            'C' { 0 }
            'D' { 2 }
            'E' { 4 }
            'F' { 5 }
            'G' { 7 }
            'A' { 9 }
            'B' { 11 }
        }
        if ($acc -eq '#' -or $acc -eq '♯') { $baseSemi += 1 }
        elseif ($acc -eq 'b' -or $acc -eq '♭') { $baseSemi -= 1 }

        # MIDI note: C4 is 60, A4 (440Hz) is 69
        $midi = 12 * ($octave + 1) + $baseSemi
        $freq = 440.0 * [Math]::Pow(2.0, ($midi - 69) / 12.0)
        return [Math]::Round($freq, 2)
    }
    throw "Invalid note: $noteName"
}

function Get-Volume($freq) {
    $raw = 0.85 * [Math]::Pow(261.63 / $freq, 0.5)
    return [Math]::Round([Math]::Min(1.0, [Math]::Max(0.2, $raw)), 2)
}

$chords = @(
    @{ name = 'Bmaj7'; root = 'B3'; notes = @('B3', 'D#4', 'F#4', 'A#4'); colors = @('#00f0ff', '#39ff14', '#fffb00', '#ff007f') },
    @{ name = 'D7'; root = 'D3'; notes = @('D3', 'F#4', 'A4', 'C4'); colors = @('#ff5f00', '#ff073a', '#b026ff', '#00ffd0') },
    @{ name = 'Gmaj7'; root = 'G3'; notes = @('G3', 'B3', 'D4', 'F#4'); colors = @('#39ff14', '#00f0ff', '#ccff00', '#ff00ea') },
    @{ name = 'Bb7'; root = 'Bb3'; notes = @('Bb3', 'D4', 'F4', 'Ab4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#b026ff') },
    @{ name = 'Ebmaj7'; root = 'Eb3'; notes = @('Eb3', 'G4', 'Bb4', 'D4'); colors = @('#00ffd0', '#39ff14', '#00f0ff', '#fffb00') },
    @{ name = 'Am7'; root = 'A3'; notes = @('A3', 'C4', 'E4', 'G4'); colors = @('#b026ff', '#ff00ea', '#ff007f', '#00f0ff') },
    @{ name = 'D7'; root = 'D3'; notes = @('D3', 'F#4', 'A4', 'C4'); colors = @('#ff5f00', '#ff073a', '#b026ff', '#00ffd0') },
    @{ name = 'Gmaj7'; root = 'G3'; notes = @('G3', 'B3', 'D4', 'F#4'); colors = @('#39ff14', '#00f0ff', '#ccff00', '#ff00ea') },
    @{ name = 'Bb7'; root = 'Bb3'; notes = @('Bb3', 'D4', 'F4', 'Ab4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#b026ff') },
    @{ name = 'Ebmaj7'; root = 'Eb3'; notes = @('Eb3', 'G4', 'Bb4', 'D4'); colors = @('#00ffd0', '#39ff14', '#00f0ff', '#fffb00') },
    @{ name = 'F#7'; root = 'F#3'; notes = @('F#3', 'A#3', 'C#4', 'E4'); colors = @('#ff007f', '#ff5f00', '#ff073a', '#b026ff') },
    @{ name = 'Bmaj7'; root = 'B3'; notes = @('B3', 'D#4', 'F#4', 'A#4'); colors = @('#00f0ff', '#39ff14', '#fffb00', '#ff007f') },
    @{ name = 'Fm7'; root = 'F3'; notes = @('F3', 'Ab3', 'C4', 'Eb4'); colors = @('#b026ff', '#ff00ea', '#ff073a', '#00ffd0') },
    @{ name = 'Bb7'; root = 'Bb3'; notes = @('Bb3', 'D4', 'F4', 'Ab4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#b026ff') },
    @{ name = 'Ebmaj7'; root = 'Eb3'; notes = @('Eb3', 'G4', 'Bb4', 'D4'); colors = @('#00ffd0', '#39ff14', '#00f0ff', '#fffb00') },
    @{ name = 'Am7'; root = 'A3'; notes = @('A3', 'C4', 'E4', 'G4'); colors = @('#b026ff', '#ff00ea', '#ff007f', '#00f0ff') },
    @{ name = 'D7'; root = 'D3'; notes = @('D3', 'F#4', 'A4', 'C4'); colors = @('#ff5f00', '#ff073a', '#b026ff', '#00ffd0') },
    @{ name = 'Gmaj7'; root = 'G3'; notes = @('G3', 'B3', 'D4', 'F#4'); colors = @('#39ff14', '#00f0ff', '#ccff00', '#ff00ea') },
    @{ name = 'C#m7'; root = 'C#3'; notes = @('C#3', 'E4', 'G#3', 'B3'); colors = @('#ff00ea', '#b026ff', '#ff007f', '#00f0ff') },
    @{ name = 'F#7'; root = 'F#3'; notes = @('F#3', 'A#3', 'C#4', 'E4'); colors = @('#ff007f', '#ff5f00', '#ff073a', '#b026ff') },
    @{ name = 'Bmaj7'; root = 'B3'; notes = @('B3', 'D#4', 'F#4', 'A#4'); colors = @('#00f0ff', '#39ff14', '#fffb00', '#ff007f') }
)

function Build-MeterSpec([int]$signature, [string]$specName, [string]$title, [double]$barDuration) {
    $bars = 25
    $initialPulse = 'B3'
    $pulseId = 'pulse'
    $laneIds = @("lane-$signature-0", "lane-$signature-1", "lane-$signature-2", "lane-$signature-3")

    $pulseFreq = Get-Freq $initialPulse
    $rhythms = @(
        [ordered]@{
            id            = $pulseId
            timeSignature = 1
            noteName      = $initialPulse
            color         = '#a1a1aa'
            name          = "Beat (1♩)"
            frequency     = $pulseFreq
            volume        = (Get-Volume $pulseFreq)
            expression    = 'cool'
            isMuted       = $false
        }
    )

    $events = @()

    # Bar 2: Add 4 chord lanes
    $c0 = $chords[0]
    $c0RootFreq = Get-Freq $c0.root
    $events += [ordered]@{
        at    = 2
        type  = 'update'
        id    = $pulseId
        patch = [ordered]@{
            noteName  = $c0.root
            frequency = $c0RootFreq
            volume    = (Get-Volume $c0RootFreq)
            name      = "Beat (1♩)"
        }
    }

    for ($i = 0; $i -lt 4; $i++) {
        $n = $c0.notes[$i]
        $freq = Get-Freq $n
        $events += [ordered]@{
            at     = 2
            type   = 'add'
            rhythm = [ordered]@{
                id            = $laneIds[$i]
                timeSignature = $signature
                noteName      = $n
                color         = $c0.colors[$i]
                name          = "$n (${signature}♩)"
                frequency     = $freq
                volume        = (Get-Volume $freq)
                expression    = 'cool'
                isMuted       = $false
            }
        }
    }

    # Bars 3 to 22: update each chord
    for ($idx = 1; $idx -lt $chords.Count; $idx++) {
        $bar = 2 + $idx
        $c = $chords[$idx]
        $rootFreq = Get-Freq $c.root

        $events += [ordered]@{
            at    = $bar
            type  = 'update'
            id    = $pulseId
            patch = [ordered]@{
                noteName  = $c.root
                frequency = $rootFreq
                volume    = (Get-Volume $rootFreq)
                name      = "Beat (1♩)"
            }
        }

        for ($i = 0; $i -lt 4; $i++) {
            $n = $c.notes[$i]
            $freq = Get-Freq $n
            $events += [ordered]@{
                at    = $bar
                type  = 'update'
                id    = $laneIds[$i]
                patch = [ordered]@{
                    noteName  = $n
                    frequency = $freq
                    volume    = (Get-Volume $freq)
                    color     = $c.colors[$i]
                    name      = "$n (${signature}♩)"
                }
            }
        }
    }

    # Bar 23: remove chord lanes
    for ($i = 0; $i -lt 4; $i++) {
        $events += [ordered]@{
            at   = 23
            type = 'remove'
            id   = $laneIds[$i]
        }
    }

    $spec = [ordered]@{
        name        = $specName
        title       = $title
        description = "Giant Steps changes played in $signature meter ($signature beats per bar) with 4 chord voices pulsing in unison against the downbeat."
        bars        = $bars
        barDuration = $barDuration
        rhythms     = $rhythms
        events      = $events
    }

    $json = ConvertTo-Json -Depth 10 $spec
    $outFile = Join-Path $specsDir "$specName.json"
    [System.IO.File]::WriteAllText($outFile, $json)
    Write-Host "Generated: $outFile"
}

Build-MeterSpec -signature 5 -specName "week7-test-giant-steps-5" -title "Giant Steps in 5 (Test Option C)" -barDuration 2.4
Build-MeterSpec -signature 3 -specName "week7-test-giant-steps-3" -title "Giant Steps in 3 (Test Option C)" -barDuration 2.1
