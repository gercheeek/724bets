const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    bet_slip: { title: "Bahis Kuponu", fast: "Hızlı", types: { tekli: "Tekli", kombine: "Kombine", sistem: "Sistem" }, combo_bonus: "Kombine Bonusu", matches_3: "3 Maç (%5)", matches_4: "4 Maç (%10)", matches_5: "5+ Maç (%15)", empty_title: "Kuponunuz Boş", empty_desc: "Bahis yapmak için oranlara tıklayarak seçim ekleyin.", total_odds: "Toplam Oran", potential_win: "Olası Kazanç", login_to_bet: "Giriş Yap", place_bet: "Bahis Yap", chat_button: "Sohbete Geç" }
  },
  en: {
    bet_slip: { title: "Bet Slip", fast: "Fast", types: { tekli: "Single", kombine: "Combo", sistem: "System" }, combo_bonus: "Combo Bonus", matches_3: "3 Matches (5%)", matches_4: "4 Matches (10%)", matches_5: "5+ Matches (15%)", empty_title: "Bet Slip Empty", empty_desc: "Click on odds to add selections to your bet slip.", total_odds: "Total Odds", potential_win: "Potential Win", login_to_bet: "Login", place_bet: "Place Bet", chat_button: "Start Chat" }
  },
  'pt-BR': {
    bet_slip: { title: "Boletim de Apostas", fast: "Rápido", types: { tekli: "Simples", kombine: "Combo", sistem: "Sistema" }, combo_bonus: "Bônus Combo", matches_3: "3 Partidas (5%)", matches_4: "4 Partidas (10%)", matches_5: "5+ Partidas (15%)", empty_title: "Boletim Vazio", empty_desc: "Clique nas cotas para adicionar seleções ao seu boletim de apostas.", total_odds: "Cotas Totais", potential_win: "Ganhos Potenciais", login_to_bet: "Entrar", place_bet: "Apostar", chat_button: "Iniciar Chat" }
  },
  es: {
    bet_slip: { title: "Boleto de Apuestas", fast: "Rápido", types: { tekli: "Simple", kombine: "Combinada", sistem: "Sistema" }, combo_bonus: "Bono Combinada", matches_3: "3 Partidos (5%)", matches_4: "4 Partidos (10%)", matches_5: "5+ Partidos (15%)", empty_title: "Boleto Vacío", empty_desc: "Haz clic en las cuotas para añadir selecciones a tu boleto de apuestas.", total_odds: "Cuotas Totales", potential_win: "Ganancia Potencial", login_to_bet: "Iniciar Sesión", place_bet: "Apostar", chat_button: "Iniciar Chat" }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.bet_slip = newContent[lang].bet_slip;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Locales updated with bet_slip.");
