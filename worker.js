/**
 * DohunSound (도헌사운드) - Cloudflare Workers Entrypoint
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API endpoint: /api/schedule
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

    // Delegate static assets (index.html, single.mp3) to Cloudflare Workers Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("DohunSound Assets Not Found", { status: 404 });
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
    const duration = (Math.random() * 0.4 + 1.0).toFixed(1);

    const h = Math.floor(currentSec / 3600);
    const m = Math.floor((currentSec % 3600) / 60);
    const s = Math.floor(currentSec % 60);
    const timestamp = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    schedule.push({
      timeSec: currentSec,
      timestamp,
      duration: `${duration}s`,
      speed: `${speed}x`,
      type: "단발 '쿵'"
    });

    const silence = Math.floor(Math.random() * (420 - 60 + 1)) + 60;
    currentSec += silence + Math.ceil(parseFloat(duration));
  }

  return {
    title: "도헌사운드 10시간 극저음 서브우퍼 타임스탬프 (1분~7분 간격, 단발 '쿵')",
    totalDuration: "10:00:00",
    totalHits: schedule.length,
    events: schedule
  };
}
