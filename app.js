// =====================================
// ACIIUM WEBSITE ANALYTICS SYSTEM
// FULL ADVANCED VERSION
// =====================================

// =====================================
// UNIQUE VISITOR TRACKING
// =====================================

if(!localStorage.getItem("visited")){

    let visits =
        parseInt(
            localStorage.getItem(
                "siteVisits"
            )
        ) || 0;

    visits++;

    localStorage.setItem(
        "siteVisits",
        visits
    );

    localStorage.setItem(
        "visited",
        "true"
    );
}

// =====================================
// LAST VISIT TIME
// =====================================

localStorage.setItem(
    "lastVisit",
    new Date().toLocaleString()
);

// =====================================
// DEVICE TRACKING
// =====================================

const device =
    /Mobi|Android/i.test(
        navigator.userAgent
    )
    ? "Mobile"
    : "Desktop";

localStorage.setItem(
    "lastDevice",
    device
);

// =====================================
// BROWSER TRACKING
// =====================================

localStorage.setItem(
    "browser",
    navigator.userAgent
);

// =====================================
// ACTIVE USERS
// =====================================

let activeUsers =
    parseInt(
        localStorage.getItem(
            "activeUsers"
        )
    ) || 0;

activeUsers++;

localStorage.setItem(
    "activeUsers",
    activeUsers
);

window.addEventListener(
    "beforeunload",
    () => {

        let active =
            parseInt(
                localStorage.getItem(
                    "activeUsers"
                )
            ) || 1;

        active--;

        if(active < 0){

            active = 0;
        }

        localStorage.setItem(
            "activeUsers",
            active
        );
    }
);

// =====================================
// DAILY VISITS
// =====================================

const today =
    new Date().toLocaleDateString();

let dailyVisits =
    JSON.parse(
        localStorage.getItem(
            "dailyVisits"
        )
    ) || {};

if(!dailyVisits[today]){

    dailyVisits[today] = 0;
}

dailyVisits[today]++;

localStorage.setItem(
    "dailyVisits",
    JSON.stringify(
        dailyVisits
    )
);

// =====================================
// DOWNLOAD TRACKING
// =====================================

function trackDownload(name){

    let downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || {};

    if(!downloads[name]){

        downloads[name] = 0;
    }

    downloads[name]++;

    localStorage.setItem(
        "downloads",
        JSON.stringify(
            downloads
        )
    );
}

// =====================================
// MOST DOWNLOADED ITEM
// =====================================

function getTopDownload(){

    let downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || {};

    let topBook = "None";

    let topCount = 0;

    for(let book in downloads){

        if(downloads[book] > topCount){

            topBook = book;

            topCount = downloads[book];
        }
    }

    return {

        book: topBook,
        count: topCount
    };
}

// =====================================
// READING TIME
// =====================================

let startTime = Date.now();

window.addEventListener(
    "beforeunload",
    () => {

        let readingTime =
            localStorage.getItem(
                "readingTime"
            );

        if(!readingTime){

            readingTime = 0;
        }

        let totalSeconds =
            Math.floor(
                (
                    Date.now()
                    - startTime
                ) / 1000
            );

        readingTime =
            parseInt(readingTime)
            + totalSeconds;

        localStorage.setItem(
            "readingTime",
            readingTime
        );
    }
);

// =====================================
// ADMIN SESSION COUNTER
// =====================================

function trackAdminSession(){

    let sessions =
        parseInt(
            localStorage.getItem(
                "adminSessions"
            )
        ) || 0;

    sessions++;

    localStorage.setItem(
        "adminSessions",
        sessions
    );
}

// =====================================
// FAILED LOGIN TRACKER
// =====================================

function trackFailedLogin(){

    let failed =
        parseInt(
            localStorage.getItem(
                "failedAttempts"
            )
        ) || 0;

    failed++;

    localStorage.setItem(
        "failedAttempts",
        failed
    );
}

// =====================================
// AUTO LOGOUT TIMER
// =====================================

let inactivityTimeout;

function resetInactivityTimer(){

    clearTimeout(
        inactivityTimeout
    );

    inactivityTimeout =
        setTimeout(() => {

            localStorage.removeItem(
                "adminLoggedIn"
            );

            alert(
                "Logged out due to inactivity."
            );

            location.reload();

        }, 300000);
}

document.onclick =
    resetInactivityTimer;

document.onmousemove =
    resetInactivityTimer;

document.onkeypress =
    resetInactivityTimer;

resetInactivityTimer();

// =====================================
// EXPORT ANALYTICS
// =====================================

function exportAnalytics(){

    const data = {

        visits:
            localStorage.getItem(
                "siteVisits"
            ),

        readingTime:
            localStorage.getItem(
                "readingTime"
            ),

        downloads:
            JSON.parse(
                localStorage.getItem(
                    "downloads"
                )
            ),

        dailyVisits:
            JSON.parse(
                localStorage.getItem(
                    "dailyVisits"
                )
            ),

        activeUsers:
            localStorage.getItem(
                "activeUsers"
            ),

        browser:
            localStorage.getItem(
                "browser"
            ),

        device:
            localStorage.getItem(
                "lastDevice"
            ),

        lastVisit:
            localStorage.getItem(
                "lastVisit"
            ),

        failedAttempts:
            localStorage.getItem(
                "failedAttempts"
            ),

        adminSessions:
            localStorage.getItem(
                "adminSessions"
            )
    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    4
                )
            ],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "analytics.json";

    a.click();
}

// =====================================
// RESET ANALYTICS
// =====================================

function resetAnalytics(){

    const confirmReset =
        confirm(
            "Delete ALL analytics?"
        );

    if(!confirmReset){

        return;
    }

    localStorage.clear();

    alert(
        "Analytics Reset."
    );

    location.reload();
}

// =====================================
// LIVE STATS DISPLAY
// =====================================

function getAnalyticsSummary(){

    return {

        totalVisits:
            localStorage.getItem(
                "siteVisits"
            ) || 0,

        readingMinutes:
            Math.floor(
                (
                    parseInt(
                        localStorage.getItem(
                            "readingTime"
                        )
                    ) || 0
                ) / 60
            ),

        activeUsers:
            localStorage.getItem(
                "activeUsers"
            ) || 0,

        topDownload:
            getTopDownload(),

        device:
            localStorage.getItem(
                "lastDevice"
            ),

        lastVisit:
            localStorage.getItem(
                "lastVisit"
            )
    };
}
