<?php
// 724BAHİS - Premium Match Listing with Local Cache
// Bu dosya maclar.json dosyasından verileri çeker ve şık bir tabloda listeler.

define('CACHE_FILE', __DIR__ . '/maclar.json');

function getCachedMatches() {
    if (!file_exists(CACHE_FILE)) {
        return null;
    }

    $file_content = file_get_contents(CACHE_FILE);
    if (empty($file_content)) {
        return null;
    }

    $data = json_decode($file_content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null; 
    }

    return $data;
}

$mac_verileri = getCachedMatches();
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>724BAHİS - Canlı Bahis Programı</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #040507;
            color: #e5e7eb;
            font-family: 'Inter', sans-serif;
            padding: 40px 20px;
            margin: 0;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(240, 185, 11, 0.15);
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #F0B90B;
            font-family: 'Outfit', sans-serif;
            font-size: 28px;
            font-weight: 900;
            margin: 0;
            letter-spacing: -0.5px;
        }
        .badge-live {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            font-size: 11px;
            font-weight: 800;
            padding: 6px 14px;
            border-radius: 20px;
            letter-spacing: 1px;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .table-container {
            background: #0B0D13;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        th {
            background: rgba(255, 255, 255, 0.02);
            color: #9ca3af;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            font-size: 14px;
            font-weight: 500;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tr:hover td {
            background: rgba(255, 255, 255, 0.01);
            color: #fff;
        }
        .team-name {
            font-weight: 700;
            color: #f3f4f6;
        }
        .vs-text {
            color: #F0B90B;
            font-weight: 800;
            margin: 0 8px;
            font-size: 12px;
        }
        .league-badge {
            display: inline-block;
            background: rgba(240, 185, 11, 0.08);
            border: 1px solid rgba(240, 185, 11, 0.15);
            color: #F0B90B;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
        }
        .fallback-message {
            text-align: center;
            padding: 50px 30px;
            background: #0B0D13;
            border: 1px dashed rgba(240, 185, 11, 0.2);
            border-radius: 16px;
            color: #F0B90B;
            font-weight: 700;
            font-size: 15px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BÜLTEN PROGRAMI</h1>
            <span class="badge-live">AKTİF BÜLTEN</span>
        </div>

        <?php 
        $matches = is_array($mac_verileri) ? ($mac_verileri['data'] ?? ($mac_verileri['items'] ?? $mac_verileri)) : [];
        if (empty($mac_verileri) || empty($matches)): 
        ?>
            <div class="fallback-message">
                Bahis programı güncelleniyor, lütfen 10 dakika sonra tekrar kontrol edin.
            </div>
        <?php else: ?>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 250px;">Kategori / Lig</th>
                            <th>Karşılaşma</th>
                            <th style="text-align: right; width: 150px;">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        foreach ($matches as $match): 
                            $home = $match['homeTeamName'] ?? $match['home'] ?? null;
                            $away = $match['awayTeamName'] ?? $match['away'] ?? null;
                            $league = $match['leagueName'] ?? $match['league'] ?? 'Diğer';
                            $is_live = isset($match['isLive']) && $match['isLive'] ? 'CANLI' : 'BAŞLAMADI';

                            // Real API structure parsing support
                            if (!$home && isset($match['markets'])) {
                                foreach ($match['markets'] as $mkt) {
                                    if (isset($mkt['Selections'])) {
                                        foreach ($mkt['Selections'] as $sel) {
                                            if (isset($sel['Side'])) {
                                                if ($sel['Side'] == 1) {
                                                    $home = $sel['Name'];
                                                } elseif ($sel['Side'] == 3) {
                                                    $away = $sel['Name'];
                                                }
                                            }
                                        }
                                    }
                                    if (isset($mkt['IsLive'])) {
                                        $is_live = $mkt['IsLive'] ? 'CANLI' : 'BAŞLAMADI';
                                    }
                                    if ($home && $away) {
                                        break; // Found team names
                                    }
                                }
                            }

                            $home = $home ?? 'Ev Sahibi';
                            $away = $away ?? 'Deplasman';
                        ?>
                            <tr>
                                <td>
                                    <span class="league-badge"><?php echo htmlspecialchars($league); ?></span>
                                </td>
                                <td>
                                    <span class="team-name"><?php echo htmlspecialchars($home); ?></span>
                                    <span class="vs-text">VS</span>
                                    <span class="team-name"><?php echo htmlspecialchars($away); ?></span>
                                </td>
                                <td style="text-align: right; font-weight: 700; color: <?php echo $is_live === 'CANLI' ? '#ef4444' : '#6b7280'; ?>;">
                                    <?php echo $is_live; ?>
                                </td>
                            </tr>
                        <?php 
                        endforeach; 
                        ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
