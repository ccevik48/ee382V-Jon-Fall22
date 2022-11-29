let currentBlockTS;
let currentBlockHash;

async function fetchAsync() {
    let response = await fetch("https://mempool.space/api/v1/blocks");
    let data = await response.json();
    currentBlockTS = data[0].timestamp;
    currentBlockHash = data[0].id;
}

function convert(seconds) {
    let mins = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    mins = (mins < 10) ? `0${mins}` : mins.toString();
    sec = (sec < 10) ? `0${sec}` : sec.toString();

    return `${mins}:${sec}`;
}

setInterval(() => {
    fetchAsync();
}, 15000);

let timer = 0
setInterval(() => {
    if (currentBlockTS === undefined) {
        fetchAsync();
        return;
    }

    // Seconds since last block is mined!
    timer = Date.now() / 1000 - currentBlockTS;
    chrome.action.setBadgeText({
        text: convert(timer)
    })
}, 1000)


chrome.action.onClicked.addListener(function (activeTab) {
    if (currentBlockHash !== undefined)
        chrome.tabs.create({url: `https://mempool.space/block/${currentBlockHash}`});
    else
        chrome.tabs.create({url: `https://mempool.space/`});
});