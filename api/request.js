const { nsapi, roles, stations } = require('../config.json')
const uri = "https://gateway.apiportal.ns.nl/disruptions/v3/"
const _ = require('underscore');

function parseSimple(events) {
    return events
    .filter(e => e.isActive)
    .map(e => {
        let title = e.title;
        for (const [keyword, tag] of Object.entries(roles)) {
            if (e.title.includes(keyword)) {
                title += `\n${tag}`;
            }
        }
        return `**${e.type}** - _Active_\n${title}\n`;
    })
    .join('\n');
}



module.exports = async function getStoringen() {
    const response = await fetch(uri, {
        headers: {
            'Ocp-Apim-Subscription-Key': nsapi,
        }
    })

    const json = await response.json();
    if (!response.ok) {
        console.log(response.statusText);
    }

    const stationNames = Array.isArray(stations)
        ? stations
        : stations && typeof stations === 'object'
            ? Object.values(stations)
            : [];

    const effectiveStations = stationNames.length ? stationNames : ["Zwolle"];

    const lowered = effectiveStations.map(s => String(s).toLowerCase());
    const filtered = json.filter(item => {
        const title = (item.title || '').toLowerCase();
        return lowered.some(name => title.includes(name));
    });

    return parseSimple(filtered);

}
