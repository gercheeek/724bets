const fs = require('fs');

const rawData = fs.readFileSync('sekabet_extracted.json', 'utf8');
const sekabetData = JSON.parse(rawData);

const poolMatches = [];

sekabetData.forEach(item => {
    if (!item.event || !item.markets) return;
    
    const ev = item.event;
    
    // Find the 1X2 market
    const market1X2 = item.markets.find(m => m.MarketType && (m.MarketType.Name === 'Maç Sonucu 1X2' || m.MarketType.LineTypeName === '1X2'));
    
    let ms1 = 1.85, msx = 3.40, ms2 = 3.80;
    
    if (market1X2 && market1X2.Selections) {
        market1X2.Selections.forEach(sel => {
            if (sel.OutcomeType === 'Ev' || sel.Side === 1 || sel.Name.includes(ev.Participants[0].Name)) {
                ms1 = parseFloat(sel.DisplayOdds.Decimal);
            } else if (sel.OutcomeType === 'Deplasman' || sel.Side === 2 || sel.Name.includes(ev.Participants[1].Name)) {
                ms2 = parseFloat(sel.DisplayOdds.Decimal);
            } else if (sel.OutcomeType === 'Beraberlik' || sel.OutcomeType === 'Draw' || sel.Side === 3 || sel.Name === 'X') {
                msx = parseFloat(sel.DisplayOdds.Decimal);
            }
        });
    }

    const matchObj = {
        id: ev._id,
        data: {
            status: ev.IsSuspended ? 'suspended' : 'active',
            tournament: {
                name: ev.LeagueName || 'Bilinmeyen Lig'
            },
            participants: {
                home: ev.Participants && ev.Participants[0] ? ev.Participants[0].Name : 'Ev',
                away: ev.Participants && ev.Participants[1] ? ev.Participants[1].Name : 'Dep'
            },
            start_time: ev.StartEventDate,
            group_markets: {
                "full_event|0": [
                    `|1x2|~home~1~${ms1}!~draw~x~${msx}!~away~2~${ms2}`
                ]
            }
        }
    };
    
    poolMatches.push(matchObj);
});

fs.writeFileSync('public/sekabet_prelive_matches.json', JSON.stringify(poolMatches, null, 2));
console.log(`Successfully converted ${poolMatches.length} Sekabet matches to NoraBahis format.`);
