const { nsapi, roles } = require('../config.json')
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
    const wordToFind = "Zwolle";

    const filtered = json.filter(item => 
        item.title.toLowerCase().includes(wordToFind.toLowerCase()));
    return parseSimple(filtered);

}
