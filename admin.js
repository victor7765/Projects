// =====================================
// SECURITY SETTINGS
// =====================================

const PASSWORD_HASH =
"f93c41d14b9ba1824f4d584812cce5216c20535a2cc64bffd475bce657bef161";

let failedAttempts = 0;

const MAX_ATTEMPTS = 5;

// =====================================
// DISABLE RIGHT CLICK
// =====================================

document.addEventListener(
    "contextmenu",
    event => event.preventDefault()
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
        new TextEncoder().encode(message);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            msgBuffer
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    const hashHex =
        hashArray
        .map(b =>
            b.toString(16).padStart(2, "0")
        )
        .join("");

    return hashHex;
}

// =====================================
// LOGIN
// =====================================

async function login(){

    if(failedAttempts >= MAX_ATTEMPTS){

        alert(
            "Too many failed attempts."
        );

        return;
    }

    const entered =
        document.getElementById(
            "passkey"
        ).value;

    const enteredHash =
        await sha256(entered);

    if(enteredHash === PASSWORD_HASH){

        localStorage.setItem(
            "adminAuthenticated",
            "true"
        );

        failedAttempts = 0;

        showDashboard();

    }else{

        failedAttempts++;

        alert(
            "Incorrect Passkey"
        );
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
}

// =====================================
// SHOW LOGIN
// =====================================

function showLogin(){

    document.getElementById(
        "loginScreen"
    ).style.display = "block";

    document.getElementById(
        "dashboard"
    ).style.display = "none";
}

// =====================================
// LOAD ANALYTICS
// =====================================

function loadAnalytics(){

    const visits =
        localStorage.getItem(
            "siteVisits"
        ) || 0;

    const readingTime =
        localStorage.getItem(
            "readingTime"
        ) || 0;

    const downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || {};

    document.getElementById(
        "visits"
    ).innerText = visits;

    document.getElementById(
        "readingTime"
    ).innerText =
        Math.floor(readingTime / 60)
        + " minutes";

    // =================================
    // SAFE DOWNLOAD RENDERING
    // =================================

    const container =
        document.getElementById(
            "downloads"
        );

    container.innerHTML = "";

    for(let book in downloads){

        const p =
            document.createElement("p");

        p.textContent =
            `${book}: ${downloads[book]} downloads`;

        container.appendChild(p);
    }
}
