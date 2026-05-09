const baggageRecords = {
    BG1024: {
        id: "BG1024",
        flight: "AI-202",
        passenger: "A. Sharma",
        status: "In Transit",
        location: "Dubai Transfer Hub",
        carousel: "Belt 07",
        eta: "12:45 PM",
        delay: 12,
        transfers: 1,
        scanGap: 8,
        routeRisk: 10,
        lastSeen: "2 min ago",
        timelineIndex: 3
    },
    BG2048: {
        id: "BG2048",
        flight: "EK-404",
        passenger: "M. Khan",
        status: "Loaded",
        location: "Hyderabad Airport Gate 22",
        carousel: "Belt 02",
        eta: "03:10 PM",
        delay: 4,
        transfers: 0,
        scanGap: 3,
        routeRisk: 5,
        lastSeen: "Just now",
        timelineIndex: 2
    },
    BG4096: {
        id: "BG4096",
        flight: "QR-778",
        passenger: "L. Patel",
        status: "Delayed",
        location: "Security exception bay",
        carousel: "Pending",
        eta: "05:20 PM",
        delay: 48,
        transfers: 2,
        scanGap: 33,
        routeRisk: 24,
        lastSeen: "28 min ago",
        timelineIndex: 1
    },
    BG8192: {
        id: "BG8192",
        flight: "BA-118",
        passenger: "S. Williams",
        status: "At Carousel",
        location: "London Heathrow Terminal 5",
        carousel: "Belt 11",
        eta: "Arrived",
        delay: 0,
        transfers: 1,
        scanGap: 4,
        routeRisk: 8,
        lastSeen: "1 min ago",
        timelineIndex: 5
    }
};

const journeyStages = [
    { label: "Check-In", detail: "Bag tag printed and accepted by airline desk.", icon: "fa-ticket" },
    { label: "Security Scan", detail: "X-ray and screening checks completed or queued.", icon: "fa-shield-halved" },
    { label: "Loaded", detail: "Loaded into the aircraft container or ULD.", icon: "fa-boxes-stacked" },
    { label: "In Transit", detail: "Moving through flight or transfer hub operations.", icon: "fa-plane" },
    { label: "Arrived", detail: "Received at destination baggage handling area.", icon: "fa-location-dot" },
    { label: "At Carousel", detail: "Released to passenger collection belt.", icon: "fa-suitcase-rolling" }
];

const statusStageIndex = {
    "Checked In": 0,
    "Security Scan": 1,
    Loaded: 2,
    "In Transit": 3,
    Arrived: 4,
    Delayed: 1,
    "At Carousel": 5
};

const state = {
    selectedBagId: "BG1024"
};

const elements = {
    navToggle: document.querySelector("#navToggle"),
    navLinks: document.querySelector("#navLinks"),
    bagInput: document.querySelector("#bagInput"),
    trackBtn: document.querySelector("#trackBtn"),
    resultCard: document.querySelector("#resultCard"),
    trackedCount: document.querySelector("#trackedCount"),
    safeRate: document.querySelector("#safeRate"),
    avgDelay: document.querySelector("#avgDelay"),
    radarRisk: document.querySelector("#radarRisk"),
    riskScore: document.querySelector("#riskScore"),
    riskLevel: document.querySelector("#riskLevel"),
    riskReason: document.querySelector("#riskReason"),
    meterRing: document.querySelector("#meterRing"),
    recommendations: document.querySelector("#recommendations"),
    timelineList: document.querySelector("#timelineList"),
    barChart: document.querySelector("#barChart"),
    alertList: document.querySelector("#alertList"),
    adminForm: document.querySelector("#adminForm"),
    adminBag: document.querySelector("#adminBag"),
    adminStatus: document.querySelector("#adminStatus"),
    adminLocation: document.querySelector("#adminLocation"),
    adminDelay: document.querySelector("#adminDelay"),
    adminMessage: document.querySelector("#adminMessage"),
    lostForm: document.querySelector("#lostForm"),
    passengerEmail: document.querySelector("#passengerEmail"),
    lostBag: document.querySelector("#lostBag"),
    lostNotes: document.querySelector("#lostNotes"),
    lostMessage: document.querySelector("#lostMessage")
};

function calculateRiskScore(record) {
    const delayScore = Math.min(record.delay * 1.1, 45);
    const transferScore = Math.min(record.transfers * 12, 24);
    const scanScore = Math.min(record.scanGap * 0.7, 21);
    return Math.round(Math.min(delayScore + transferScore + scanScore + record.routeRisk, 100));
}

