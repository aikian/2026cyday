import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Heart, Sparkles, Volume2, VolumeX } from "lucide-react";

const A = "/manus-storage/";
const photos = [
  ["/manus-storage/01_card_fruit_store_e30c059d.png", "우리의 알록달록한 하루", "어디를 가도 너와 함께면 작은 장면이 영화가 돼."],
  ["/manus-storage/02_card_gyeongsanggamyeong_park_d094ecd6.png", "천천히 걷던 오후", "이런 평범한 시간이 오래오래 기억에 남기를."],
  ["/manus-storage/03_card_americano_0b22e568.png", "한 잔의 여유", "네가 좋아하는 것들로 하루가 더 따뜻해져."],
  ["/manus-storage/04_card_isanghwa_birthplace_57fdf2a3.png", "같이 발견한 풍경", "올해도 새롭고 예쁜 장면들을 많이 만나자."],
  ["/manus-storage/07_card_cat_cafe_039a16f0.png", "귀여움 한 스푼", "웃음이 터지는 순간은 늘 예고 없이 찾아오니까."],
  ["/manus-storage/08_card_happy_hair_21a4e6cc.png", "가장 너다운 순간", "네가 너답게 빛나는 모든 순간을 응원해."],
];

const letters = [
  "/manus-storage/01_tile_chae_075999d4.png", "/manus-storage/02_tile_yeong_90af1a62.png",
  "/manus-storage/03_tile_a_f70f94bb.png", "/manus-storage/04_tile_saeng_1bd31357.png",
  "/manus-storage/05_tile_il_6064e021.png", "/manus-storage/06_tile_chuk_a6621d53.png",
  "/manus-storage/07_tile_ha_95811206.png", "/manus-storage/08_tile_hae_778cfebc.png",
];

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 54 }, (_, i) => ({
    left: `${(i * 37) % 100}%`, delay: `${(i % 11) * 0.08}s`, color: ["#f25b78", "#f6b44b", "#855fc4", "#6eaea0"][i % 4], rotate: `${(i * 31) % 180}deg`,
  })), []);
  return <div className="confetti" aria-hidden="true">{pieces.map((p, i) => <i key={i} style={{ left: p.left, animationDelay: p.delay, background: p.color, transform: `rotate(${p.rotate})` }} />)}</div>;
}

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({ x: x * 4, y: y * 4 });
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      setTilt({ x: Math.max(-7, Math.min(7, (e.gamma || 0) / 5)), y: Math.max(-7, Math.min(7, ((e.beta || 0) - 35) / 5)) });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("deviceorientation", onOrientation);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("deviceorientation", onOrientation); };
  }, []);

  const handleReveal = () => {
    requestMotionPermission();
    setRevealed(true);
    document.getElementById("memories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="birthday-page" ref={stageRef} style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` } as React.CSSProperties}>
      {revealed && <Confetti />}
      <div className="grain" />
      <header className="topbar">
        <span className="topbar-mark"><Sparkles size={14} /> CYDAY 2026</span>
        <button className="sound-button" onClick={() => setSoundOn(!soundOn)} aria-label="사운드 토글">{soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />} {soundOn ? "sound on" : "silent mode"}</button>
      </header>

      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">a little surprise, made just for you</p>
          <h1>채영아,<br /><em>생일 축하해!</em></h1>
          <p className="hero-lede">오늘의 주인공은 언제나처럼<br className="mobile-only" /> 너야. 우리가 모은 예쁜 순간들을<br className="mobile-only" /> 살짝 펼쳐볼게.</p>
          <button className="reveal-button" onClick={handleReveal}><span>선물 열어보기</span><ArrowDown size={18} /></button>
          <div className="scroll-cue"><span className="scroll-line" /> scroll to unwrap</div>
        </div>

        <div className="poster-wrap" style={{ transform: `rotateX(var(--tilt-y)) rotateY(var(--tilt-x))` }}>
          <div className="poster-shadow" />
          <div className="poster-card">
            <img className="poster-base" src={`${A}01_center_pink_wash_cfc147c7.png`} alt="핑크 종이 질감" />
            <img className="poster-decor decor-left" src={`${A}07_left_bouquet_and_mid_heart_da733f2b.png`} alt="꽃 장식" />
            <img className="poster-decor decor-right" src={`${A}08_right_flower_and_heart_5e1aeaa5.png`} alt="꽃과 하트 장식" />
            <img className="poster-decor decor-top" src={`${A}03_top_ribbon_778b6b4e.png`} alt="리본" />
            <img className="poster-decor decor-cat" src={`${A}11_cat_doodle_17271d7e.png`} alt="고양이 낙서" />
            <div className="poster-type">HAPPY<br /><span>BIRTHDAY</span></div>
            <div className="poster-name">CHAeyoung</div>
            <div className="poster-date">21 · 09 · 2026</div>
            <div className="tilt-hint"><span>✦</span> tilt your device <span>✦</span></div>
          </div>
        </div>
        <div className="hero-sticker sticker-one">for the<br /><strong>best day</strong></div>
        <div className="hero-sticker sticker-two">xoxo<br />♡</div>
      </section>

      <section className={`reveal-band ${revealed ? "is-revealed" : ""}`}>
        <div className="container reveal-inner">
          <div className="letter-tiles">{letters.map((src, i) => <img key={src} src={src} alt={i === 0 ? "채영 생일 축하 타이포그래피" : ""} />)}</div>
          <p>오늘 하루만큼은 네가 받는 사랑을<br />전부 느꼈으면 좋겠어.</p>
          <button className="circle-heart" onClick={() => document.getElementById("message")?.scrollIntoView({ behavior: "smooth" })}><Heart fill="currentColor" size={22} /></button>
        </div>
      </section>

      <section id="memories" className="memories-section container">
        <div className="section-intro"><p className="eyebrow">little moments, big love</p><h2>너와 함께라서<br /><em>더 반짝였던 장면들</em></h2><p>카드를 톡톡 눌러보면<br />사진 속 마음이 열려.</p></div>
        <div className="memory-grid">{photos.map(([src, title, copy], i) => <article key={src} className={`memory-card card-${i + 1} ${active === i ? "active" : ""}`} onClick={() => setActive(i)}><div className="photo-frame"><img src={src} alt={title} /><span className="photo-index">0{i + 1}</span></div><div className="memory-copy"><span>{title}</span><p>{copy}</p></div></article>)}</div>
        <div className="memory-controls"><button onClick={() => setActive((active + photos.length - 1) % photos.length)} aria-label="이전 카드"><ChevronLeft /></button><span>{String(active + 1).padStart(2, "0")} / 06</span><button onClick={() => setActive((active + 1) % photos.length)} aria-label="다음 카드"><ChevronRight /></button></div>
      </section>

      <section id="message" className="message-section">
        <img className="message-flower" src={`${A}14_bottom_right_note_and_flowers_f045d83c.png`} alt="꽃 장식" />
        <div className="message-paper">
          <span className="paper-label">a note for you</span>
          <h2>채영에게,</h2>
          <p>네가 태어난 날부터 세상이 조금 더 다정해졌다는 걸, 나는 매일 느껴.</p>
          <p>좋은 날도, 조금 지치는 날도 우리 같이 천천히 지나가자. 네가 좋아하는 것들로 가득한 한 해가 되길, 그리고 그 옆에 내가 오래오래 있길 바라.</p>
          <p className="signature">늘 너의 편, <strong>♡</strong></p>
          <div className="paper-stamp">LOVE<br /><span>YOU</span></div>
        </div>
      </section>
      <footer><span>made with all my heart</span><span>채영아, 오늘도 빛나</span></footer>
    </main>
  );
}

// Allow the browser to ask for motion access on iOS without interrupting the first paint.
export function requestMotionPermission() { const w = window as Window & { DeviceOrientationEvent?: typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> } }; return w.DeviceOrientationEvent?.requestPermission?.(); }
