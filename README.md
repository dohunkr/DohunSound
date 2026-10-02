# 도헌사운드 (DohunSound)

> **63Hz 이하 서브우퍼 극한 증폭(Overdrive) & 10시간 무작위 재생 스케줄러**  
> Cloudflare Workers & Pages 기반 고성능 웹 오디오 DSP 애플리케이션

---

## 🎛️ 주요 기능 및 오디오 DSP 스펙

1. **63Hz 이하 서브우퍼 전용 극저음 신호 합성**
   - 20Hz ~ 63Hz 대역 급강하 주파수 스윕(Down-sweep Sine + Triangle 서브 하모닉스)
   - 공진형 Biquad Low-Pass Filter 적용으로 63Hz 이상 고음 차단 및 타격감 극대화
2. **극한 볼륨 & 오버드라이브 (WaveShaper Distortion)**
   - 곡선 왜곡(WaveShaping Distortion Curve)을 통한 하드 클리핑(Hard Clipping) 및 과증폭
   - 게인 노드(GainNode) 0.5x ~ 5.0x 지원 (+6dB ~ +24dB 이상의 극한 증폭)
   - 실시간 우퍼 진동 반응 캔버스 시각화 및 반응형 플래시 효과
3. **무작위 템포 및 타격 질감 (0.5x ~ 1.8x)**
   - 각 타격음마다 0.5x ~ 1.8x 범위의 재생 속도(Playback Speed) 무작위 변동
   - 단발 타격('쿵') 단일 연출
4. **10시간 타임스탬프 스케줄러 및 무음 휴지기 (1분 ~ 20분)**
   - 1분 ~ 20분 사이의 불규칙한 무음 간격으로 10시간 자동 스케줄링
   - `hh:mm:ss n초 지속` 포맷 타임스탬프 계산 및 유튜브 설명란 안내문 원클릭 복사
5. **서버리스 최적화 아키텍처**
   - 10시간 대용량 파일 렌더링 시 발생하는 Cloudflare CPU Time Limit 한계를 해결하기 위해, 클라이언트 Web Audio API 절차적 실시간 합성 엔진을 탑재하여 0원의 서버 비용과 무제한 재생 구현

---

## 🚀 Cloudflare 배포 가이드 (Wrangler CLI)

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v18 이상 권장)
- Cloudflare 계정

### 2. 의존성 설치 및 Wrangler 로그인
```bash
npm install
npx wrangler login
```

### 3. 로컬 개발 환경 실행
```bash
npx wrangler dev
```
브라우저에서 `http://localhost:8787`에 접속하여 실시간 엔진과 사운드를 테스트합니다.

### 4. Cloudflare Workers 배포
```bash
npx wrangler deploy
```
배포 완료 시 즉시 `https://dohunsound.<your-subdomain>.workers.dev` 형태의 글로벌 라이브 도메인이 발급됩니다.

### 5. Cloudflare Pages로 배포 시 (대체 방식)
```bash
npx wrangler pages project create dohunsound
npx wrangler pages deploy . --project-name=dohunsound
```
