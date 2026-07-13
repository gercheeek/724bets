<?php
// 724BAHİS - Background Worker Daemon
// Bu betik arka planda sürekli çalışarak her 60 saniyede bir maclari_cek.php dosyasını tetikler.
// Paylaşımlı hostinglerde veya cron yetkisi olmayan sunucularda alternatif olarak kullanılabilir.

ignore_user_abort(true); // Kullanıcı tarayıcıyı kapatsa bile çalışmaya devam et
set_time_limit(0);       // Çalışma süresi sınırını kaldır

$script_path = __DIR__ . '/maclari_cek.php';

while (true) {
    if (file_exists($script_path)) {
        // Çekici betiği çalıştır
        ob_start();
        include $script_path;
        ob_end_clean();
    }
    
    // 60 saniye (1 dakika) bekle
    sleep(60);
}
?>
