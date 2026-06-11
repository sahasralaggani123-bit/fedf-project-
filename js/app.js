const baggageRecords = {
    BG1024: { id: "BG1024", flight: "AI-202", passenger: "A. Sharma", status: "In Transit", location: "Dubai Transfer Hub", carousel: "Belt 07", eta: "12:45 PM", delay: 12, transfers: 1, scanGap: 8, routeRisk: 10, lastSeen: "2 min ago", timelineIndex: 3 },
    BG2048: { id: "BG2048", flight: "EK-404", passenger: "M. Khan", status: "Loaded", location: "Hyderabad Airport Gate 22", carousel: "Belt 02", eta: "03:10 PM", delay: 4, transfers: 0, scanGap: 3, routeRisk: 5, lastSeen: "Just now", timelineIndex: 2 },
    BG4096: { id: "BG4096", flight: "QR-778", passenger: "L. Patel", status: "Delayed", location: "Security exception bay", carousel: "Pending", eta: "05:20 PM", delay: 48, transfers: 2, scanGap: 33, routeRisk: 24, lastSeen: "28 min ago", timelineIndex: 1 },
    BG8192: { id: "BG8192", flight: "BA-118", passenger: "S. Williams", status: "At Carousel", location: "London Heathrow Terminal 5", carousel: "Belt 11", eta: "Arrived", delay: 0, transfers: 1, scanGap: 4, routeRisk: 8, lastSeen: "1 min ago", timelineIndex: 5 }
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

const state = { selectedBagId: "BG1024" };
const $ = (selector) => document.querySelector(selector);

const elements = {
    navToggle: $("#navToggle"),
    navLinks: $("#navLinks"),
    bagInput: $("#bagInput"),
    trackBtn: $("#trackBtn"),
    resultCard: $("#resultCard"),
    trackedCount: $("#trackedCount"),
    safeRate: $("#safeRate"),
    avgDelay: $("#avgDelay"),
    radarRisk: $("#radarRisk"),
    riskScore: $("#riskScore"),
    riskLevel: $("#riskLevel"),
    riskReason: $("#riskReason"),
    meterRing: $("#meterRing"),
    recommendations: $("#recommendations"),
    timelineList: $("#timelineList"),
    barChart: $("#barChart"),
    alertList: $("#alertList"),
    adminForm: $("#adminForm"),
    adminBag: $("#adminBag"),
    adminStatus: $("#adminStatus"),
    adminLocation: $("#adminLocation"),
    adminDelay: $("#adminDelay"),
    adminMessage: $("#adminMessage"),
    lostForm: $("#lostForm"),
    passengerEmail: $("#passengerEmail"),
    lostBag: $("#lostBag"),
    lostMessage: $("#lostMessage")
};

function calculateRiskScore(record) {
    const delayScore = Math.min(record.delay * 1.1, 45);
    const transferScore = Math.min(record.transfers * 12, 24);
    const scanScore = Math.min(record.scanGap * 0.7, 21);
    return Math.round(Math.min(delayScore + transferScore + scanScore + record.routeRisk, 100));
}

function getRiskMeta(score) {
    if (score >= 70) return { label: "High Risk", key: "high", color: "var(--red)", short: "HIGH" };
    if (score >= 40) return { label: "Medium Risk", key: "medium", color: "var(--amber)", short: "MEDIUM" };
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
    if (baggageRecords[normalized]) return baggageRecords[normalized];
    return Object.values(baggageRecords).find((record) => record.flight.toUpperCase() === normalized);
}

function renderStatus(record) {
    if (!elements.resultCard) return;

    const score = calculateRiskScore(record);
    const meta = getRiskMeta(score);
    elements.resultCard.innerHTML = `
        <div class="status-header">
            <div><p class="status-meta">Current Baggage Status</p><h2>${record.status}</h2></div>
            <span class="status-pill ${meta.key}">${meta.short}</span>
        </div>
        <div class="status-grid">
            <p><span>Bag ID</span>${record.id}</p><p><span>Flight</span>${record.flight}</p>
            <p><span>Location</span>${record.location}</p><p><span>ETA / Carousel</span>${record.eta} • ${record.carousel}</p>
            <p><span>Passenger</span>${record.passenger}</p><p><span>Last Scan</span>${record.lastSeen}</p>
        </div>`;
}

function renderRadar(record) {
    if (!elements.radarRisk) return;
    const meta = getRiskMeta(calculateRiskScore(record));
    elements.radarRisk.textContent = meta.short;
    elements.radarRisk.className = meta.key;
}

function renderRisk(record) {
    if (!elements.riskScore && !elements.recommendations) return;

    const score = calculateRiskScore(record);
    const meta = getRiskMeta(score);
    const angle = Math.round(score * 3.6);

    if (elements.riskScore) elements.riskScore.textContent = score;
    if (elements.riskLevel) elements.riskLevel.textContent = meta.label;
    if (elements.riskReason) elements.riskReason.textContent = `Based on ${record.delay} minutes delay, ${record.transfers} transfer(s), ${record.scanGap} minutes since scan, and route complexity.`;
    if (elements.meterRing) elements.meterRing.style.background = `conic-gradient(${meta.color} ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`;
    if (elements.recommendations) {
        elements.recommendations.innerHTML = getRecommendations(record, score).map((item) => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`).join("");
    }
}

function renderTimeline(record) {
    if (!elements.timelineList) return;

    elements.timelineList.innerHTML = journeyStages.map((stage, index) => {
        const isDone = index < record.timelineIndex;
        const isActive = index === record.timelineIndex;
        const status = isDone ? "Completed" : isActive ? "Current stage" : "Pending";
        return `<article class="timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}">
            <span class="step-icon"><i class="fa-solid ${stage.icon}"></i></span>
            <div><h4>${stage.label}</h4><p>${stage.detail}</p></div><strong>${status}</strong>
        </article>`;
    }).join("");
}

function renderMetrics() {
    if (!elements.trackedCount && !elements.safeRate && !elements.avgDelay) return;

    const records = Object.values(baggageRecords);
    const lowRiskCount = records.filter((record) => calculateRiskScore(record) < 40).length;
    const delayAverage = records.reduce((sum, record) => sum + record.delay, 0) / records.length;

    if (elements.trackedCount) elements.trackedCount.textContent = records.length;
    if (elements.safeRate) elements.safeRate.textContent = `${Math.round((lowRiskCount / records.length) * 100)}%`;
    if (elements.avgDelay) elements.avgDelay.textContent = `${Math.round(delayAverage)}m`;
}

function renderAnalytics() {
    if (!elements.barChart) return;

    const counts = Object.values(baggageRecords).reduce((summary, record) => {
        summary[record.status] = (summary[record.status] || 0) + 1;
        return summary;
    }, {});
    const total = Object.values(baggageRecords).length;

    elements.barChart.innerHTML = Object.entries(counts).map(([status, count]) => {
        const percentage = Math.round((count / total) * 100);
        return `<div class="bar-row"><div class="bar-label"><span>${status}</span><strong>${count} bag(s)</strong></div><div class="bar-track"><div class="bar-fill" style="width:${percentage}%"></div></div></div>`;
    }).join("");
}

function renderAlerts() {
    if (!elements.alertList) return;

    const alerts = Object.values(baggageRecords).filter((record) => record.delay > 10 || calculateRiskScore(record) >= 40).map((record) => {
        const meta = getRiskMeta(calculateRiskScore(record));
        return `<article class="alert-item"><i class="fa-solid ${meta.key === "high" ? "fa-triangle-exclamation" : "fa-clock"}"></i><div><strong>${record.id} • ${record.flight}</strong><p>${meta.label}: ${record.status} at ${record.location}. Delay ${record.delay}m.</p></div></article>`;
    });

    elements.alertList.innerHTML = alerts.length ? alerts.join("") : `<p class="status-meta">No active baggage alerts.</p>`;
}

function renderAdminOptions() {
    if (!elements.adminBag) return;
    elements.adminBag.innerHTML = Object.keys(baggageRecords).map((bagId) => `<option value="${bagId}">${bagId}</option>`).join("");
}

function hydrateAdminForm(record) {
    if (elements.adminBag) elements.adminBag.value = record.id;
    if (elements.adminStatus) elements.adminStatus.value = record.status;
    if (elements.adminLocation) elements.adminLocation.value = record.location;
    if (elements.adminDelay) elements.adminDelay.value = record.delay;
}

function selectBag(record) {
    state.selectedBagId = record.id;
    if (elements.bagInput) elements.bagInput.value = record.id;
    renderStatus(record);
    renderRadar(record);
    renderRisk(record);
    renderTimeline(record);
    renderMetrics();
    renderAnalytics();
    renderAlerts();
    hydrateAdminForm(record);
}

function renderNotFound() {
    if (!elements.resultCard) return;
    elements.resultCard.innerHTML = `<div class="status-header"><div><p class="status-meta">No match found</p><h2>Baggage Not Found</h2></div><span class="status-pill high">CHECK ID</span></div><p class="status-meta" style="margin-top:18px">Use a valid sample ID such as BG1024, BG2048, BG4096, or BG8192.</p>`;
}

function handleSearch() {
    if (!elements.bagInput) return;
    const record = findRecord(elements.bagInput.value);
    if (!record) {
        renderNotFound();
        return;
    }

    selectBag(record);
    if (elements.resultCard) {
        elements.resultCard.animate([{ transform: "translateY(18px)", opacity: 0.45 }, { transform: "translateY(0)", opacity: 1 }], { duration: 380, easing: "ease-out" });
    }
}

function handleAdminSubmit(event) {
    event.preventDefault();
    const record = baggageRecords[elements.adminBag.value];
    record.status = elements.adminStatus.value;
    record.location = elements.adminLocation.value || record.location;
    record.delay = Number(elements.adminDelay.value) || 0;
    record.lastSeen = "Updated now";
    record.timelineIndex = statusStageIndex[record.status] ?? 3;

    if (record.status === "Delayed") record.scanGap = Math.max(record.scanGap, 25);
    else if (record.delay < 10) record.scanGap = Math.min(record.scanGap, 8);

    selectBag(record);
    if (elements.adminMessage) elements.adminMessage.textContent = `Saved ${record.id}: ${record.status} at ${record.location}. Mock notification queued.`;
}

function handleLostSubmit(event) {
    event.preventDefault();
    const ticketId = `CLM-${Date.now().toString().slice(-6)}`;
    if (elements.lostMessage) elements.lostMessage.textContent = `Ticket ${ticketId} created for ${elements.lostBag.value.toUpperCase()}. Confirmation sent to ${elements.passengerEmail.value}.`;
    elements.lostForm.reset();
}

function bindEvents() {
    if (elements.trackBtn) elements.trackBtn.addEventListener("click", handleSearch);
    if (elements.bagInput) {
        elements.bagInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") handleSearch();
        });
    }

    document.querySelectorAll("[data-bag]").forEach((button) => {
        button.addEventListener("click", () => {
            if (elements.bagInput) elements.bagInput.value = button.dataset.bag;
            handleSearch();
        });
    });

    if (elements.navToggle && elements.navLinks) {
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
    }

    if (elements.adminForm) elements.adminForm.addEventListener("submit", handleAdminSubmit);
    if (elements.lostForm) elements.lostForm.addEventListener("submit", handleLostSubmit);
}

function init() {
    renderAdminOptions();
    bindEvents();
    selectBag(baggageRecords[state.selectedBagId]);
}

init();
