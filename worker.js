/**
 * DohunSound (도헌사운드) - Cloudflare Workers Entrypoint
 * Handles static asset serving and lightweight sound schedule API
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API endpoint: /api/schedule
    // Generates a reproducible or random 10-hour schedule in JSON
    if (url.pathname === '/api/schedule') {
      const schedule = generateSchedule();
      return new Response(JSON.stringify(schedule, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: '도헌사운드 (DohunSound)', version: '1.0.0' }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // Default: Serve DohunSound Static Single Page App
    return new Response(HTML_CONTENT, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};

/**
 * Generate 10-Hour schedule items
 */
function generateSchedule() {
  const schedule = [];
  const totalTargetSec = 10 * 3600; // 10 Hours
  let currentSec = Math.floor(Math.random() * (180 - 60 + 1)) + 60; // Initial delay 1~3 min

  while (currentSec < totalTargetSec) {
    const speed = parseFloat((Math.random() * (1.8 - 0.5) + 0.5).toFixed(2));
    // 쿵쿵(2연타) 비중 25%, 단발 '쿵' 비중 75%
    const isDouble = Math.random() < 0.25;
    const duration = isDouble ? (Math.random() * 0.4 + 1.6).toFixed(1) : (Math.random() * 0.4 + 1.0).toFixed(1);

    const h = Math.floor(currentSec / 3600);
    const m = Math.floor((currentSec % 3600) / 60);
    const s = Math.floor(currentSec % 60);
    const timestamp = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    schedule.push({
      timeSec: currentSec,
      timestamp,
      duration: `${duration}s`,
      speed: `${speed}x`,
      type: isDouble ? "2연타 '쿵쿵'" : "단발 '쿵'"
    });

    // 1분(60초) ~ 7분(420초) 무작위 간격
    const silence = Math.floor(Math.random() * (420 - 60 + 1)) + 60;
    currentSec += silence + Math.ceil(parseFloat(duration));
  }

  return {
    title: "도헌사운드 10시간 극저음 서브우퍼 타임스탬프 (1분~7분 간격, 단발 75% / 2연타 25%)",
    totalDuration: "10:00:00",
    totalHits: schedule.length,
    events: schedule
  };
}

// Embedded Static HTML fallback for Workers Sites / Single-Worker deployment
const HTML_CONTENT = `<!-- Embedded index.html will be served or served via Workers Sites / Cloudflare Pages -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta http-equiv="refresh" content="0; url=/">
</head>
<body>
  Redirecting to DohunSound...
</body>
</html>
`;
