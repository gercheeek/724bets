const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    slider: {
      play: "Oyna",
      view_all: "Tümünü Gör",
      volatility_high: "Yüksek",
      volatility_medium: "Orta",
      volatility_low: "Düşük",
      daily_kupon: {
        banko: "GÜNÜN BANKO KUPONU",
        low_risk: "GÜNÜN AZ RİSK KUPONU",
        high_risk: "GÜNÜN YÜKSEK RİSK KUPONU",
        tab_low: "Az Risk",
        tab_medium: "Orta Risk",
        tab_high: "Yüksek",
        total_odds: "TOPLAM ORAN",
        play_now: "Hemen Oyna",
        add_to_slip: "Ekle"
      }
    },
    originals: {
      desc_keno: "Sayı tahmini",
      desc_roulette: "Şans çarkı döndür",
      desc_blackjack: "Klasik 21 kart oyunu",
      desc_plinko: "Yukarıdan aşağı düşen top",
      desc_mines: "Mayınlardan kaçın",
      desc_chicken: "Tavuğun hayatta kalma oyunu",
      desc_hilo: "Daha yüksek veya daha düşük kartı tahmin et"
    }
  },
  en: {
    slider: {
      play: "Play",
      view_all: "View All",
      volatility_high: "High",
      volatility_medium: "Medium",
      volatility_low: "Low",
      daily_kupon: {
        banko: "DAILY SURE BET",
        low_risk: "DAILY LOW RISK BET",
        high_risk: "DAILY HIGH RISK BET",
        tab_low: "Low Risk",
        tab_medium: "Med Risk",
        tab_high: "High",
        total_odds: "TOTAL ODDS",
        play_now: "Play Now",
        add_to_slip: "Add"
      }
    },
    originals: {
      desc_keno: "Number prediction",
      desc_roulette: "Spin the wheel of fortune",
      desc_blackjack: "Classic 21 card game",
      desc_plinko: "Ball dropping from above",
      desc_mines: "Avoid the mines",
      desc_chicken: "Chicken survival game",
      desc_hilo: "Guess higher or lower card"
    }
  },
  'pt-BR': {
    slider: {
      play: "Jogar",
      view_all: "Ver Tudo",
      volatility_high: "Alto",
      volatility_medium: "Médio",
      volatility_low: "Baixo",
      daily_kupon: {
        banko: "APOSTA SEGURA DIÁRIA",
        low_risk: "BAIXO RISCO DIÁRIO",
        high_risk: "ALTO RISCO DIÁRIO",
        tab_low: "Baixo Risco",
        tab_medium: "Médio Risco",
        tab_high: "Alto",
        total_odds: "COTAS TOTAIS",
        play_now: "Jogar Agora",
        add_to_slip: "Adicionar"
      }
    },
    originals: {
      desc_keno: "Previsão de números",
      desc_roulette: "Gire a roda da fortuna",
      desc_blackjack: "Clássico jogo de cartas 21",
      desc_plinko: "Bola caindo de cima",
      desc_mines: "Evite as minas",
      desc_chicken: "Jogo de sobrevivência do frango",
      desc_hilo: "Adivinhe a carta maior ou menor"
    }
  },
  es: {
    slider: {
      play: "Jugar",
      view_all: "Ver Todo",
      volatility_high: "Alto",
      volatility_medium: "Medio",
      volatility_low: "Bajo",
      daily_kupon: {
        banko: "APUESTA SEGURA DIARIA",
        low_risk: "BAJO RIESGO DIARIO",
        high_risk: "ALTO RIESGO DIARIO",
        tab_low: "Bajo Riesgo",
        tab_medium: "Medio Riesgo",
        tab_high: "Alto",
        total_odds: "CUOTAS TOTALES",
        play_now: "Jugar Ahora",
        add_to_slip: "Añadir"
      }
    },
    originals: {
      desc_keno: "Predicción de números",
      desc_roulette: "Gira la rueda de la fortuna",
      desc_blackjack: "Clásico juego de cartas 21",
      desc_plinko: "Pelota cayendo desde arriba",
      desc_mines: "Evita las minas",
      desc_chicken: "Juego de supervivencia de pollo",
      desc_hilo: "Adivina la carta mayor o menor"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.slider = newContent[lang].slider;
  data.originals = newContent[lang].originals;
  
  // Also add live_games and view_all to root for LiveGamesSlider backward compatibility
  data.live_games = newContent[lang].slider.play; 
  data.view_all = newContent[lang].slider.view_all;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Slider locales updated.");
