// ==UserScript==
// @name         Florr.io Auto AFK Mobile
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Simplified Auto AFK in florr.io for mobile with adjustable log panel
// @author       Beeeee
// @match        https://florr.io/
// @icon         https://florr.io/favicon.ico
// @grant        none
// ==/UserScript==

'use strict';

let AFKinterval = 0;
let AFKing = false;
let checkInterval = 5000;
let afkButton;

const logPanel = document.createElement('div');
Object.assign(logPanel.style, {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    height: "100px",
    overflowY: "scroll",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    fontSize: "12px",
    zIndex: "10000",
    padding: "5px",
    display: "none"
});
document.body.appendChild(logPanel);

const log = (message) => {
    console.log(message);
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    logPanel.appendChild(logMessage);
    logPanel.scrollTop = logPanel.scrollHeight;
};

const clickAFKCheckButton = () => {
    const afkCheckButton = document.querySelector('button[data-qa-id="afkCheck"]') || document.querySelector('.afk-check-button');
    if (afkCheckButton) {
        afkCheckButton.click();
        log("AFK Check button clicked!");
    } else {
        log("AFK Check button not found.");
    }
};

const startAFK = () => {
    log(`Start AFK called. Current AFK state: ${AFKing}`);
    if (AFKing) {
        clearInterval(AFKinterval);
        clearInterval(afkCheckInterval);
        AFKing = false;
        afkButton.innerHTML = "Start AFK";
        logPanel.style.display = "none";
        log("AFK Disabled!");
    } else {
        AFKinterval = setInterval(() => {
            log("Sending AFK signals");
            window.dispatchEvent(new KeyboardEvent("keydown", { "key": "1" }));
            setTimeout(() => {
                window.dispatchEvent(new KeyboardEvent("keyup", { "key": "1" }));
            }, Math.random() * 100);
        }, 60000);

        afkCheckInterval = setInterval(clickAFKCheckButton, checkInterval);

        AFKing = true;
        afkButton.innerHTML = "Stop AFK";
        logPanel.style.display = "block";
        log("AFK Enabled!");
    }
};

const ensureAFKState = () => {
    afkButton.innerHTML = AFKing ? "Stop AFK" : "Start AFK";
};

const initializeScript = () => {
    log("Initializing script...");

    afkButton = document.createElement('button');
    Object.assign(afkButton.style, {
        position: "fixed",
        bottom: "50%",
        right: "10%",
        background: "#00000077",
        color: "#FFFFFF",
        fontSize: "14px",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    });
    afkButton.innerHTML = "Start AFK";
    afkButton.onclick = () => {
        if (!afkButton.disabled) {
            startAFK();
            afkButton.disabled = true;
            setTimeout(() => { afkButton.disabled = false; }, 1000);
        }
    };
    document.body.appendChild(afkButton);
    log("Button added to DOM");

    setInterval(ensureAFKState, 1000);
};

window.addEventListener('load', initializeScript);