function getRiskMeta(score) {
    if (score >= 70) {
        return { label: "High Risk", key: "high", color: "var(--red)", short: "HIGH" };
    }

    if (score >= 40) {
        return { label: "Medium Risk", key: "medium", color: "var(--amber)", short: "MEDIUM" };
    }

    return { label: "Low Risk", key: "low", color: "var(--green)", short: "LOW" };
}

function getRecommendations(record, score) {
    const meta = getRiskMeta(score);

    if (meta.key === "high") {
        return [
            "Create a priority handling alert for the baggage operations desk.",
            "Notify the passenger with the latest scan location and support counter details.",
            "Check exception bay, transfer container, and manual security hold status."
        ];
    }

    if (meta.key === "medium") {
        return [
            "Keep the passenger near the assigned carousel until the next scan update.",
            "Monitor transfer connection time and prepare a delay notification if ETA slips.",
            "Verify the last known location with ground handling staff."
        ];
    }

    return [
        "Baggage movement is normal and no escalation is required.",
        "Send standard arrival notification when carousel allocation is confirmed.",
        "Continue automated checkpoint scanning and ETA refresh."
    ];
}

function findRecord(query) {
    const normalized = query.trim().toUpperCase();

    if (baggageRecords[normalized]) {
        return baggageRecords[normalized];
    }

    return Object.values(baggageRecords).find((record) => record.flight.toUpperCase() === normalized);
}

function renderStatus(record) {
    const score = calculateRiskScore(record);
    const meta = getRiskMeta(score);

    elements.resultCard.innerHTML = `
        <div class="status-header">
            <div>
                <p class="status-meta">Current Baggage Status</p>
                <h2>${record.status}</h2>
            </div>
            <span class="status-pill ${meta.key}">${meta.short}</span>
        </div>
        <div class="status-grid">
            <p><span>Bag ID</span>${record.id}</p>
            <p><span>Flight</span>${record.flight}</p>
            <p><span>Location</span>${record.location}</p>
            <p><span>ETA / Carousel</span>${record.eta} • ${record.carousel}</p>
            <p><span>Passenger</span>${record.passenger}</p>
            <p><span>Last Scan</span>${record.lastSeen}</p>
        </div>
    `;

    elements.radarRisk.textContent = meta.short;
    elements.radarRisk.className = meta.key;
}

