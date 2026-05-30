// VISITS

let visits =
    localStorage.getItem("siteVisits");

if(!visits){
    visits = 0;
}

visits++;

localStorage.setItem(
    "siteVisits",
    visits
);

// DOWNLOADS

function trackDownload(name){

    let downloads =
        JSON.parse(
            localStorage.getItem("downloads")
        ) || {};

    if(!downloads[name]){
        downloads[name] = 0;
    }

    downloads[name]++;

    localStorage.setItem(
        "downloads",
        JSON.stringify(downloads)
    );
}

// READING TIME

let startTime = Date.now();

window.addEventListener("beforeunload", () => {

    let readingTime =
        localStorage.getItem("readingTime");

    if(!readingTime){
        readingTime = 0;
    }

    let totalSeconds =
        Math.floor(
            (Date.now() - startTime) / 1000
        );

    readingTime =
        parseInt(readingTime) + totalSeconds;

    localStorage.setItem(
        "readingTime",
        readingTime
    );
});