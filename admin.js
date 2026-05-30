// =====================================
// SECURITY SETTINGS
// =====================================

const PASSWORD_HASH =
"f93c41d14b9ba1824f4d584812cce5216c20535a2cc64bffd475bce657bef161";

let failedAttempts =
    parseInt(
        localStorage.getItem(
            "failedAttempts"
        )
    ) || 0;

const MAX_ATTEMPTS = 5;

// =====================================
// DISABLE RIGHT CLICK
// =====================================

document.addEventListener(
    "contextmenu",
    event => event.preventDefault()
);

// =====================================
// DISABLE DEVTOOLS SHORTCUTS
// =====================================

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key === "F12"
            ||
            (
                event.ctrlKey
                &&
                event.shiftKey
                &&
                (
                    event.key === "I"
                    ||
                    event.key === "J"
                    ||
                    event.key === "C"
                )
            )
        ){

            event.preventDefault();
        }
    }
);

// =====================================
// LOGIN BUTTON EVENT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    if(loginButton){

        loginButton.addEventListener(
            "click",
            login
        );
    }
});

// =====================================
// LOGOUT BUTTON EVENT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    if(logoutButton){

        logoutButton.addEventListener(
            "click",
            logout
        );
    }
});

// =====================================
// BUTTON EVENTS
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // LOGIN BUTTON

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        if(loginButton){

            loginButton.addEventListener(
                "click",
                login
            );
        }

        // LOGOUT BUTTON

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );

        if(logoutButton){

            logoutButton.addEventListener(
                "click",
                logout
            );
        }

        // RESET ANALYTICS BUTTON

        const resetButton =
            document.getElementById(
                "resetButton"
            );

        if(resetButton){

            resetButton.addEventListener(
                "click",
                resetAnalytics
            );
        }

        // EXPORT BUTTON

        const exportButton =
            document.getElementById(
                "exportButton"
            );

        if(exportButton){

            exportButton.addEventListener(
                "click",
                exportAnalytics
            );
        }
    }
);

// =====================================
// PAGE LOAD AUTH CHECK
// =====================================

window.onload = function(){

    const authenticated =
        localStorage.getItem(
            "adminAuthenticated"
        );

    if(authenticated === "true"){

        showDashboard();

    }else{

        showLogin();
    }
};

// =====================================
// SHA-256 HASH FUNCTION
// =====================================

async function sha256(message){

    const msgBuffer =
        new TextEncoder().encode(
            message
        );

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            msgBuffer
        );

    const hashArray =
        Array.from(
            new Uint8Array(
                hashBuffer
            )
        );

    const hashHex =
        hashArray
        .map(b =>
            b.toString(16)
            .padStart(2, "0")
        )
        .join("");

    return hashHex;
}

// =====================================
// LOGIN
// =====================================

async function login(){

    const warning =
        document.getElementById(
            "securityWarning"
        );

    if(failedAttempts >= MAX_ATTEMPTS){

        warning.textContent =
            "Too many failed attempts.";

        return;
    }

    const entered =
        document.getElementById(
            "passkey"
        ).value;

    const enteredHash =
        await sha256(
            entered
        );

    if(
        enteredHash
        ===
        PASSWORD_HASH
    ){

        localStorage.setItem(
            "adminAuthenticated",
            "true"
        );

        failedAttempts = 0;

        localStorage.setItem(
            "failedAttempts",
            0
        );

        // TRACK ADMIN SESSION

        trackAdminSession();

        showDashboard();

    }else{

        failedAttempts++;

        localStorage.setItem(
            "failedAttempts",
            failedAttempts
        );

        // TRACK FAILED LOGIN

        trackFailedLogin();

        warning.textContent =
            `Incorrect Passkey (${failedAttempts}/${MAX_ATTEMPTS})`;
    }
}

// =====================================
// LOGOUT
// =====================================

function logout(){

    localStorage.removeItem(
        "adminAuthenticated"
    );

    location.reload();
}

// =====================================
// SHOW DASHBOARD
// =====================================

function showDashboard(){

    document.getElementById(
        "loginScreen"
    ).style.display = "none";

    document.getElementById(
        "dashboard"
    ).style.display = "block";

    loadAnalytics();

    resetInactivityTimer();
}

// =====================================
// SHOW LOGIN
// =====================================

function showLogin(){

    document.getElementById(
        "loginScreen"
    ).style.display = "flex";

    document.getElementById(
        "dashboard"
    ).style.display = "none";
}

// =====================================
// LOAD ANALYTICS
// =====================================

function loadAnalytics(){

    // VISITS

    const visits =
        localStorage.getItem(
            "siteVisits"
        ) || 0;

    document.getElementById(
        "visits"
    ).innerText = visits;

    // READING TIME

    const readingTime =
        localStorage.getItem(
            "readingTime"
        ) || 0;

    document.getElementById(
        "readingTime"
    ).innerText =
        Math.floor(
            readingTime / 60
        ) + " minutes";

    // ACTIVE USERS

    document.getElementById(
        "activeUsers"
    ).innerText =
        localStorage.getItem(
            "activeUsers"
        ) || 0;

    // DEVICE

    document.getElementById(
        "device"
    ).innerText =
        localStorage.getItem(
            "lastDevice"
        ) || "Unknown";

    // LAST VISIT

    document.getElementById(
        "lastVisit"
    ).innerText =
        localStorage.getItem(
            "lastVisit"
        ) || "None";

    // ADMIN SESSIONS

    document.getElementById(
        "adminSessions"
    ).innerText =
        localStorage.getItem(
            "adminSessions"
        ) || 0;

    // FAILED ATTEMPTS

    document.getElementById(
        "failedAttempts"
    ).innerText =
        localStorage.getItem(
            "failedAttempts"
        ) || 0;

    // TOP DOWNLOAD

    const top =
        getTopDownload();

    document.getElementById(
        "topDownload"
    ).innerText =
        `${top.book} (${top.count})`;

    // DOWNLOADS

    const downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || {};

    const downloadsContainer =
        document.getElementById(
            "downloads"
        );

    downloadsContainer.innerHTML = "";

    for(let book in downloads){

        const p =
            document.createElement(
                "p"
            );

        p.textContent =
            `${book}: ${downloads[book]} downloads`;

        downloadsContainer
        .appendChild(p);
    }

    // DAILY VISITS

    const daily =
        JSON.parse(
            localStorage.getItem(
                "dailyVisits"
            )
        ) || {};

    const dailyContainer =
        document.getElementById(
            "dailyVisits"
        );

    dailyContainer.innerHTML = "";

    for(let date in daily){

        const p =
            document.createElement(
                "p"
            );

        p.textContent =
            `${date}: ${daily[date]} visits`;

        dailyContainer
        .appendChild(p);
    }

    // BROWSER INFO

    document.getElementById(
        "browser"
    ).textContent =
        localStorage.getItem(
            "browser"
        ) || "Unknown";
}
