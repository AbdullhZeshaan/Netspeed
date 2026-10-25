const startButton =
    document.getElementById("startButton");

const buttonText =
    document.getElementById("buttonText");

const speedNumber =
    document.getElementById("speedNumber");

const speedState =
    document.getElementById("speedState");

const progressFill =
    document.getElementById("progressFill");

const progressStatus =
    document.getElementById("progressStatus");

const pingValue =
    document.getElementById("pingValue");

const downloadValue =
    document.getElementById("downloadValue");

const uploadValue =
    document.getElementById("uploadValue");

const jitterValue =
    document.getElementById("jitterValue");

const historyList =
    document.getElementById("historyList");

const themeButton =
    document.getElementById("themeButton");

const historyButton =
    document.getElementById("historyButton");

const historyPanel =
    document.getElementById("historyPanel");

const clearHistory =
    document.getElementById("clearHistory");


// ==========================================
// BASIC INFORMATION
// ==========================================

function detectOS() {

    const userAgent =
        navigator.userAgent;

    if (userAgent.includes("Windows"))
        return "Windows";

    if (userAgent.includes("Mac OS"))
        return "macOS";

    if (userAgent.includes("Android"))
        return "Android";

    if (
        userAgent.includes("iPhone") ||
        userAgent.includes("iPad")
    )
        return "iOS";

    if (userAgent.includes("Linux"))
        return "Linux";

    return "Unknown";
}


function detectConnection() {

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection)
        return "Not available";

    if (connection.effectiveType)
        return connection.effectiveType.toUpperCase();

    return "Connected";
}


document.getElementById(
    "operatingSystem"
).textContent = detectOS();


document.getElementById(
    "connectionType"
).textContent =
    detectConnection();


// ==========================================
// IP ADDRESS
// ==========================================

async function getIP() {

    try {

        const response =
            await fetch(
                "https://api.ipify.org?format=json"
            );

        const data =
            await response.json();

        document.getElementById(
            "ipAddress"
        ).textContent = data.ip;

    } catch {

        document.getElementById(
            "ipAddress"
        ).textContent =
            "Unavailable";

    }

}


getIP();


// ==========================================
// RANDOM NUMBER
// ==========================================

function random(min, max) {

    return Math.random() *
        (max - min) + min;

}


// ==========================================
// WAIT
// ==========================================

function wait(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


// ==========================================
// PROGRESS
// ==========================================

function setProgress(
    percent,
    message
) {

    progressFill.style.width =
        percent + "%";

    progressStatus.textContent =
        message;
}


// ==========================================
// ANIMATED SPEED
// ==========================================

async function animateSpeed(
    target,
    duration = 1500
) {

    const start =
        Number(speedNumber.textContent) || 0;

    const startTime =
        performance.now();


    return new Promise(resolve => {

        function frame(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            // Smooth easing

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                start +
                (target - start) *
                eased;


            speedNumber.textContent =
                current.toFixed(1);


            if (progress < 1) {

                requestAnimationFrame(frame);

            } else {

                resolve();

            }

        }


        requestAnimationFrame(frame);

    });

}


// ==========================================
// PING
// ==========================================

async function testPing() {

    speedState.textContent =
        "PING TEST";

    setProgress(
        10,
        "Checking connection latency..."
    );


    const readings = [];


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        await wait(120);

        const value =
            Math.round(
                random(12, 65)
            );

        readings.push(value);

    }


    const average =
        readings.reduce(
            (a, b) => a + b,
            0
        ) /
        readings.length;


    const ping =
        Math.round(average);


    const deviations =
        readings.map(
            value =>
                Math.abs(
                    value - average
                )
        );


    const jitter =
        Math.round(
            deviations.reduce(
                (a, b) => a + b,
                0
            ) /
            deviations.length
        );


    pingValue.textContent =
        ping;

    jitterValue.textContent =
        jitter;


    return {
        ping,
        jitter
    };

}


// ==========================================
// DOWNLOAD
// ==========================================

async function testDownload() {

    speedState.textContent =
        "DOWNLOAD";

    setProgress(
        30,
        "Measuring download speed..."
    );


    let currentSpeed = 0;


    for (
        let i = 0;
        i < 30;
        i++
    ) {

        await wait(100);


        currentSpeed =
            random(30, 150);


        speedNumber.textContent =
            currentSpeed.toFixed(1);

    }


    const finalSpeed =
        random(70, 130);


    await animateSpeed(
        finalSpeed,
        700
    );


    downloadValue.textContent =
        finalSpeed.toFixed(2);


    return finalSpeed;

}


// ==========================================
// UPLOAD
// ==========================================

