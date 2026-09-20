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

$specs = @(
    @{
        name = 'week6-day1-1-5-6-4-pop'
        title = '1-5-6-4 The 4 Chords of Pop'
        description = 'The legendary 4-chord pop progression from Journey "Don''t Stop Believin''" (also Bob Marley "No Woman No Cry", U2 "With Or Without You", Adele "Someone Like You") played in its original key of E Major with Jonathan Cain''s iconic piano register (G#4 -> F#4 -> E4 -> E4).'
        bars = 24
        barDuration = 2.4
        initialPulse = 'E3'
        laneSignatures = @(1, 5, 6, 4)
        chords = @(
            @{ name = 'E'; root = 'E3'; notes = @('E3', 'B3', 'E4', 'G#4'); colors = @('#ccff00', '#39ff14', '#00f0ff', '#00ffd0'); duration = 1 },
            @{ name = 'B'; root = 'B3'; notes = @('B3', 'F#3', 'D#4', 'F#4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#ff007f'); duration = 1 },
            @{ name = 'C#m'; root = 'C#3'; notes = @('C#3', 'G#3', 'C#4', 'E4'); colors = @('#ff00ea', '#b026ff', '#ff007f', '#00f0ff'); duration = 1 },
            @{ name = 'A'; root = 'A3'; notes = @('A3', 'E3', 'C#4', 'E4'); colors = @('#00f0ff', '#39ff14', '#ccff00', '#fffb00'); duration = 1 }
        )
    },
    @{
        name = 'week6-day2-2-5-1-jazz'
        title = '2-5-1 The Jazz-Pop Groove'
        description = 'The iconic looping ii-V-I groove from Maroon 5 "Sunday Morning" played in its original key of C Major settling smoothly into a warm, low C Major 1 chord.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'D3'
        laneSignatures = @(2, 5, 1)
        chords = @(
            @{ name = 'Dm'; root = 'D3'; notes = @('D3', 'A3', 'F4'); colors = @('#ff00ea', '#ff007f', '#b026ff'); duration = 1 },
            @{ name = 'G'; root = 'G3'; notes = @('G3', 'B3', 'D4'); colors = @('#ff073a', '#ff5f00', '#fffb00'); duration = 1 },
            @{ name = 'C'; root = 'C3'; notes = @('C3', 'G3', 'E4'); colors = @('#ccff00', '#39ff14', '#00f0ff'); duration = 2 }
        )
    },
    @{
        name = 'week6-day3-1-7-4-classic-rock'
        title = '1-7-4 Classic Rock Swagger'
        description = 'The iconic I-bVII-IV stadium rock progression from Lynyrd Skynyrd "Sweet Home Alabama" (also The Rolling Stones "Sympathy for the Devil", AC/DC "You Shook Me All Night Long") played in its original key of D Mixolydian with grounded cowboy guitar voicings.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'D3'
        laneSignatures = @(1, 7, 4)
        chords = @(
            @{ name = 'D'; root = 'D3'; notes = @('D3', 'A3', 'F#4'); colors = @('#fffb00', '#ff5f00', '#ff073a'); duration = 1 },
            @{ name = 'C'; root = 'C3'; notes = @('C3', 'G3', 'E4'); colors = @('#ff007f', '#b026ff', '#ff00ea'); duration = 1 },
            @{ name = 'G'; root = 'G3'; notes = @('G3', 'D4', 'B4'); colors = @('#ccff00', '#39ff14', '#00f0ff'); duration = 2 }
        )
    },
    @{
        name = 'week6-day4-1-6-3-7-minor-anthem'
        title = '1-6-3-7 The Minor Anthem'
        description = 'The massive minor 4-chord progression from The Cranberries "Zombie" (also Alan Walker "Faded", Eminem / Rihanna "Love the Way You Lie", Of Monsters and Men "Little Talks") played in its original key of E Minor with full, heavy grunge chord registers.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'E3'
        laneSignatures = @(1, 6, 3, 7)
        chords = @(
            @{ name = 'Em'; root = 'E3'; notes = @('E3', 'B3', 'E4', 'G4'); colors = @('#ff00ea', '#b026ff', '#ff007f', '#00f0ff'); duration = 1 },
            @{ name = 'C'; root = 'C3'; notes = @('C3', 'G3', 'C4', 'E4'); colors = @('#39ff14', '#ccff00', '#fffb00', '#ff5f00'); duration = 1 },
            @{ name = 'G'; root = 'G3'; notes = @('G3', 'D4', 'G4', 'B4'); colors = @('#00f0ff', '#00ffd0', '#39ff14', '#ccff00'); duration = 1 },
            @{ name = 'D'; root = 'D3'; notes = @('D3', 'A3', 'D4', 'F#4'); colors = @('#ff5f00', '#ff073a', '#fffb00', '#ff007f'); duration = 1 }
        )
    },
    @{
        name = 'week6-day5-1-4-5-blues-rock'
        title = '1-4-5 Rock & Roll Cadence'
        description = 'The foundational I-IV-V rock and roll progression from Ritchie Valens "La Bamba" and The Troggs "Wild Thing" (also Chuck Berry "Johnny B. Goode") played in its original key of C Major with punchy Latin rock guitar registers.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'C3'
        laneSignatures = @(1, 4, 5)
        chords = @(
            @{ name = 'C'; root = 'C3'; notes = @('C3', 'E4', 'G4'); colors = @('#39ff14', '#ff007f', '#00f0ff'); duration = 1 },
            @{ name = 'F'; root = 'F3'; notes = @('F3', 'C4', 'A4'); colors = @('#ff5f00', '#b026ff', '#ff073a'); duration = 1 },
            @{ name = 'G'; root = 'G3'; notes = @('G3', 'D4', 'B4'); colors = @('#ccff00', '#00ffd0', '#ff00ea'); duration = 2 }
        )
    },
    @{
        name = 'week6-day6-1-7-6-5-flamenco'
        title = '1-7-6-5 The Spanish Descent'
        description = 'The Spanish minor descent from Ray Charles "Hit the Road Jack" (also Dire Straits "Sultans of Swing", Muse "Hysteria") played in its original key of G# Minor with authentic parallel descending horn voicings.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'G#3'
        laneSignatures = @(1, 7, 6, 5)
        chords = @(
            @{ name = 'G#m'; root = 'G#3'; notes = @('G#3', 'D#4', 'G#4', 'B4'); colors = @('#ff00ea', '#ff007f', '#b026ff', '#ff073a'); duration = 1 },
            @{ name = 'F#'; root = 'F#3'; notes = @('F#3', 'C#4', 'F#4', 'A#4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#ff007f'); duration = 1 },
            @{ name = 'E'; root = 'E3'; notes = @('E3', 'B3', 'E4', 'G#4'); colors = @('#ccff00', '#39ff14', '#00f0ff', '#00ffd0'); duration = 1 },
            @{ name = 'D#m'; root = 'D#3'; notes = @('D#3', 'A#3', 'D#4', 'F#4'); colors = @('#00ffd0', '#00f0ff', '#b026ff', '#ff00ea'); duration = 1 }
        )
    },
    @{
        name = 'week6-day7-1-6-2-5-bebop'
        title = '1-6-2-5 The 50s Doo-Wop Loop'
        description = 'The iconic 4-chord doo-wop progression from Frankie Lymon & The Teenagers "Why Do Fools Fall in Love" (also The Marcels "Blue Moon", George Gershwin "I Got Rhythm") played in its original key of F Major with a mutating 1 vs 6 vs 2 vs 5 polyrhythm.'
        bars = 24
        barDuration = 2.4
        initialPulse = 'F3'
        laneSignatures = @(1, 6, 2, 5)
        chords = @(
            @{ name = 'F'; root = 'F3'; notes = @('F3', 'C4', 'F4', 'A4'); colors = @('#00f0ff', '#39ff14', '#ccff00', '#00ffd0'); duration = 1 },
            @{ name = 'Dm7'; root = 'D3'; notes = @('D3', 'C4', 'F4', 'A4'); colors = @('#ff00ea', '#b026ff', '#ff007f', '#00f0ff'); duration = 1 },
            @{ name = 'Gm7'; root = 'G3'; notes = @('G3', 'D4', 'F4', 'Bb4'); colors = @('#ff007f', '#b026ff', '#ff073a', '#ff5f00'); duration = 1 },
            @{ name = 'C7'; root = 'C3'; notes = @('C3', 'E4', 'G4', 'Bb4'); colors = @('#ff073a', '#ff5f00', '#fffb00', '#ff00ea'); duration = 1 }
        )
    }
)

