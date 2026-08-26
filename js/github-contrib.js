/* Builds an interactive GitHub contribution graph (hover tooltips showing
 * commit counts per day) for #github-contrib, using live data from a public
 * CORS-enabled mirror of GitHub's own contribution data.
 *
 * If the fetch fails for any reason, the static fallback <img> that already
 * sits inside #github-contrib (a ghchart.rshah.org image) is left untouched.
 */
(function () {
    'use strict';

    var USERNAME = 'rickyspr';
    var API_URL = 'https://github-contributions-api.jogruber.de/v4/' + USERNAME + '?y=last';

    var LEVEL_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

    var CELL = 11;
    var GAP = 3;
    var STEP = CELL + GAP;
    var LEFT_PAD = 24;
    var TOP_PAD = 16;

    var MONTHS_ABBR_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    var MONTHS_ABBR_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var MONTHS_FULL_SV = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    var MONTHS_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var WEEKDAY_LABELS = { sv: ['', 'Mån', '', 'Ons', '', 'Fre', ''], en: ['', 'Mon', '', 'Wed', '', 'Fri', ''] };

    var TOOLTIP_TEXT = {
        sv: { zero: 'Inga commits {date}', one: '1 commit {date}', many: '{count} commits {date}' },
        en: { zero: 'No commits on {date}', one: '1 commit on {date}', many: '{count} commits on {date}' }
    };

    function currentLang() {
        return (window.i18n && window.i18n.current === 'en') ? 'en' : 'sv';
    }

    function formatTooltipDate(date, lang) {
        var months = lang === 'en' ? MONTHS_FULL_EN : MONTHS_FULL_SV;
        if (lang === 'en') {
            return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
        return 'den ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    function tooltipTextFor(count, date, lang) {
        var tpl = count === 0 ? TOOLTIP_TEXT[lang].zero : count === 1 ? TOOLTIP_TEXT[lang].one : TOOLTIP_TEXT[lang].many;
        return tpl.replace('{count}', count).replace('{date}', formatTooltipDate(date, lang));
    }

    // How many recent months to show, by viewport width, so the graph never
    // needs to scroll horizontally inside the card.
    var BREAKPOINTS = [
        { minWidth: 900, months: 10 },
        { minWidth: 600, months: 8 },
        { minWidth: 0, months: 6 }
    ];

    function monthsForWidth(width) {
        for (var i = 0; i < BREAKPOINTS.length; i++) {
            if (width >= BREAKPOINTS[i].minWidth) return BREAKPOINTS[i].months;
        }
        return BREAKPOINTS[BREAKPOINTS.length - 1].months;
    }

    function sliceRecentMonths(contributions, months) {
        var cutoff = new Date();
        cutoff.setHours(0, 0, 0, 0);
        cutoff.setMonth(cutoff.getMonth() - months);
        return contributions.filter(function (c) {
            return new Date(c.date + 'T00:00:00') >= cutoff;
        });
    }

    function buildWeeks(contributions) {
        var days = contributions.map(function (c) {
            return { date: new Date(c.date + 'T00:00:00'), count: c.count, level: c.level };
        });
        var padded = [];
        var firstDow = days[0].date.getDay();
        for (var i = 0; i < firstDow; i++) padded.push(null);
        padded = padded.concat(days);
        while (padded.length % 7 !== 0) padded.push(null);
        var weeks = [];
        for (var w = 0; w < padded.length; w += 7) {
            weeks.push(padded.slice(w, w + 7));
        }
        return weeks;
    }

    function svgEl(name, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', name);
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        return el;
    }

    function renderGraph(container, weeks) {
        var lang = currentLang();
        var width = LEFT_PAD + weeks.length * STEP;
        var height = TOP_PAD + 7 * STEP;
        var svg = svgEl('svg', {
            class: 'github-contrib-svg',
            viewBox: '0 0 ' + width + ' ' + height,
            width: width,
            height: height,
            role: 'img',
            'aria-label': 'GitHub contributions'
        });

        var weekdayLabels = WEEKDAY_LABELS[lang];
        for (var d = 0; d < 7; d++) {
            if (!weekdayLabels[d]) continue;
            var wLabel = svgEl('text', { x: 0, y: TOP_PAD + d * STEP + CELL - 1, class: 'gh-weekday-label' });
            wLabel.textContent = weekdayLabels[d];
            svg.appendChild(wLabel);
        }

        var monthsAbbr = lang === 'en' ? MONTHS_ABBR_EN : MONTHS_ABBR_SV;
        var lastLabeledMonth = -1;
        weeks.forEach(function (week, w) {
            var firstRealDay = week.filter(Boolean)[0];
            if (firstRealDay) {
                var month = firstRealDay.date.getMonth();
                var isFirstWeekOfMonth = firstRealDay.date.getDate() <= 7;
                if (isFirstWeekOfMonth && month !== lastLabeledMonth) {
                    var mLabel = svgEl('text', { x: LEFT_PAD + w * STEP, y: TOP_PAD - 5, class: 'gh-month-label' });
                    mLabel.textContent = monthsAbbr[month];
                    svg.appendChild(mLabel);
                    lastLabeledMonth = month;
                }
            }

            week.forEach(function (day, d) {
                if (!day) return;
                var rect = svgEl('rect', {
                    x: LEFT_PAD + w * STEP,
                    y: TOP_PAD + d * STEP,
                    width: CELL,
                    height: CELL,
                    rx: 2,
                    ry: 2,
                    fill: LEVEL_COLORS[day.level] || LEVEL_COLORS[0],
                    tabindex: '0',
                    'data-date': day.date.toISOString().slice(0, 10),
                    'data-count': day.count
                });
                rect.setAttribute('aria-label', tooltipTextFor(day.count, day.date, lang));
                svg.appendChild(rect);
            });
        });

        container.innerHTML = '';
        container.appendChild(svg);
        return svg;
    }

    function setupTooltip(svg, tooltip) {
        function textFor(rect) {
            var count = parseInt(rect.getAttribute('data-count'), 10) || 0;
            var date = new Date(rect.getAttribute('data-date') + 'T00:00:00');
            return tooltipTextFor(count, date, currentLang());
        }

        function position(x, y) {
            var pad = 10;
            var box = tooltip.getBoundingClientRect();
            var left = Math.max(pad, Math.min(x - box.width / 2, window.innerWidth - box.width - pad));
            var top = y - box.height - 14;
            if (top < pad) top = y + 20;
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }

        function show(rect, x, y) {
            tooltip.textContent = textFor(rect);
            tooltip.classList.add('is-visible');
            tooltip.setAttribute('aria-hidden', 'false');
            position(x, y);
        }

        function hide() {
            tooltip.classList.remove('is-visible');
            tooltip.setAttribute('aria-hidden', 'true');
        }

        function isDayRect(el) {
            return el && el.tagName === 'rect' && el.hasAttribute('data-date');
        }

        svg.addEventListener('mousemove', function (e) {
            if (isDayRect(e.target)) {
                show(e.target, e.clientX, e.clientY);
            } else {
                hide();
            }
        });
        svg.addEventListener('mouseleave', hide);

        svg.addEventListener('focusin', function (e) {
            if (isDayRect(e.target)) {
                var box = e.target.getBoundingClientRect();
                show(e.target, box.left + box.width / 2, box.top);
            }
        });
        svg.addEventListener('focusout', hide);
    }

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('github-contrib');
        var tooltip = document.getElementById('github-tooltip');
        if (!container || !tooltip) return;

        fetch(API_URL)
            .then(function (res) {
                if (!res.ok) throw new Error('bad response');
                return res.json();
            })
            .then(function (data) {
                if (!data || !Array.isArray(data.contributions) || !data.contributions.length) {
                    throw new Error('no data');
                }

                var allContributions = data.contributions;
                var renderedMonths = null;

                function render() {
                    var months = monthsForWidth(window.innerWidth);
                    if (months === renderedMonths) return;
                    renderedMonths = months;
                    tooltip.classList.remove('is-visible');
                    tooltip.setAttribute('aria-hidden', 'true');
                    var weeks = buildWeeks(sliceRecentMonths(allContributions, months));
                    var svg = renderGraph(container, weeks);
                    setupTooltip(svg, tooltip);
                }

                render();
                window.addEventListener('resize', debounce(render, 150));
            })
            .catch(function () {
                /* Keep the static fallback <img> already present in the DOM. */
            });
    });
})();
