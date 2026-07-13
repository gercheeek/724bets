<?php
// .env dosyasını oku ve tokenları yükle
$env = parse_ini_file(__DIR__ . '/.env');

$token_auth = $env['TOKEN_AUTH'] ?? '';
$token_context = $env['TOKEN_CONTEXT'] ?? '';
$token_session = $env['TOKEN_SESSION'] ?? '';

$ch = curl_init();

$url = 'https://prod20522-194534354.fssb.io/api/sportscenter/carousels/featured-matches/markets?language=TR&customerLevel=0&selectedOptionId=0&marketTypes=ML587%2CML0%2COU0%2CHC0%2CML39%2COU39%2CHC39&marketTypesBySports=%7B%221%22%3A%5B%22ML0%22%2C%22OU200%22%2C%22ML39%22%2C%22OU249%22%2C%22QA158%22%2C%22ML169%22%2C%22OU1697%22%2C%22QA1693%22%2C%22ML1633%22%2C%22OU1633%22%2C%22ML167%22%5D%2C%226%22%3A%5B%22ML0%22%2C%22OU0%22%2C%22HC0%22%2C%22ML39%22%2C%22OU39%22%2C%22HC39%22%2C%22ML716%22%2C%22ML717%22%2C%22ML718%22%2C%22ML719%22%2C%22ML720%22%5D%2C%2259%22%3A%5B%22ML587%22%2C%22ML0%22%2C%22OU0%22%2C%22HC0%22%2C%22ML39%22%2C%22OU39%22%2C%22HC39%22%5D%2C%22default%22%3A%5B%22ML0%22%2C%22OU0%22%2C%22HC0%22%2C%22ML39%22%2C%22OU39%22%2C%22HC39%22%2C%22OU6001%22%5D%7D&minimumOddsRestrictedMarkets=ML39%2CML13%2CML1%2CML169&minimumOdds=1.009&draft=false';

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // detect redirects

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'accept: application/json',
    'accept-language: tr,en-US;q=0.9,en;q=0.8,pt;q=0.7',
    'authorization: ' . $token_auth,
    'referer: https://prod20522-194534354.fssb.io/tr/spbkv4/sports/1?operatorToken=51823a3b-4a6a-4c0e-a6c2-664bd961f130',
    'sec-ch-ua: "Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    'sec-ch-ua-mobile: ?0',
    'sec-ch-ua-platform: "macOS"',
    'sec-fetch-dest: empty',
    'sec-fetch-mode: cors',
    'sec-fetch-site: same-origin',
    'sec-fetch-storage-access: active',
    'service-context: ' . $token_context,
    'session: ' . $token_session,
    'time-area: ',
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
]);

$cookie_string = 'events_updates=3231323530343839352c3231323531383538322c323132363632353832; session=' . $token_session . '; operatorToken=undefined; authorization=' . $token_auth;
curl_setopt($ch, CURLOPT_COOKIE, $cookie_string);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

$file_path = __DIR__ . '/maclar.json';

// Error checks
if ($http_code === 302 || $http_code === 301 || $http_code === 401) {
    trigger_error("Tokenları güncelle! Karşı sunucu HTTP kod: " . $http_code, E_USER_WARNING);
    die("Tokenlar güncel değil, lütfen yeni tokenları gir. Mevcut maclar.json korundu.\n");
}

if (empty($response)) {
    trigger_error("Boş API yanıtı alındı! maclar.json güncellenemedi.", E_USER_WARNING);
    die("Hata: Karşı sunucudan boş yanıt döndü. Mevcut maclar.json korundu.\n");
}

$mac_verileri = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($mac_verileri)) {
    trigger_error("API'den geçersiz veya hatalı JSON verisi döndü! Hata: " . json_last_error_msg(), E_USER_WARNING);
    die("Hata: Geçersiz JSON biçimi. Mevcut maclar.json korundu.\n");
}

// Write to local json file
$json_content = json_encode($mac_verileri, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents($file_path, $json_content);

// output pretty JSON to screen
header('Content-Type: application/json; charset=utf-8');
echo $json_content;
?>
