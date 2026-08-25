/* Shared SV/EN language switcher.
 *
 * Swedish is the source language and lives directly in each page's HTML.
 * This file only holds the English translations, keyed by the values of
 * each element's `data-i18n` attribute. On load, the original Swedish
 * markup of every `[data-i18n]` element is captured so switching back to
 * Swedish is just a restore, not a second copy of the text.
 *
 * Attributes (alt, aria-label, ...) are handled separately via
 * `data-i18n-attr="attrName:key;attrName2:key2"`.
 *
 * Include this script right before `</body>` on every page that should be
 * translatable, and give the language switch button `id="lang-toggle"`.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'siteLang';

    // English translations, keyed by data-i18n value.
    var EN = {
        // Shared nav (all pages with a .site-nav header)
        'nav.education': 'Education',
        'nav.work': 'Work',
        'nav.personal': 'Personal',
        'nav.pomodoro': 'My pomodoro timer',
        'nav.ariaLabel': 'Main navigation',

        // Shared contact modal (all pages that have one)
        'contact.title': 'Contact',
        'contact.emailLabel': 'Email:',
        'contact.phoneLabel': 'Phone:',
        'contact.hint': 'Click outside the panel or press Esc to close.',
        'contact.sayHi': 'Say hi!',
        'contact.closeAriaLabel': 'Close contact',
        'contact.photoAlt': 'Contact',

        // <title> tags
        'title.projects': 'Projects',
        'title.education': 'Education',
        'title.personal': 'Personal',
        'title.personalProjects': 'Personal Projects',
        'title.heatmap': 'Project - Urban Intelligence',

        // utbildning.html
        'edu.period1': 'Aug 2024 — Ongoing',
        'edu.title1': 'MSc in Computer Science and Engineering — Linköping University',
        'edu.desc1': 'I am currently studying for a Master of Science in Computer Science and Engineering at Linköping University. My education focuses on giving a deep understanding of computer systems, programming and software development, as well as developing problem-solving and innovation skills within technology.',
        'edu.showCourses': 'Show courses ▼',
        'edu.hideCourses': 'Hide courses ▲',
        'edu.th.course': 'Course',
        'edu.th.code': 'Code',
        'edu.th.subject': 'Subject area',
        'edu.th.grade': 'Grade',

        'edu.gpa.title': 'GPA',
        'edu.gpa.weighted': 'Weighted',
        'edu.gpa.unweighted': 'Unweighted',
        'edu.gpa.note': 'Based on 17 courses with numeric grades',

        'edu.course.tata65': 'Discrete Mathematics',
        'edu.course.tata24': 'Linear Algebra',
        'edu.course.tdde24': 'Functional and Imperative Programming, Part 2',
        'edu.course.tddd70': 'Engineering Professionalism, Part 1',
        'edu.course.tatb04': 'Introductory Mathematical Analysis',
        'edu.course.tsea22': 'Digital Design',
        'edu.course.tddd98': 'Engineering Professionalism, Part 6',
        'edu.course.tste24': 'Electronics',
        'edu.course.tddd84': 'Engineering Professionalism, Part 3',
        'edu.course.tddd86': 'Data Structures, Algorithms and Programming Paradigms',
        'edu.course.tfya93': 'Mechanics',
        'edu.course.tata41': 'Single-Variable Calculus 1',
        'edu.course.tata42': 'Single-Variable Calculus 2',
        'edu.course.tata76': 'Multivariable Calculus',
        'edu.course.tdde23': 'Functional and Imperative Programming, Part 1',
        'edu.course.tdde25': 'Perspectives on Computer and Software Engineering',
        'edu.course.tsea82': 'Computer Engineering',
        'edu.course.tddb68': 'Concurrent Programming and Operating Systems',
        'edu.course.tsea83': 'Computer Design',
        'edu.course.tams11': 'Probability Theory and Statistics',
        'edu.course.tfya86': 'Physics',

        'edu.subject.math': 'Mathematics',
        'edu.subject.programming': 'Programming',
        'edu.subject.profcomp': 'Professional Competence',
        'edu.subject.cseElec': 'Computer Engineering, Electronics',
        'edu.subject.electronics': 'Electronics',
        'edu.subject.progAlgo': 'Programming / Algorithms',
        'edu.subject.physics': 'Physics',
        'edu.subject.cseProg': 'Computer Engineering, Programming',
        'edu.subject.mathApplied': 'Mathematics, Applied Mathematics',
        'edu.subject.engPhysics': 'Engineering Physics',

        'edu.grade.pass': 'P*',

        'edu.footnote': '* Grading scale Fail/Pass',

        'edu.section2.period': 'Jan 2024 — June 2024',
        'edu.section2.title': 'Mathematics 1 — Stockholm University',
        'edu.section2.desc': 'During spring 2024 I studied Mathematics 1 at Stockholm University. The course covered discrete mathematics, linear algebra, single-variable calculus and multivariable calculus. I developed a strong understanding of mathematical principles and their applications in different fields.',

        'edu.section3.category': 'Upper Secondary Education',
        'edu.section3.period': 'August 2020 - June 2023',
        'edu.section3.title': 'Science and Technology Programme — Nacka Upper Secondary School',
        'edu.section3.desc': 'During my time on the Science and Technology Programme at Nacka Upper Secondary School I built a strong foundation in mathematics and technology. I took part in several projects and collaborations that prepared me for further studies in technology and computer science.',

        // jobb.html
        'jobb.viewProject': 'View project →',
        'jobb.card1.period': 'Aug 2025 — Ongoing',
        'jobb.card1.desc': 'We are building an electric race car that we compete with against other universities across Europe. Together with a dedicated team, I am responsible for all the electronics in the car, from programming microcontrollers to the wiring.',

        'jobb.card2.category': 'Teaching',
        'jobb.card2.period': 'August 2026 — Ongoing',
        'jobb.card2.title': 'Teaching Assistant in Mathematics',
        'jobb.card2.desc': 'As a teaching assistant I have had the opportunity to teach and inspire in various mathematics courses at the university. It has been rewarding for developing my pedagogical skills while sharpening my own mathematical knowledge.',

        'jobb.card3.category': "The Computer Science Student Union's Marketing Committee",
        'jobb.card3.period': 'May 2025 - Ongoing',
        'jobb.card3.title': 'Student Union Work',
        'jobb.card3.desc': "I am a member of the Computer Science Student Union's Marketing Committee, where I am responsible for creating and maintaining contact with upper secondary schools. My goal is to increase engagement and visibility for the section's programmes, primarily among upper secondary students.",

        'jobb.card4.category': 'Programming',
        'jobb.card4.period': 'May 2004 - Ongoing',
        'jobb.card4.title': 'Personal Projects',
        'jobb.card4.desc': 'I have worked on various programming projects over the years, including web applications, game development and data visualization. I always strive to learn new technologies and improve my skills.',

        // personligt.html
        'pers.heroTitle': 'Who am I?',
        'pers.heroDesc': "My name is Rickard and I'm a tech-interested student who loves creating things — everything from electric cars and games to websites. I enjoy challenges, structure, creativity and always learning something new.",
        'pers.interestsTitle': 'My interests',
        'pers.card1.title': 'Running & training',
        'pers.card1.desc': "I run 5–10 km regularly and I'm aiming for my first marathon. Training keeps me energized, happy and focused.",
        'pers.card2.title': 'Skiing',
        'pers.card2.desc': 'I love skiing with my friends — preferably in the Alps or Åre.',
        'pers.card3.title': 'Geeking out',
        'pers.card3.desc': "I like creating all kinds of things, whether it's games, websites or electronics projects. Check out my <a href=\"jobb/personal_projects.html\">personal projects</a>.",
        'pers.favTitle': 'Favorites:',
        'pers.fav.city': '<strong>City:</strong> London 🇬🇧',
        'pers.fav.food': '<strong>Food:</strong> Entrecôte with fries',
        'pers.fav.film': '<strong>Movie:</strong> Will Hunting',
        'pers.fav.lang': '<strong>Programming language:</strong> C++ (Of course 😄)',
        'pers.goalsTitle': 'Current goals',
        'pers.goal1.title': '🏃 Run a marathon under 3:30',
        'pers.goal1.desc': "I'm training to run the <b>ADIDAS STOCKHOLM MARATHON 2027</b> in under 3:30. That's a big time cut compared to 2026, but with hard training and dedication I'm confident I can reach my goal.",
        'pers.goal2.title': '🎓 MSc in Engineering',
        'pers.goal2.desc': 'Focusing on mathematics, programming and computer engineering.',
        'pers.goal3.title': '🌍 Study abroad',
        'pers.goal3.desc': 'I dream of studying a semester in another country. I think it would be very educational and a fantastic experience.',

        // jobb/formula.html
        'formula.s1.title': 'Kickoff',
        'formula.s1.period': 'August 2025',
        'formula.s2.title': 'Learning',
        'formula.s2.period': 'September 2025',
        'formula.s3.title': 'Development',
        'formula.s3.period': 'October 2025 - April 2026',
        'formula.s4.title': 'Testing',
        'formula.s4.period': 'February 2026 - Summer 2026',
        'formula.s5.title': 'Competition',
        'formula.s5.period': 'Summer 2026',

        // jobb/amanuens.html
        'amanuens.s1.title': 'Teacher',
        'amanuens.s1.category': 'Mathematics 4',
        'amanuens.s1.period': 'January 2026 - April 2026',
        'amanuens.s2.title': 'Supervisor',
        'amanuens.s2.category': 'Introductory Mathematical Analysis',
        'amanuens.s2.period': 'October 2025 - January 2026',
        'amanuens.s3.title': 'Mentor',
        'amanuens.s3.category': 'Discrete Mathematics',
        'amanuens.s3.period': 'August 2025 - October 2026',

        // jobb/sektionsarbete.html
        'sektion.s1.title': 'Kickoff',
        'sektion.s1.period': 'May - September 2025',
        'sektion.s1.desc': "At the start of my involvement in the marketing committee, much of the work was about planning the year ahead. What did we want to do? What were our expectations? We put together a plan for the year's big events, and made sure everyone felt comfortable with their tasks. It was a fun and creative process where we shaped our vision for the year together. Towards the end of this period we also welcomed new members to the committee.",
        'sektion.s2.title': 'School visits in Stockholm and Lund',
        'sektion.s2.period': 'December 2025 and April 2026',
        'sektion.s2.desc': 'We went on two trips to Stockholm and Lund to visit upper secondary schools and talk about the Computer Science Student Union and our programmes. It was a fantastic opportunity to meet students, answer their questions and inspire them to consider a future in computer engineering. We shared our own experiences and talked about the exciting projects and opportunities within the section and the university.',
        'sektion.s3.title': 'The fairs',
        'sektion.s3.period': 'Recurring throughout the year',
        'sektion.s3.desc': 'We took part in several fairs and events (e.g. open house and the popular science days in Linköping) to promote the Computer Science Student Union and our programmes. These occasions gave us the opportunity to meet interested students, answer questions and share our experiences.',
        'sektion.s4.period': 'March 2026',
        'sektion.s4.desc1': 'This was one of our biggest projects. It is a two-day activity where we give upper secondary students the chance to come to the university and try out life as a computer engineering student. We welcomed around 30 students who were curious about further studies. Among other things, we arranged a campus walk, programming workshops and a classic student dinner ("sittning").',
        'sektion.s4.desc2': 'For my part, the work involved contacting upper secondary schools to inform them about this opportunity for their students. It meant many phone calls with study and career counsellors around the country. It was a fun and rewarding process where I got to talk to many different people and spread information about our programmes. It was also great to see so many students come to the university and have a fun and inspiring day.',

        // jobb/personal_projects.html
        'gh.bio': 'CS student exploring the world of AI & ML | Always building and learning through fun side projects.',
        'gh.cta': 'View my GitHub profile →',
        'gh.avatarAlt': "Rickard Hjerpe's GitHub profile picture",
        'gh.contribAlt': "Rickard Hjerpe's GitHub contributions over the past year",
        'pp.period': 'May 2026',
        'pp.desc': 'A heatmap that shows where there is the highest concentration of a given keyword, e.g. "bar" or "cafe".',
        'pp.imgAlt': 'Heatmap visualization in React',

        // jobb/heatmap.html
        'heatmap.s1.desc': 'The foundation of the project is an interactive web application built in <strong>React</strong>. To visualize the density of services in a city I implemented <strong>Leaflet.heat</strong>. The challenge here was creating a dynamic heatmap where the "intensity" (max value) automatically adapts based on the amount of data returned, ensuring the map stays readable whether you search in a small town or in New York.',
        'heatmap.s2.desc': 'The backend is powered by <strong>Flask</strong> and acts as a bridge between the user and the <strong>OpenStreetMap Overpass API</strong>. I developed an engine that builds dynamic queries to fetch spatial data (nodes and ways) based on Area ID and specific tags. To optimize performance, coordinate transformations and data cleaning are handled directly on the server before the result is sent to the client.',
        'heatmap.s3.title': 'Pattern Recognition with DBSCAN',
        'heatmap.s3.desc': 'To go beyond simple visualization I integrated machine learning in the form of the <strong>DBSCAN algorithm</strong> (via Scikit-learn). By analyzing GPS coordinates in radians, the system can identify clusters of arbitrary shapes — perfect for detecting linear patterns like "bar streets". This lets the app automatically distinguish noise (isolated spots) from actual concentrated areas of interest.',
        'heatmap.s4.title': 'Reverse Geocoding & Interactivity',
        'heatmap.s4.desc': 'To make the data understandable to the user, a module for <strong>Reverse Geocoding</strong> was implemented using Nominatim. Each mathematical cluster is translated into an actual street name or neighborhood. The end result is a clickable list where the user can "fly" (map.flyTo) to the hottest areas, creating a seamless connection between raw data, algorithm and user interface.',
        'heatmap.imgAlt.code': 'Python Flask backend code',
        'heatmap.imgAlt.dbscan': 'DBSCAN clustering of coordinates',
        'heatmap.imgAlt.search': 'Search results with street names'
    };

    // Swedish strings for data-i18n keys that are set dynamically by page
    // scripts (so there is no static DOM node to capture the Swedish text
    // from). Currently only the utbildning.html course dropdown button.
    var SV_EXTRA = {
        'edu.showCourses': 'Visa kurser ▼',
        'edu.hideCourses': 'Dölj kurser ▲'
    };

    var current = 'sv';
    var svCache = new Map(); // element -> original (Swedish) innerHTML
    var attrCache = new Map(); // element -> [{attr, key, sv}]

    function svTextFor(el, key) {
        if (Object.prototype.hasOwnProperty.call(SV_EXTRA, key)) {
            return SV_EXTRA[key];
        }
        return svCache.get(el);
    }

    function captureOriginals() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            if (!svCache.has(el)) {
                svCache.set(el, el.innerHTML);
            }
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            if (attrCache.has(el)) return;
            var pairs = el.getAttribute('data-i18n-attr').split(';')
                .map(function (s) { return s.trim(); })
                .filter(Boolean);
            var list = pairs.map(function (pair) {
                var idx = pair.indexOf(':');
                var attr = pair.slice(0, idx).trim();
                var key = pair.slice(idx + 1).trim();
                return { attr: attr, key: key, sv: el.getAttribute(attr) };
            });
            attrCache.set(el, list);
        });
    }

    function applyLang(lang) {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (lang === 'en' && Object.prototype.hasOwnProperty.call(EN, key)) {
                el.innerHTML = EN[key];
            } else {
                var sv = svTextFor(el, key);
                if (sv !== undefined) el.innerHTML = sv;
            }
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            (attrCache.get(el) || []).forEach(function (item) {
                if (lang === 'en' && Object.prototype.hasOwnProperty.call(EN, item.key)) {
                    el.setAttribute(item.attr, EN[item.key]);
                } else {
                    el.setAttribute(item.attr, item.sv);
                }
            });
        });

        var toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.setAttribute('aria-checked', lang === 'en' ? 'true' : 'false');
            toggle.classList.toggle('is-en', lang === 'en');
        }

        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore (private mode etc.) */ }
        current = lang;
    }

    function detectInitialLang() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'sv' || saved === 'en') return saved;
        } catch (e) { /* ignore */ }
        var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        return browserLang.indexOf('sv') === 0 ? 'sv' : 'en';
    }

    function initToggle() {
        var toggle = document.getElementById('lang-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            applyLang(current === 'sv' ? 'en' : 'sv');
        });
    }

    captureOriginals();
    initToggle();
    applyLang(detectInitialLang());

    window.i18n = {
        t: function (key) {
            if (current === 'en' && Object.prototype.hasOwnProperty.call(EN, key)) return EN[key];
            return Object.prototype.hasOwnProperty.call(SV_EXTRA, key) ? SV_EXTRA[key] : key;
        },
        applyLang: applyLang,
        get current() { return current; }
    };
})();
