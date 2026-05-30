// =====================================
// SECURE ADMIN LOGIN
// =====================================
const PASSWORD_HASH =
"d46d4b092b6d6afb086d59816b37785320406b14c6c77250d61ff2592321ec1b";

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

    const entered =
        document.getElementById(
            "passkey"
        ).value;

    const enteredHash =
        await sha256(entered);

    if(enteredHash === PASSWORD_HASH){

        document.getElementById(
            "loginScreen"
        ).style.display = "none";

        document.getElementById(
            "dashboard"
        ).style.display = "block";

        loadAnalytics();

    }else{

        alert("Incorrect Passkey");
    }
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

    // SAFE HTML GENERATION

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