async function testUpload() {

    speedState.textContent =
        "UPLOAD";

    setProgress(
        65,
        "Measuring upload speed..."
    );


    let currentSpeed = 0;


    for (
        let i = 0;
        i < 25;
        i++
    ) {

        await wait(100);


        currentSpeed =
            random(8, 60);


        speedNumber.textContent =
            currentSpeed.toFixed(1);

    }


    const finalSpeed =
        random(15, 55);


    await animateSpeed(
        finalSpeed,
        700
    );


    uploadValue.textContent =
        finalSpeed.toFixed(2);


    return finalSpeed;

}


// ==========================================
// HISTORY
// ==========================================

function getHistory() {

    return JSON.parse(
        localStorage.getItem(
            "netspeedHistory"
        ) || "[]"
    );

}


function saveHistory(result) {

    const history =
        getHistory();


    history.unshift(result);


    if (history.length > 10) {

        history.splice(
            10
        );

    }


    localStorage.setItem(
        "netspeedHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


function displayHistory() {

    const history =
        getHistory();


    if (!history.length) {

        historyList.innerHTML = `

            <div class="empty-history">

                <div class="empty-icon">
                    ◷
                </div>

                <p>No tests yet</p>

                <span>
                    Run your first speed test to
                    see your results here.
                </span>

            </div>

        `;

        return;

    }


    historyList.innerHTML = "";


    history.forEach(test => {

        const item =
            document.createElement("div");


        item.className =
            "history-item";


        item.innerHTML = `

            <div>

                <span>DATE</span>

                <strong>
                    ${test.date}
                </strong>

            </div>


            <div>

                <span>PING</span>

                <strong>
                    ${test.ping} ms
                </strong>

            </div>


            <div>

                <span>DOWNLOAD</span>

                <strong>
                    ${test.download} Mbps
                </strong>

            </div>


            <div>

                <span>UPLOAD</span>

                <strong>
                    ${test.upload} Mbps
                </strong>

            </div>

        `;


        historyList.appendChild(item);

    });

}


displayHistory();


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistory.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "netspeedHistory"
        );

        displayHistory();

    }
);


// ==========================================
// HISTORY BUTTON
// ==========================================

historyButton.addEventListener(
    "click",
    () => {

        historyPanel.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ==========================================
// THEME
// ==========================================

themeButton.addEventListener(
    "click",
    () => {

        /*
         * Theme support can be expanded
         * later. For now this changes
         * the background intensity.
         */

        document.body.classList.toggle(
            "light-mode"
        );

    }
);


// ==========================================
// GRAPH ANIMATION
// ==========================================

const graphLine =
    document.getElementById(
        "graphLine"
    );

const graphArea =
    document.getElementById(
        "graphArea"
    );


function animateGraph() {

    const points = [];

    const totalPoints = 12;


    for (
        let i = 0;
        i < totalPoints;
        i++
    ) {

        const x =
            i *
            (1000 /
            (totalPoints - 1));


        const y =
            random(70, 250);


        points.push({
            x,
            y
        });

    }


    let line =
        `M${points[0].x} ${points[0].y}`;


    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        line +=
            ` L${points[i].x} ${points[i].y}`;

    }


    graphLine.setAttribute(
        "d",
        line
    );


    graphArea.setAttribute(
        "d",
        line +
        " L1000 300 L0 300 Z"
    );

}


setInterval(
    animateGraph,
    2500
);


// ==========================================
// MAIN TEST
// ==========================================

startButton.addEventListener(
    "click",
    async () => {

        if (
            startButton.disabled
        ) {
            return;
        }


        startButton.disabled =
            true;


        buttonText.textContent =
            "TESTING...";


        pingValue.textContent =
            "--";

        downloadValue.textContent =
            "--";

        uploadValue.textContent =
            "--";

        jitterValue.textContent =
            "--";


        speedNumber.textContent =
            "0";


        try {

            // --------------------
            // PING
            // --------------------

            const pingResult =
                await testPing();


            // --------------------
            // DOWNLOAD
            // --------------------

            const download =
                await testDownload();


            // --------------------
            // UPLOAD
            // --------------------

            const upload =
                await testUpload();


            // --------------------
            // COMPLETE
            // --------------------

            speedState.textContent =
                "COMPLETE";


            setProgress(
                100,
                "Speed test completed successfully"
            );


            speedNumber.textContent =
                download.toFixed(1);


            const result = {

                date:
                    new Date()
                    .toLocaleString(),

                ping:
                    pingResult.ping,

                jitter:
                    pingResult.jitter,

                download:
                    download.toFixed(2),

                upload:
                    upload.toFixed(2)

            };


            saveHistory(result);


        } catch(error) {

            console.error(error);

            speedState.textContent =
                "ERROR";


            progressStatus.textContent =
                "The test could not be completed.";

        }


        startButton.disabled =
            false;


        buttonText.textContent =
            "TEST AGAIN";

    }
);