function renderRisk(record) {
    const score = calculateRiskScore(record);
    const meta = getRiskMeta(score);
    const angle = Math.round(score * 3.6);

    elements.riskScore.textContent = score;
    elements.riskLevel.textContent = meta.label;
    elements.riskReason.textContent = `Based on ${record.delay} minutes delay, ${record.transfers} transfer(s), ${record.scanGap} minutes since scan, and route complexity.`;
    elements.meterRing.style.background = `conic-gradient(${meta.color} ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`;

    elements.recommendations.innerHTML = getRecommendations(record, score)
        .map((item) => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`)
        .join("");
}

function renderTimeline(record) {
    elements.timelineList.innerHTML = journeyStages
        .map((stage, index) => {
            const isDone = index < record.timelineIndex;
            const isActive = index === record.timelineIndex;
            const status = isDone ? "Completed" : isActive ? "Current stage" : "Pending";

            return `
                <article class="timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}">
                    <span class="step-icon"><i class="fa-solid ${stage.icon}"></i></span>
                    <div>
                        <h4>${stage.label}</h4>
                        <p>${stage.detail}</p>
                    </div>
                    <strong>${status}</strong>
                </article>
            `;
        })
        .join("");
}

function renderMetrics() {
    const records = Object.values(baggageRecords);
    const lowRiskCount = records.filter((record) => calculateRiskScore(record) < 40).length;
    const delayAverage = records.reduce((sum, record) => sum + record.delay, 0) / records.length;

    elements.trackedCount.textContent = records.length;
    elements.safeRate.textContent = `${Math.round((lowRiskCount / records.length) * 100)}%`;
    elements.avgDelay.textContent = `${Math.round(delayAverage)}m`;
}

function renderAnalytics() {
    const counts = Object.values(baggageRecords).reduce((summary, record) => {
        summary[record.status] = (summary[record.status] || 0) + 1;
        return summary;
    }, {});

    const total = Object.values(baggageRecords).length;
    elements.barChart.innerHTML = Object.entries(counts)
        .map(([status, count]) => {
            const percentage = Math.round((count / total) * 100);
            return `
                <div class="bar-row">
                    <div class="bar-label"><span>${status}</span><strong>${count} bag(s)</strong></div>
                    <div class="bar-track"><div class="bar-fill" style="width:${percentage}%"></div></div>
                </div>
            `;
        })
        .join("");
}

function renderAlerts() {
    const alerts = Object.values(baggageRecords)
        .filter((record) => record.delay > 10 || calculateRiskScore(record) >= 40)
        .map((record) => {
            const score = calculateRiskScore(record);
            const meta = getRiskMeta(score);
            return `
                <article class="alert-item">
                    <i class="fa-solid ${meta.key === "high" ? "fa-triangle-exclamation" : "fa-clock"}"></i>
                    <div>
                        <strong>${record.id} • ${record.flight}</strong>
                        <p>${meta.label}: ${record.status} at ${record.location}. Delay ${record.delay}m.</p>
                    </div>
                </article>
            `;
        });

    elements.alertList.innerHTML = alerts.length ? alerts.join("") : `<p class="status-meta">No active baggage alerts.</p>`;
}

function renderAdminOptions() {
    elements.adminBag.innerHTML = Object.keys(baggageRecords)
        .map((bagId) => `<option value="${bagId}">${bagId}</option>`)
        .join("");
}

function selectBag(record) {
    state.selectedBagId = record.id;
    elements.bagInput.value = record.id;
    renderStatus(record);
    renderRisk(record);
    renderTimeline(record);
    renderMetrics();
    renderAnalytics();
    renderAlerts();
    elements.adminBag.value = record.id;
    elements.adminStatus.value = record.status;
    elements.adminLocation.value = record.location;
    elements.adminDelay.value = record.delay;
}

function handleSearch() {
    const record = findRecord(elements.bagInput.value);

    if (!record) {
        elements.resultCard.innerHTML = `
            <div class="status-header">
                <div>
                    <p class="status-meta">No match found</p>
                    <h2>Baggage Not Found</h2>
                </div>
                <span class="status-pill high">CHECK ID</span>
            </div>
            <p class="status-meta" style="margin-top:18px">Use a valid sample ID such as BG1024, BG2048, BG4096, or BG8192.</p>
        `;
        return;
    }

    selectBag(record);
    elements.resultCard.animate(
        [
            { transform: "translateY(18px)", opacity: 0.45 },
            { transform: "translateY(0)", opacity: 1 }
        ],
        { duration: 380, easing: "ease-out" }
    );
}

function handleAdminSubmit(event) {
    event.preventDefault();
    const record = baggageRecords[elements.adminBag.value];
    record.status = elements.adminStatus.value;
    record.location = elements.adminLocation.value || record.location;
    record.delay = Number(elements.adminDelay.value) || 0;
    record.lastSeen = "Updated now";
    record.timelineIndex = statusStageIndex[record.status] ?? 3;

    if (record.status === "Delayed") {
        record.scanGap = Math.max(record.scanGap, 25);
    } else if (record.delay < 10) {
        record.scanGap = Math.min(record.scanGap, 8);
    }

    selectBag(record);
    elements.adminMessage.textContent = `Saved ${record.id}: ${record.status} at ${record.location}. Mock notification queued.`;
}

function handleLostSubmit(event) {
    event.preventDefault();
    const ticketId = `CLM-${Date.now().toString().slice(-6)}`;
    elements.lostMessage.textContent = `Ticket ${ticketId} created for ${elements.lostBag.value.toUpperCase()}. Confirmation sent to ${elements.passengerEmail.value}.`;
    elements.lostForm.reset();
}

function bindEvents() {
    elements.trackBtn.addEventListener("click", handleSearch);
    elements.bagInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    document.querySelectorAll("[data-bag]").forEach((button) => {
        button.addEventListener("click", () => {
            elements.bagInput.value = button.dataset.bag;
            handleSearch();
        });
    });

    elements.navToggle.addEventListener("click", () => {
        const isOpen = elements.navLinks.classList.toggle("open");
        elements.navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    elements.navLinks.addEventListener("click", (event) => {
        if (event.target.matches("a")) {
            elements.navLinks.classList.remove("open");
            elements.navToggle.setAttribute("aria-expanded", "false");
        }
    });

    elements.adminForm.addEventListener("submit", handleAdminSubmit);
    elements.lostForm.addEventListener("submit", handleLostSubmit);
}

function init() {
    renderAdminOptions();
    bindEvents();
    selectBag(baggageRecords[state.selectedBagId]);
}

init();