foreach ($s in $specs) {
    $dayPrefix = $s.name.Split('-')[1]
    $pulseId = "$dayPrefix-pulse"
    $laneIds = @()
    for ($i = 0; $i -lt $s.laneSignatures.Count; $i++) {
        $sig = $s.laneSignatures[$i]
        $laneIds += "$dayPrefix-lane-$sig-$i"
    }

    $pulseFreq = Get-Freq $s.initialPulse
    $rhythms = @(
        @{
            id = $pulseId
            timeSignature = 1
            noteName = $s.initialPulse
            color = '#a1a1aa'
            name = 'Beat (1♩)'
            frequency = $pulseFreq
            volume = (Get-Volume $pulseFreq)
            expression = 'cool'
            isMuted = $false
        }
    )

    $events = [System.Collections.Generic.List[Object]]::new()

    # Bar 2: Add all polyrhythm lanes with Chord 0
    $firstChord = $s.chords[0]
    $firstRootFreq = Get-Freq $firstChord.root
    $events.Add(@{
        at = 2
        type = 'update'
        id = $pulseId
        patch = @{
            noteName = $firstChord.root
            frequency = $firstRootFreq
            volume = (Get-Volume $firstRootFreq)
            name = 'Beat (1♩)'
        }
    })

    for ($i = 0; $i -lt $s.laneSignatures.Count; $i++) {
        $sig = $s.laneSignatures[$i]
        $note = $firstChord.notes[$i]
        $color = $firstChord.colors[$i]
        $noteFreq = Get-Freq $note
        $events.Add(@{
            at = 2
            type = 'add'
            rhythm = @{
                id = $laneIds[$i]
                timeSignature = $sig
                noteName = $note
                color = $color
                name = "$note ($sig♩)"
                frequency = $noteFreq
                volume = (Get-Volume $noteFreq)
                expression = 'cool'
                isMuted = $false
            }
        })
    }

    # Generate cycles across bars 2 to 21
    $maxBar = 21
    $bar = 2
    while ($bar -le $maxBar) {
        foreach ($chord in $s.chords) {
            if ($bar -gt 2) {
                $rootFreq = Get-Freq $chord.root
                $events.Add(@{
                    at = $bar
                    type = 'update'
                    id = $pulseId
                    patch = @{
                        noteName = $chord.root
                        frequency = $rootFreq
                        volume = (Get-Volume $rootFreq)
                        name = 'Beat (1♩)'
                    }
                })

                for ($i = 0; $i -lt $s.laneSignatures.Count; $i++) {
                    $sig = $s.laneSignatures[$i]
                    $note = $chord.notes[$i]
                    $color = $chord.colors[$i]
                    $noteFreq = Get-Freq $note
                    $events.Add(@{
                        at = $bar
                        type = 'update'
                        id = $laneIds[$i]
                        patch = @{
                            noteName = $note
                            frequency = $noteFreq
                            volume = (Get-Volume $noteFreq)
                            color = $color
                            name = "$note ($sig♩)"
                        }
                    })
                }
            }
            $bar += $chord.duration
            if ($bar -gt $maxBar) { break }
        }
    }

    # Bar 22: Unwind / remove lanes
    foreach ($id in $laneIds) {
        $events.Add(@{ at = 22; type = 'remove'; id = $id })
    }
    $events.Add(@{ at = 23; type = 'remove'; id = $pulseId })

    $specObj = [ordered]@{
        name = $s.name
        title = $s.title
        description = $s.description
        bars = $s.bars
        barDuration = $s.barDuration
        rhythms = $rhythms
        events = $events
    }

    $targetFile = Join-Path $specsDir "$($s.name).json"
    $jsonContent = $specObj | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($targetFile, $jsonContent, [System.Text.Encoding]::UTF8)
    Write-Host "Generated: $($s.name).json"
}
