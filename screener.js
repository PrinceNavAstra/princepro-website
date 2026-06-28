(function () {
    var NSE_STOCKS = [
        { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Diversified' },
        { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services' },
        { symbol: 'INFY', name: 'Infosys', sector: 'IT Services' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
        { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
        { symbol: 'ITC', name: 'ITC', sector: 'FMCG' },
        { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure' },
        { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile' },
        { symbol: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma' }
    ];

    // MVP: free client-side model.
    // IMPORTANT: Without a free OHLC API/CORS-friendly feed, this page uses placeholders for price/news.
    // The UI + on-change filtering + scoring works immediately.

    var els = {
        searchSymbol: document.getElementById('searchSymbol'),
        trendFilter: document.getElementById('trendFilter'),
        mcMin: document.getElementById('mcMin'),
        newsImpact: document.getElementById('newsImpact'),
        qualityMin: document.getElementById('qualityMin'),
        sortBy: document.getElementById('sortBy'),
        refreshBtn: document.getElementById('refreshBtn'),
        clearBtn: document.getElementById('clearBtn'),
        tbody: document.getElementById('scrTbody'),
        empty: document.getElementById('scrEmpty'),
        count: document.getElementById('scrCount'),
        inspect: document.getElementById('scrInspect'),
        inspectPre: document.getElementById('scrInspectPre')
    };

    function clamp(n, a, b) {
        return Math.min(b, Math.max(a, n));
    }

    function formatINR(num) {
        if (!isFinite(num)) return '—';
        return '₹' + Math.round(num).toLocaleString('en-IN');
    }

    function formatCr(num) {
        if (!isFinite(num)) return '—';
        var cr = num;
        return cr.toFixed(cr >= 100 ? 0 : 1) + ' Cr';
    }

    function sentimentFromHeadline(headline) {
        var t = (headline || '').toLowerCase();

        var good = [
            'beat', 'beats', 'strong', 'upgrade', 'upgraded', 'positive', 'growth',
            'record', 'raise', 'raised', 'guidance', 'surplus', 'profit', 'demand', 'order'
        ];
        var bad = [
            'miss', 'mismatch', 'weak', 'downgrade', 'downgraded', 'negative', 'decline',
            'lawsuit', 'fraud', 'embezz', 'fraudulent', 'loss', 'warning', 'cut', 'cutoff',
            'regulator', 'probe'
        ];

        var score = 0;

        for (var i = 0; i < good.length; i++) {
            if (t.indexOf(good[i]) !== -1) score += 2;
        }
        for (var j = 0; j < bad.length; j++) {
            if (t.indexOf(bad[j]) !== -1) score -= 2;
        }

        // extra heuristics
        if (t.indexOf('profit warning') !== -1) score -= 6;
        if (t.indexOf('guidance raised') !== -1) score += 6;

        // normalize roughly to -100..+100-ish
        return clamp(score * 10, -100, 100);
    }

    function classifyNewsImpact(headlines) {
        // headlines: array of strings
        if (!headlines || !headlines.length) {
            return { impactScore: 0, label: 'Neutral', badgeClass: 'scr-pill--neutral' };
        }

        var sum = 0;
        var goodCount = 0;
        var badCount = 0;
        for (var i = 0; i < headlines.length; i++) {
            var sc = sentimentFromHeadline(headlines[i]);
            sum += sc;
            if (sc > 0) goodCount++;
            if (sc < 0) badCount++;
        }

        var avg = sum / headlines.length;
        var label;
        var badgeClass;
        if (avg >= 25) {
            label = 'Good';
            badgeClass = 'scr-pill--good';
        } else if (avg <= -25) {
            label = 'Bad';
            badgeClass = 'scr-pill--bad';
        } else {
            label = 'Neutral';
            badgeClass = 'scr-pill--neutral';
        }

        return { impactScore: clamp(Math.round(avg), -100, 100), label: label, badgeClass: badgeClass, goodCount: goodCount, badCount: badCount };
    }

    function computeTrendFromPlaceholders(seed) {
        // TODO (next step): replace with OHLC-driven MA50/MA200
        // MVP placeholder based on symbol seed.
        var x = seed % 100;
        if (x > 66) return { trend: 'Uptrend', strength: 0.7 };
        if (x < 33) return { trend: 'Downtrend', strength: 0.7 };
        return { trend: 'Sideways', strength: 0.35 };
    }

    function computeSupportResistanceFromPlaceholders(seed) {
        // TODO (next step): replace with swing highs/lows from OHLC
        var base = 1000 + seed * 3;
        var support = base * (0.92 + (seed % 7) * 0.005);
        var resistance = base * (1.04 + (seed % 9) * 0.004);
        return { support: support, resistance: resistance };
    }

    function computeQualityScore(stock, trendInfo, newsInfo) {
        // MVP: quality = trend strength + news impact + small deterministic sector bias
        var sectorBias = 0;
        if (stock.sector && stock.sector.toLowerCase().indexOf('bank') !== -1) sectorBias = 10;
        if (stock.sector && stock.sector.toLowerCase().indexOf('it') !== -1) sectorBias = 8;

        var trendScore = Math.round(trendInfo.strength * 40);
        var newsScore = Math.round((newsInfo.impactScore + 100) / 2); // map -100..+100 to 0..100

        var raw = 0.4 * trendScore + 0.6 * newsScore + sectorBias;
        return clamp(Math.round(raw), 0, 100);
    }

    function loadSeededNews(symbol) {
        // MVP: deterministic placeholder headlines. Replace with real RSS/news later.
        // Good/bad mix for demonstration.
        var map = {
            RELIANCE: ['Reliance: strong demand signals growth', 'Analysts upgrade outlook after solid quarter'],
            TCS: ['TCS profit beats expectations in latest earnings report', 'Orders growth remains steady, guidance positive'],
            INFY: ['Infosys misses revenue estimates; margins under pressure', 'Analysts note cautious demand outlook'],
            HDFCBANK: ['HDFC Bank upgrades growth outlook on improving asset quality', 'Strong credit growth reported'],
            ICICIBANK: ['ICICI Bank faces profit warning; downgrade concerns rise', 'Net interest margin pressure highlighted'],
            SBIN: ['SBI reports steady profitability, positive guidance', 'SBI faces regulatory scrutiny for legacy issues'],
            ITC: ['ITC results beat; demand remains strong', 'New approvals boost momentum'],
            LT: ['Larsen & Toubro sees order inflows; upgrade after guidance raised', 'Execution risk highlighted by analysts'],
            MARUTI: ['Maruti profit miss sparks downgrade', 'Demand weakens; warning on margins'],
            SUNPHARMA: ['Sun Pharma upgrade after strong quarter', 'Regulatory update keeps market cautious']
        };

        return map[symbol] || ['Market mixed signals; investors await next update'];
    }

    function symbolSeed(symbol) {
        var s = String(symbol);
        var hash = 0;
        for (var i = 0; i < s.length; i++) {
            hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
        }
        return hash;
    }

    function buildStockRows() {
        var rows = [];

        for (var i = 0; i < NSE_STOCKS.length; i++) {
            var stock = NSE_STOCKS[i];
            var seed = symbolSeed(stock.symbol);

            var trendInfo = computeTrendFromPlaceholders(seed);
            var levels = computeSupportResistanceFromPlaceholders(seed);

            var headlines = loadSeededNews(stock.symbol);
            var newsInfo = classifyNewsImpact(headlines);

            // placeholders for price + market cap
            var price = levels.support * (1.02 + ((seed % 11) / 100));
            var mc = 100000 + seed * 50; // just a placeholder numeric

            var quality = computeQualityScore(stock, trendInfo, newsInfo);

            // overall score
            var overall = Math.round(0.45 * quality + 0.25 * clamp(newsInfo.impactScore + 100, 0, 200) / 2 + 0.30 * (trendInfo.trend === 'Uptrend' ? 80 : trendInfo.trend === 'Downtrend' ? 20 : 50));

            rows.push({
                symbol: stock.symbol,
                name: stock.name,
                sector: stock.sector,
                price: price,
                marketCapCr: mc / 1e7,
                trend: trendInfo.trend,
                support: levels.support,
                resistance: levels.resistance,
                newsLabel: newsInfo.label,
                newsImpactScore: newsInfo.impactScore,
                newsBadgeClass: newsInfo.badgeClass,
                qualityScore: quality,
                overallScore: overall
            });
        }

        return rows;
    }

    var STOCK_ROWS = buildStockRows();

    var state = {
        search: '',
        trend: 'all',
        mcMinCr: 0,
        news: 'all',
        qualityMin: 0,
        sortBy: 'score'
    };

    function applyFilters(rows) {
        var out = rows.filter(function (r) {
            if (state.search) {
                var q = state.search.toLowerCase();
                if (String(r.symbol).toLowerCase().indexOf(q) === -1 && String(r.name).toLowerCase().indexOf(q) === -1) return false;
            }

            if (state.trend !== 'all') {
                if (state.trend === 'up' && r.trend !== 'Uptrend') return false;
                if (state.trend === 'down' && r.trend !== 'Downtrend') return false;
                if (state.trend === 'sideways' && r.trend !== 'Sideways') return false;
            }

            if (state.mcMinCr > 0) {
                if (!(r.marketCapCr >= state.mcMinCr)) return false;
            }

            if (state.news !== 'all') {
                if (state.news === 'good' && r.newsLabel !== 'Good') return false;
                if (state.news === 'bad' && r.newsLabel !== 'Bad') return false;
            }

            if (state.qualityMin > 0) {
                if (!(r.qualityScore >= state.qualityMin)) return false;
            }

            return true;
        });

        // Sorting
        out.sort(function (a, b) {
            if (state.sortBy === 'score') return b.overallScore - a.overallScore;
            if (state.sortBy === 'news') return b.newsImpactScore - a.newsImpactScore;
            if (state.sortBy === 'quality') return b.qualityScore - a.qualityScore;
            if (state.sortBy === 'trend') {
                var ta = a.trend === 'Uptrend' ? 2 : a.trend === 'Sideways' ? 1 : 0;
                var tb = b.trend === 'Uptrend' ? 2 : b.trend === 'Sideways' ? 1 : 0;
                return tb - ta;
            }
            if (state.sortBy === 'mc') return b.marketCapCr - a.marketCapCr;
            return b.overallScore - a.overallScore;
        });

        return out;
    }

    function renderTable(rows) {
        if (!els.tbody) return;

        els.tbody.innerHTML = '';

        if (!rows.length) {
            if (els.empty) els.empty.classList.add('show');
            if (els.count) els.count.textContent = '0';
            if (els.inspect) els.inspect.hidden = true;
            return;
        }

        if (els.empty) els.empty.classList.remove('show');
        if (els.count) els.count.textContent = String(rows.length);

        rows.forEach(function (r) {
            var tr = document.createElement('tr');
            tr.className = 'scr-tr';
            tr.tabIndex = 0;

            var newsPill = '<span class="scr-pill ' + r.newsBadgeClass + '">'
                + r.newsLabel + ' (' + (r.newsImpactScore >= 0 ? '+' : '') + r.newsImpactScore + ')</span>';

            tr.innerHTML = '' +
                '<td>' + r.symbol + '</td>' +
                '<td>' + (isFinite(r.price) ? '₹' + Math.round(r.price).toLocaleString('en-IN') : '—') + '</td>' +
                '<td>' + (isFinite(r.marketCapCr) ? formatCr(r.marketCapCr) : '—') + '</td>' +
                '<td>' + r.trend + '</td>' +
                '<td>' + (isFinite(r.support) ? '₹' + Math.round(r.support).toLocaleString('en-IN') : '—') + '</td>' +
                '<td>' + (isFinite(r.resistance) ? '₹' + Math.round(r.resistance).toLocaleString('en-IN') : '—') + '</td>' +
                '<td>' + newsPill + '</td>' +
                '<td>' + r.qualityScore + '/100</td>' +
                '<td>' + r.overallScore + '</td>';

            tr.addEventListener('click', function () {
                if (!els.inspect || !els.inspectPre) return;
                els.inspect.hidden = false;
                els.inspectPre.textContent = JSON.stringify(r, null, 2);
            });
            tr.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tr.click();
                }
            });

            els.tbody.appendChild(tr);
        });
    }

    function syncStateFromUI() {
        if (els.searchSymbol) state.search = els.searchSymbol.value.trim();
        if (els.trendFilter) state.trend = els.trendFilter.value;
        if (els.mcMin) state.mcMinCr = Number(els.mcMin.value || 0);
        if (els.newsImpact) state.news = els.newsImpact.value;
        if (els.qualityMin) state.qualityMin = Number(els.qualityMin.value || 0);
        if (els.sortBy) state.sortBy = els.sortBy.value;
    }

    function rerender() {
        syncStateFromUI();
        var rows = applyFilters(STOCK_ROWS.slice());
        renderTable(rows);
    }

    function wireUI() {
        if (els.searchSymbol) {
            els.searchSymbol.addEventListener('input', function () { rerender(); });
        }
        if (els.trendFilter) {
            els.trendFilter.addEventListener('change', function () { rerender(); });
        }
        if (els.mcMin) {
            els.mcMin.addEventListener('input', function () { rerender(); });
        }
        if (els.newsImpact) {
            els.newsImpact.addEventListener('change', function () { rerender(); });
        }
        if (els.qualityMin) {
            els.qualityMin.addEventListener('input', function () { rerender(); });
        }
        if (els.sortBy) {
            els.sortBy.addEventListener('change', function () { rerender(); });
        }

        if (els.refreshBtn) {
            els.refreshBtn.addEventListener('click', function () {
                STOCK_ROWS = buildStockRows();
                rerender();
            });
        }

        if (els.clearBtn) {
            els.clearBtn.addEventListener('click', function () {
                if (els.searchSymbol) els.searchSymbol.value = '';
                if (els.trendFilter) els.trendFilter.value = 'all';
                if (els.mcMin) els.mcMin.value = '0';
                if (els.newsImpact) els.newsImpact.value = 'all';
                if (els.qualityMin) els.qualityMin.value = '0';
                if (els.sortBy) els.sortBy.value = 'score';
                rerender();
            });
        }
    }

    wireUI();
    rerender();
})();


