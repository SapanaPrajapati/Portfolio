/* ==========================================================================
   Sapana Prajapati — Data Analyst Portfolio — interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    footerYear();
    typeHeroQuery();
    initScrollReveal();
    initKpiCounters();
    initNavScrollSpy();
    initMobileNav();
    initProjectAccordion();
    initCopyEmail();
});

/* ---------- footer year ---------- */
function footerYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- hero terminal typing effect ---------- */
function typeHeroQuery() {
    const target = document.getElementById("typedQuery");
    const result = document.getElementById("terminalResult");
    const cursor = document.getElementById("typeCursor");
    if (!target) return;

    const query = "SELECT name, role, stack FROM data_analysts WHERE status = 'available';";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        target.textContent = query;
        result?.classList.add("is-visible");
        return;
    }

    let i = 0;
    const speed = 22;

    function tick() {
        if (i <= query.length) {
            target.textContent = query.slice(0, i);
            i++;
            setTimeout(tick, speed);
        } else {
            if (cursor) cursor.style.animationDuration = "1s";
            setTimeout(() => result?.classList.add("is-visible"), 250);
        }
    }

    setTimeout(tick, 500);
}

/* ---------- scroll reveal ---------- */
function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
}

/* ---------- KPI count-up ---------- */
function initKpiCounters() {
    const counters = document.querySelectorAll(".kpi-number");
    if (!counters.length) return;

    const animate = (el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = target * eased;
            el.textContent = value.toFixed(decimals) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(decimals) + suffix;
            }
        }
        requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animate);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
}

/* ---------- nav active-section highlighting ---------- */
function initNavScrollSpy() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[data-nav]");
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    const linkFor = (id) =>
        document.querySelector('.nav-links a[href="#' + id + '"]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const link = linkFor(entry.target.id);
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove("is-active"));
                    link.classList.add("is-active");
                }
            });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
}

/* ---------- mobile nav toggle ---------- */
function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            links.classList.remove("is-open");
            toggle.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* ---------- projects accordion ---------- */
function initProjectAccordion() {
    const rows = document.querySelectorAll(".proj-row");
    if (!rows.length) return;

    rows.forEach((row) => {
        row.addEventListener("click", () => {
            const item = row.closest(".proj-item");
            const detail = item.querySelector(".proj-detail");
            const isOpen = row.getAttribute("aria-expanded") === "true";

            // close any other open row (single-open accordion)
            document.querySelectorAll(".proj-item.is-open").forEach((openItem) => {
                if (openItem !== item) {
                    openItem.classList.remove("is-open");
                    const openRow = openItem.querySelector(".proj-row");
                    const openDetail = openItem.querySelector(".proj-detail");
                    openRow.setAttribute("aria-expanded", "false");
                    openDetail.style.maxHeight = null;
                }
            });
            document.querySelectorAll('.proj-github-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const repoUrl = btn.dataset.repo;
                    if (repoUrl) {
                        window.open(repoUrl, '_blank', 'noopener,noreferrer');
                    }
                });
            });

            if (isOpen) {
                item.classList.remove("is-open");
                row.setAttribute("aria-expanded", "false");
                detail.style.maxHeight = null;
            } else {
                item.classList.add("is-open");
                row.setAttribute("aria-expanded", "true");
                detail.style.maxHeight = detail.scrollHeight + "px";
            }
        });
    });

    // keep open panel sized correctly on window resize
    window.addEventListener("resize", () => {
        const openItem = document.querySelector(".proj-item.is-open");
        if (!openItem) return;
        const detail = openItem.querySelector(".proj-detail");
        detail.style.maxHeight = detail.scrollHeight + "px";
    });
}

/* ---------- copy email ---------- */
function initCopyEmail() {
    const btn = document.getElementById("copyEmail");
    const hint = document.getElementById("copyHint");
    if (!btn) return;

    const email = btn.querySelector(".contact-value").textContent.trim();

    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
        } catch (err) {
            // fallback for browsers without clipboard API access
            const ta = document.createElement("textarea");
            ta.value = email;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }

        btn.classList.add("is-copied");
        if (hint) hint.textContent = "";
        setTimeout(() => {
            btn.classList.remove("is-copied");
            if (hint) hint.textContent = "click to copy";
        }, 1800);
    });
}
