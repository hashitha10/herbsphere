// Simple fuzzy search utilities (Levenshtein distance + normalization)
export function normalize(s) {
  return (s || '').toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function levenshtein(a, b) {
  a = a || '';
  b = b || '';
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function fuzzySearch(query, items, { fields = ['commonName', 'scientificName', 'short'], maxResults = 10 } = {}) {
  const q = normalize(query);
  if (!q) return [];
  const scored = items.map((item) => {
    const hay = fields.map((f) => normalize(item[f] || '')).join(' ');
    const dist = levenshtein(q, hay);
    // Also compute indexOf score: prefer when q is substring
    const idx = hay.indexOf(q);
    const substringBonus = idx >= 0 ? -5 : 0; // lower score is better
    const score = dist + substringBonus;
    return { item, score };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, maxResults).map(s => s.item);
}

export function suggestCorrection(query, items) {
  const q = normalize(query);
  if (!q) return null;
  const candidates = items.map(p => p.commonName).map(normalize);
  let best = null;
  let bestDist = Infinity;
  for (const name of candidates) {
    const d = levenshtein(q, name);
    if (d < bestDist) {
      bestDist = d;
      best = name;
    }
  }
  // Suggest only if reasonably close (e.g., distance <= 3 or 25% of length)
  if (!best) return null;
  if (bestDist <= 3 || bestDist <= Math.max(1, Math.floor(best.length * 0.25))) {
    return best;
  }
  return null;
}
