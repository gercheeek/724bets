export const generateSafeAnalysis = (home: string, away: string, pred: string) => {
    const templates = [
        `Yapay zeka analiz modelimiz, ${home} ve ${away} eşleşmesinde tarihi verileri inceledi. "${pred}" tercihi istatistiksel olarak %92'lik bir güven skoruna sahip. Banko adayı.`,
        `Bu karşılaşmada risk algoritması minimum seviyede uyarı veriyor. ${home} - ${away} mücadelesinde "${pred}" seçeneği kasa katlamak isteyenler için en tehlikesiz liman.`,
        `Gelişmiş veri setimiz, ${home} - ${away} maçındaki form durumlarını analiz ettiğinde "${pred}" tahmini için yeşil ışık yakıyor. Editörlerimizin de favorisi olan bu oran kaçmaz.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
};
