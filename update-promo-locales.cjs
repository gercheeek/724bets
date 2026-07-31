const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    promo_view: {
      active: "AKTİF",
      upcoming: "YAKLAŞAN",
      ended: "SONA ERDİ",
      live_leaderboard: "Canlı Liderlik",
      live: "CANLI",
      pts: "PTS",
      play_now: "ŞİMDİ OYNA",
      active_tournaments: "Aktif Turnuvalar",
      upcoming_tournaments: "Yaklaşan Turnuvalar",
      ended_tournaments: "Sona Eren Turnuvalar",
      back_to_tournaments: "Turnuvalara Dön",
      active_tournament: "Aktif Turnuva",
      upcoming_tournament: "Yaklaşan Turnuva",
      time_left: "Kalan Süre",
      prize_pool: "Ödül Havuzu",
      participants: "Katılımcı",
      join_tournament: "Turnuvaya Katıl",
      ranking: "Sıralama",
      player: "Oyuncu",
      score: "Puan",
      rules: "Turnuva Kuralları ve Puanlama",
      games: "Turnuva Oyunları"
    }
  },
  en: {
    promo_view: {
      active: "ACTIVE",
      upcoming: "UPCOMING",
      ended: "ENDED",
      live_leaderboard: "Live Leaderboard",
      live: "LIVE",
      pts: "PTS",
      play_now: "PLAY NOW",
      active_tournaments: "Active Tournaments",
      upcoming_tournaments: "Upcoming Tournaments",
      ended_tournaments: "Ended Tournaments",
      back_to_tournaments: "Back to Tournaments",
      active_tournament: "Active Tournament",
      upcoming_tournament: "Upcoming Tournament",
      time_left: "Time Left",
      prize_pool: "Prize Pool",
      participants: "Participants",
      join_tournament: "Join Tournament",
      ranking: "Ranking",
      player: "Player",
      score: "Score",
      rules: "Tournament Rules & Scoring",
      games: "Tournament Games"
    }
  },
  'pt-BR': {
    promo_view: {
      active: "ATIVO",
      upcoming: "PRÓXIMO",
      ended: "ENCERRADO",
      live_leaderboard: "Tabela ao Vivo",
      live: "AO VIVO",
      pts: "PTS",
      play_now: "JOGUE AGORA",
      active_tournaments: "Torneios Ativos",
      upcoming_tournaments: "Próximos Torneios",
      ended_tournaments: "Torneios Encerrados",
      back_to_tournaments: "Voltar aos Torneios",
      active_tournament: "Torneio Ativo",
      upcoming_tournament: "Próximo Torneio",
      time_left: "Tempo Restante",
      prize_pool: "Prêmio",
      participants: "Participantes",
      join_tournament: "Participar do Torneio",
      ranking: "Classificação",
      player: "Jogador",
      score: "Pontos",
      rules: "Regras e Pontuação",
      games: "Jogos do Torneio"
    }
  },
  es: {
    promo_view: {
      active: "ACTIVO",
      upcoming: "PRÓXIMO",
      ended: "FINALIZADO",
      live_leaderboard: "Clasificación en Vivo",
      live: "EN VIVO",
      pts: "PTS",
      play_now: "JUGAR AHORA",
      active_tournaments: "Torneos Activos",
      upcoming_tournaments: "Próximos Torneos",
      ended_tournaments: "Torneos Finalizados",
      back_to_tournaments: "Volver a Torneos",
      active_tournament: "Torneo Activo",
      upcoming_tournament: "Próximo Torneo",
      time_left: "Tiempo Restante",
      prize_pool: "Premio",
      participants: "Participantes",
      join_tournament: "Unirse al Torneo",
      ranking: "Clasificación",
      player: "Jugador",
      score: "Puntos",
      rules: "Reglas y Puntuación",
      games: "Juegos del Torneo"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.promo_view = newContent[lang].promo_view;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Promo locales updated.");
