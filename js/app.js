(function () {
    const { useMemo, useState } = React;
    const h = React.createElement;

    const initialBaggageRecords = {
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

    const pages = {
        home: { title: "Professional baggage tracking and risk analysis for airlines.", eyebrow: "Predictive airline baggage intelligence", icon: "fa-satellite-dish" },
        dashboard: { title: "Real-time baggage control overview.", eyebrow: "Operations dashboard", icon: "fa-gauge-high", copy: "Track the health of baggage operations with KPIs, live status, timeline, risk score, analytics and alerts in one dashboard." },
        tracking: { title: "Search baggage by ID or flight.", eyebrow: "Live baggage tracking", icon: "fa-location-crosshairs", copy: "Use sample IDs BG1024, BG2048, BG4096, BG8192 or flight AI-202 to view live status and journey checkpoints." },
        risk: { title: "Predict delay and mishandling risk.", eyebrow: "Risk analyser", icon: "fa-shield-halved", copy: "The score combines delay minutes, transfer count, scan gaps and route complexity into a passenger-ready action plan." },
        analytics: { title: "Baggage performance insights.", eyebrow: "Analytics module", icon: "fa-chart-line", copy: "Review monitored bags, safe handling rate, average delay, current distribution and active exception load." },
        alerts: { title: "Passenger and operations alerts.", eyebrow: "Alerts module", icon: "fa-bell", copy: "See baggage delay warnings and create a mock passenger support ticket when a baggage issue needs escalation." },
        admin: { title: "Update baggage operations data.", eyebrow: "Admin module", icon: "fa-user-gear", copy: "Simulate ground staff updates for status, location and delay minutes. Dashboard modules refresh immediately." },
        lost: { title: "Create a passenger support claim.", eyebrow: "Lost baggage report", icon: "fa-file-circle-exclamation", copy: "A dedicated page for collecting passenger contact information, baggage ID and issue notes." }
    };

    const moduleCards = [
        { page: "dashboard", icon: "fa-gauge-high", title: "Dashboard", text: "KPI cards, risk summary, analytics and recent alerts." },
        { page: "tracking", icon: "fa-location-crosshairs", title: "Live Tracking", text: "Search baggage IDs or flights and view current bag details." },
        { page: "risk", icon: "fa-shield-halved", title: "Risk AI", text: "Calculate risk score and passenger guidance from operations signals." },
        { page: "analytics", icon: "fa-chart-line", title: "Analytics", text: "Status distribution and operational baggage performance." },
        { page: "alerts", icon: "fa-bell", title: "Alerts", text: "Delay, exception, and high-risk baggage notifications." },
        { page: "admin", icon: "fa-user-gear", title: "Admin", text: "Update baggage status and simulate operations changes." }
    ];

    const navItems = [
        { page: "dashboard", label: "Dashboard" },
        { page: "tracking", label: "Tracking" },
        { page: "risk", label: "Risk AI" },
        { page: "analytics", label: "Analytics" },
        { page: "admin", label: "Admin" }
    ];

    function pageHref(page) {
        const inPagesDirectory = window.location.pathname.includes("/pages/");
        const prefix = inPagesDirectory ? "" : "pages/";
        const homePrefix = inPagesDirectory ? "../" : "";
        const routes = {
            home: `${homePrefix}index.html`,
            dashboard: `${prefix}dashboard.html`,
            tracking: `${prefix}tracking.html`,
            risk: `${prefix}risk.html`,
            analytics: `${prefix}analytics.html`,
            alerts: `${prefix}alerts.html`,
            admin: `${prefix}admin.html`,
            lost: `${prefix}lost-report.html`
        };
        return routes[page];
    }

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

    function getRecommendations(score) {
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

    function findRecord(records, query) {
        const normalized = query.trim().toUpperCase();
        if (records[normalized]) return records[normalized];
        return Object.values(records).find((record) => record.flight.toUpperCase() === normalized);
    }

    function App() {
        const currentPage = document.body.dataset.page || "home";
        const [records, setRecords] = useState(initialBaggageRecords);
        const [selectedBagId, setSelectedBagId] = useState("BG1024");
        const [query, setQuery] = useState("BG1024");
        const [searchError, setSearchError] = useState("");
        const [adminMessage, setAdminMessage] = useState("");
        const [claimMessage, setClaimMessage] = useState("");
        const selectedRecord = records[selectedBagId];
        const metrics = useMemo(() => getMetrics(records), [records]);

        function selectRecord(record) {
            setSelectedBagId(record.id);
            setQuery(record.id);
            setSearchError("");
        }

        function handleSearch(event) {
            event.preventDefault();
            const record = findRecord(records, query);
            if (!record) {
                setSearchError("Use a valid sample ID such as BG1024, BG2048, BG4096, BG8192, or flight AI-202.");
                return;
            }
            selectRecord(record);
        }

        function handleAdminUpdate(formData) {
            const record = records[formData.id];
            const nextRecord = {
                ...record,
                status: formData.status,
                location: formData.location || record.location,
                delay: Number(formData.delay) || 0,
                lastSeen: "Updated now",
                timelineIndex: statusStageIndex[formData.status] ?? 3
            };

            if (nextRecord.status === "Delayed") nextRecord.scanGap = Math.max(nextRecord.scanGap, 25);
            else if (nextRecord.delay < 10) nextRecord.scanGap = Math.min(nextRecord.scanGap, 8);

            setRecords({ ...records, [nextRecord.id]: nextRecord });
            setSelectedBagId(nextRecord.id);
            setQuery(nextRecord.id);
            setAdminMessage(`Saved ${nextRecord.id}: ${nextRecord.status} at ${nextRecord.location}. Mock notification queued.`);
        }

        function handleClaimSubmit(formData) {
            const ticketId = `CLM-${Date.now().toString().slice(-6)}`;
            setClaimMessage(`Ticket ${ticketId} created for ${formData.bagId.toUpperCase()}. Confirmation sent to ${formData.email}.`);
        }

        return h(React.Fragment, null,
            h(Background),
            h(Navbar, { currentPage }),
            currentPage === "home"
                ? h(HomePage, { metrics, record: selectedRecord })
                : h(ModulePage, { currentPage, records, selectedRecord, metrics, query, setQuery, searchError, handleSearch, selectRecord, handleAdminUpdate, adminMessage, handleClaimSubmit, claimMessage }),
            h(Footer, { currentPage })
        );
    }

    function Background() {
        return h(React.Fragment, null,
            h("div", { className: "orb orb-one", "aria-hidden": "true" }),
            h("div", { className: "orb orb-two", "aria-hidden": "true" }),
            h("div", { className: "noise", "aria-hidden": "true" })
        );
    }

    function Navbar({ currentPage }) {
        const [isOpen, setIsOpen] = useState(false);
        return h("nav", { className: "navbar", "aria-label": "Primary navigation" },
            h("a", { className: "logo", href: pageHref("home"), "aria-label": "SmartTrack home" },
                h("span", { className: "logo-mark" }, h("i", { className: "fa-solid fa-plane-departure" })),
                h("span", null, "SmartTrack")
            ),
            h("button", { className: "nav-toggle", type: "button", "aria-label": "Open menu", "aria-expanded": String(isOpen), onClick: () => setIsOpen(!isOpen) }, h("span"), h("span"), h("span")),
            h("ul", { className: `nav-links ${isOpen ? "open" : ""}`, id: "navLinks" },
                navItems.map((item) => h("li", { key: item.page }, h("a", { className: currentPage === item.page ? "active" : "", href: pageHref(item.page) }, item.label)))
            )
        );
    }

    function HomePage({ metrics, record }) {
        return h(React.Fragment, null,
            h("header", { className: "site-header compact-site", id: "home" },
                h("section", { className: "hero section-shell home-hero" },
                    h("div", { className: "hero-content reveal" },
                        h(Eyebrow, { icon: pages.home.icon, text: pages.home.eyebrow }),
                        h("h1", null, pages.home.title),
                        h("p", { className: "hero-copy" }, "Monitor baggage movement, predict mishandling risk, alert passengers, and support operations teams with a clean React-powered control tower."),
                        h("div", { className: "home-actions" },
                            h("a", { className: "primary-btn", href: pageHref("tracking") }, h("i", { className: "fa-solid fa-magnifying-glass-location" }), " Track a Bag"),
                            h("a", { className: "secondary-btn", href: pageHref("dashboard") }, h("i", { className: "fa-solid fa-chart-simple" }), " View Dashboard")
                        ),
                        h(MetricStrip, { metrics })
                    ),
                    h("div", { className: "hero-visual reveal delay-1", "aria-label": "Live baggage operations dashboard preview" },
                        h(RadarCard, { record }),
                        h(StatusCard, { record })
                    )
                )
            ),
            h("main", null,
                h("section", { className: "section-shell module-overview" },
                    h("div", { className: "section-heading reveal" },
                        h(Eyebrow, { icon: "fa-layer-group", text: "Project modules" }),
                        h("h2", null, "Separated React pages for a cleaner, more professional application flow.")
                    ),
                    h("div", { className: "feature-grid reveal delay-1" }, moduleCards.map((card) => h(ModuleCard, { key: card.page, card })))
                )
            )
        );
    }

    function ModulePage(props) {
        const meta = pages[props.currentPage];
        return h("main", { className: "page-main" },
            h(PageHeader, { meta, metrics: props.currentPage === "dashboard" || props.currentPage === "analytics" ? props.metrics : null }),
            h(PageBody, props)
        );
    }

    function PageHeader({ meta, metrics }) {
        return h("section", { className: "section-shell page-header" },
            h(Eyebrow, { icon: meta.icon, text: meta.eyebrow }),
            h("h1", null, meta.title),
            h("p", { className: "hero-copy" }, meta.copy),
            metrics ? h(MetricStrip, { metrics }) : null
        );
    }

    function PageBody(props) {
        const page = props.currentPage;
        if (page === "dashboard") return h(DashboardPage, props);
        if (page === "tracking") return h(TrackingPage, props);
        if (page === "risk") return h(RiskPage, props);
        if (page === "analytics") return h(AnalyticsPage, props);
        if (page === "alerts") return h(AlertsPage, props);
        if (page === "admin") return h(AdminPage, props);
        if (page === "lost") return h(LostReportPage, props);
        return null;
    }

    function DashboardPage({ records, selectedRecord }) {
        return h("section", { className: "section-shell dashboard-grid no-top-padding" },
            h(StatusCard, { record: selectedRecord }),
            h(RiskMeter, { record: selectedRecord }),
            h(Timeline, { record: selectedRecord }),
            h(AnalyticsPanel, { records }),
            h(AlertsPanel, { records })
        );
    }

    function TrackingPage({ records, selectedRecord, query, setQuery, searchError, handleSearch, selectRecord }) {
        return h("section", { className: "section-shell split-section no-top-padding" },
            h("div", { className: "tracking-workspace" },
                h(SearchPanel, { records, query, setQuery, searchError, handleSearch, selectRecord, buttonLabel: "Analyse Bag", icon: "fa-magnifying-glass-location" }),
                h(StatusCard, { record: selectedRecord })
            ),
            h(Timeline, { record: selectedRecord })
        );
    }

    function RiskPage({ records, selectedRecord, query, setQuery, searchError, handleSearch, selectRecord }) {
        return h("section", { className: "section-shell no-top-padding" },
            h(SearchPanel, { records, query, setQuery, searchError, handleSearch, selectRecord, buttonLabel: "Calculate Risk", icon: "fa-brain", compact: true }),
            h("div", { className: "risk-board page-risk-board" },
                h(RiskMeter, { record: selectedRecord }),
                h(Recommendations, { record: selectedRecord }),
                h(StatusCard, { record: selectedRecord })
            )
        );
    }

    function AnalyticsPage({ records }) {
        return h("section", { className: "section-shell split-section no-top-padding" },
            h(AnalyticsPanel, { records, title: "Status Distribution" }),
            h(AlertsPanel, { records, title: "Exception Summary", icon: "fa-triangle-exclamation" })
        );
    }

    function AlertsPage({ records, handleClaimSubmit, claimMessage }) {
        return h("section", { className: "section-shell split-section no-top-padding" },
            h(AlertsPanel, { records, title: "Active Alerts" }),
            h(LostForm, { onSubmit: handleClaimSubmit, message: claimMessage, title: "Generate support ticket" })
        );
    }

    function AdminPage({ records, selectedRecord, handleAdminUpdate, adminMessage }) {
        return h("section", { className: "section-shell split-section no-top-padding" },
            h(AdminForm, { records, selectedRecord, onSubmit: handleAdminUpdate, message: adminMessage }),
            h(StatusCard, { record: selectedRecord })
        );
    }

    function LostReportPage({ handleClaimSubmit, claimMessage }) {
        return h("section", { className: "section-shell no-top-padding narrow-section" },
            h(LostForm, { onSubmit: handleClaimSubmit, message: claimMessage })
        );
    }

    function SearchPanel({ records, query, setQuery, searchError, handleSearch, selectRecord, buttonLabel, icon, compact }) {
        return h("form", { className: `search-panel ${compact ? "compact-search" : ""}`, onSubmit: handleSearch },
            h("label", { htmlFor: "bagInput" }, "Baggage ID or flight number"),
            h("div", { className: "search-row" },
                h("input", { id: "bagInput", type: "text", value: query, placeholder: "Try BG1024 or AI-202", autoComplete: "off", onChange: (event) => setQuery(event.target.value) }),
                h("button", { className: "primary-btn", type: "submit" }, h("i", { className: `fa-solid ${icon}` }), ` ${buttonLabel}`)
            ),
            h("div", { className: "quick-chips", "aria-label": "Sample baggage IDs" }, Object.keys(records).map((bagId) => h("button", { type: "button", key: bagId, onClick: () => selectRecord(records[bagId]) }, bagId))),
            searchError ? h("p", { className: "form-note error-note", role: "alert" }, searchError) : null
        );
    }

    function StatusCard({ record }) {
        const score = calculateRiskScore(record);
        const meta = getRiskMeta(score);
        const fields = [
            ["Bag ID", record.id], ["Flight", record.flight], ["Location", record.location],
            ["ETA / Carousel", `${record.eta} • ${record.carousel}`], ["Passenger", record.passenger], ["Last Scan", record.lastSeen]
        ];
        return h("article", { className: "status-card glass-card", "aria-live": "polite" },
            h("div", { className: "status-header" },
                h("div", null, h("p", { className: "status-meta" }, "Current Baggage Status"), h("h2", null, record.status)),
                h("span", { className: `status-pill ${meta.key}` }, meta.short)
            ),
            h("div", { className: "status-grid" }, fields.map(([label, value]) => h("p", { key: label }, h("span", null, label), value)))
        );
    }

    function RadarCard({ record }) {
        const meta = getRiskMeta(calculateRiskScore(record));
        return h("div", { className: "radar-card glass-card" },
            h("div", { className: "radar-header" }, h("span", null, "Live risk radar"), h("strong", { className: meta.key }, meta.short)),
            h("div", { className: "radar-screen" },
                h("div", { className: "radar-sweep" }), h("span", { className: "radar-dot dot-a" }), h("span", { className: "radar-dot dot-b" }), h("span", { className: "radar-dot dot-c" }), h("i", { className: "fa-solid fa-suitcase-rolling suitcase-icon" })
            )
        );
    }

    function RiskMeter({ record }) {
        const score = calculateRiskScore(record);
        const meta = getRiskMeta(score);
        const angle = Math.round(score * 3.6);
        return h("article", { className: "risk-meter glass-card" },
            h("div", { className: "meter-ring", style: { background: `conic-gradient(${meta.color} ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)` } }, h("span", null, score), h("small", null, "/100")),
            h("h3", null, meta.label),
            h("p", { id: "riskReason" }, `Based on ${record.delay} minutes delay, ${record.transfers} transfer(s), ${record.scanGap} minutes since scan, and route complexity.`)
        );
    }

    function Recommendations({ record }) {
        const recommendations = getRecommendations(calculateRiskScore(record));
        return h("article", { className: "recommendation-card glass-card" },
            h("div", { className: "card-title" }, h("i", { className: "fa-solid fa-lightbulb" }), h("h3", null, "Passenger Guidance")),
            h("ul", null, recommendations.map((item) => h("li", { key: item }, h("i", { className: "fa-solid fa-circle-check" }), ` ${item}`)))
        );
    }

    function Timeline({ record }) {
        return h("div", { className: "timeline glass-card" }, journeyStages.map((stage, index) => {
            const isDone = index < record.timelineIndex;
            const isActive = index === record.timelineIndex;
            const status = isDone ? "Completed" : isActive ? "Current stage" : "Pending";
            return h("article", { className: `timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`, key: stage.label },
                h("span", { className: "step-icon" }, h("i", { className: `fa-solid ${stage.icon}` })),
                h("div", null, h("h4", null, stage.label), h("p", null, stage.detail)),
                h("strong", null, status)
            );
        }));
    }

    function AnalyticsPanel({ records, title = "Status Analytics" }) {
        const counts = Object.values(records).reduce((summary, record) => ({ ...summary, [record.status]: (summary[record.status] || 0) + 1 }), {});
        const total = Object.values(records).length;
        return h("div", { className: "analytics-panel glass-card" },
            h("div", { className: "card-title" }, h("i", { className: "fa-solid fa-chart-line" }), h("h3", null, title)),
            h("div", { className: "bar-chart" }, Object.entries(counts).map(([status, count]) => {
                const percentage = Math.round((count / total) * 100);
                return h("div", { className: "bar-row", key: status },
                    h("div", { className: "bar-label" }, h("span", null, status), h("strong", null, `${count} bag(s)`)),
                    h("div", { className: "bar-track" }, h("div", { className: "bar-fill", style: { width: `${percentage}%` } }))
                );
            }))
        );
    }

    function AlertsPanel({ records, title = "Live Alerts", icon = "fa-bell" }) {
        const alerts = Object.values(records).filter((record) => record.delay > 10 || calculateRiskScore(record) >= 40);
        return h("div", { className: "alerts-panel glass-card" },
            h("div", { className: "card-title" }, h("i", { className: `fa-solid ${icon}` }), h("h3", null, title)),
            h("div", { className: "alert-list" }, alerts.length ? alerts.map((record) => {
                const meta = getRiskMeta(calculateRiskScore(record));
                return h("article", { className: "alert-item", key: record.id },
                    h("i", { className: `fa-solid ${meta.key === "high" ? "fa-triangle-exclamation" : "fa-clock"}` }),
                    h("div", null, h("strong", null, `${record.id} • ${record.flight}`), h("p", null, `${meta.label}: ${record.status} at ${record.location}. Delay ${record.delay}m.`))
                );
            }) : h("p", { className: "status-meta" }, "No active baggage alerts."))
        );
    }

    function AdminForm({ records, selectedRecord, onSubmit, message }) {
        const [form, setForm] = useState({ id: selectedRecord.id, status: selectedRecord.status, location: selectedRecord.location, delay: selectedRecord.delay });

        function updateField(field, value) {
            const nextForm = { ...form, [field]: value };
            if (field === "id") {
                const record = records[value];
                nextForm.status = record.status;
                nextForm.location = record.location;
                nextForm.delay = record.delay;
            }
            setForm(nextForm);
        }

        return h("form", { className: "admin-form glass-card", onSubmit: (event) => { event.preventDefault(); onSubmit(form); } },
            h("div", { className: "section-heading compact" }, h(Eyebrow, { icon: "fa-pen-to-square", text: "Operations update" }), h("h2", null, "Save baggage status")),
            h("div", { className: "form-grid" },
                h("label", null, "Bag ID", h("select", { value: form.id, onChange: (event) => updateField("id", event.target.value) }, Object.keys(records).map((bagId) => h("option", { key: bagId, value: bagId }, bagId)))),
                h("label", null, "New Status", h("select", { value: form.status, onChange: (event) => updateField("status", event.target.value) }, Object.keys(statusStageIndex).map((status) => h("option", { key: status, value: status }, status)))),
                h("label", null, "Current Location", h("input", { type: "text", value: form.location, placeholder: "e.g., Gate B12 scanner", onChange: (event) => updateField("location", event.target.value) })),
                h("label", null, "Delay Minutes", h("input", { type: "number", min: "0", max: "180", value: form.delay, onChange: (event) => updateField("delay", event.target.value) }))
            ),
            h("button", { className: "secondary-btn", type: "submit" }, h("i", { className: "fa-solid fa-rotate" }), " Save Update"),
            message ? h("p", { className: "form-note", role: "status" }, message) : null
        );
    }

    function LostForm({ onSubmit, message, title }) {
        const [form, setForm] = useState({ email: "", bagId: "", notes: "" });
        return h("form", { className: "lost-form glass-card", onSubmit: (event) => { event.preventDefault(); onSubmit(form); setForm({ email: "", bagId: "", notes: "" }); } },
            title ? h("div", { className: "section-heading compact" }, h(Eyebrow, { icon: "fa-file-circle-exclamation", text: "Lost baggage module" }), h("h2", null, title)) : null,
            h("label", null, "Passenger Email", h("input", { type: "email", value: form.email, placeholder: "passenger@example.com", required: true, onChange: (event) => setForm({ ...form, email: event.target.value }) })),
            h("label", null, "Bag ID", h("input", { type: "text", value: form.bagId, placeholder: "BG1024", required: true, onChange: (event) => setForm({ ...form, bagId: event.target.value }) })),
            h("label", null, "Issue Notes", h("textarea", { rows: 4, value: form.notes, placeholder: "Describe the baggage issue", onChange: (event) => setForm({ ...form, notes: event.target.value }) })),
            h("button", { className: "primary-btn", type: "submit" }, h("i", { className: "fa-solid fa-paper-plane" }), " Submit Claim"),
            message ? h("p", { className: "form-note", role: "status" }, message) : null
        );
    }

    function MetricStrip({ metrics }) {
        return h("div", { className: "metric-strip", "aria-label": "System summary metrics" },
            h("article", null, h("strong", null, metrics.total), h("span", null, "Bags monitored")),
            h("article", null, h("strong", null, `${metrics.safeRate}%`), h("span", null, "Low risk rate")),
            h("article", null, h("strong", null, `${metrics.averageDelay}m`), h("span", null, "Average delay"))
        );
    }

    function ModuleCard({ card }) {
        return h("a", { className: "module-card glass-card", href: pageHref(card.page) },
            h("i", { className: `fa-solid ${card.icon}` }), h("h3", null, card.title), h("p", null, card.text)
        );
    }

    function Eyebrow({ icon, text }) {
        return h("p", { className: "eyebrow" }, h("i", { className: `fa-solid ${icon}` }), ` ${text}`);
    }

    function Footer({ currentPage }) {
        const label = currentPage === "home" ? "Predictive tracking • Risk analysis • Passenger care" : `${pages[currentPage].eyebrow} module`;
        return h("footer", { className: "footer" }, h("span", null, "© 2026 SmartTrack Baggage Intelligence"), h("span", null, label));
    }

    function getMetrics(records) {
        const values = Object.values(records);
        const lowRiskCount = values.filter((record) => calculateRiskScore(record) < 40).length;
        return {
            total: values.length,
            safeRate: Math.round((lowRiskCount / values.length) * 100),
            averageDelay: Math.round(values.reduce((sum, record) => sum + record.delay, 0) / values.length)
        };
    }

    ReactDOM.createRoot(document.getElementById("app")).render(h(App));
}());
