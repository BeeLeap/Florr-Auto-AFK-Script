// ==UserScript==
// @name         Florr.io Auto AFK
// @namespace    https://beeeeedev.github.io
// @version      1.2.0
// @description  Simplified Auto AFK in florr.io
// @author       Beeeee
// @match        https://florr.io/
// @icon         https://florr.io/favicon.ico
// @grant        none
// ==/UserScript==

'use strict';

let AFKinterval = 0;
let AFKing = false;
let checkInterval = 5000; // 每5秒检查一次
let afkButton;

const log = (message) => {
    console.log(message);
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
    log("Start AFK called. Current AFK state: " + AFKing);
    if (AFKing) {
        clearInterval(AFKinterval);
        clearInterval(afkCheckInterval);
        AFKing = false;
        afkButton.innerHTML = "Start AFK";
        log("AFK Disabled!");
    } else {
        AFKinterval = setInterval(() => {
            log("Sending AFK signals");
            window.dispatchEvent(new KeyboardEvent("keydown", { "key": "1" }));
            setTimeout(() => {
                window.dispatchEvent(new KeyboardEvent("keyup", { "key": "1" }));
            }, Math.random() * 100);
        }, 60000);

        afkCheckInterval = setInterval(clickAFKCheckButton, checkInterval); // 定时检查AFK检查按钮

        AFKing = true;
        afkButton.innerHTML = "Stop AFK";
        log("AFK Enabled!");
    }
};

window.onload = () => {
    log("Florr.io Auto AFK script loaded");

    afkButton = document.createElement('button');
    afkButton.id = "afkStartButton";
    afkButton.style.position = "fixed";
    afkButton.style.bottom = "50%";
    afkButton.style.right = "10%";
    afkButton.style.background = "#00000077";
    afkButton.style.color = "#FFFFFF";
    afkButton.style.fontSize = "14px";
    afkButton.style.padding = "10px";
    afkButton.style.border = "none";
    afkButton.style.borderRadius = "5px";
    afkButton.style.cursor = "pointer";
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
};
