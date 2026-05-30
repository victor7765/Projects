const PASSKEY = "ThePowerOfThought";

function login(){

    const entered =
        document.getElementById("passkey").value;

    if(entered === PASSKEY){

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

function loadAnalytics(){

    const visits =
        localStorage.getItem("siteVisits") || 0;

    const readingTime =
        localStorage.getItem("readingTime") || 0;

    const downloads =
        JSON.parse(
            localStorage.getItem("downloads")
        ) || {};

    document.getElementById("visits")
        .innerText = visits;

    document.getElementById("readingTime")
        .innerText =
        Math.floor(readingTime / 60)
        + " minutes";

    let html = "";

    for(let book in downloads){

        html += `
            <p>
                ${book}: ${downloads[book]} downloads
            </p>
        `;
    }

    document.getElementById("downloads")
        .innerHTML = html;
}