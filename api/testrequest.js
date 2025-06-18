const { nsapi } = require('../config.json')
const uri = "https://gateway.apiportal.ns.nl/disruptions/v3/"
async function request() {
    const response = await fetch(uri, {
        headers: {
            'Ocp-Apim-Subscription-Key': nsapi,
        }
    })
    const json = await response.json();
    if (!response.ok) {
        console.log(response.statusText);
    }
    console.log(json);
}
request();