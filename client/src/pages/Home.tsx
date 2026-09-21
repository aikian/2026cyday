import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Heart, Sparkles, X } from "lucide-react";

const A = `${import.meta.env.BASE_URL}assets/`;
const asset = (name: string) => `${A}${name}`;

const memories = [
  ["01_card_fruit_store.png", "① 과일 채소 (채)", "싱싱한 채소처럼 언제나 건강하길!", "fresh & happy"],
  ["02_card_gyeongsanggamyeong_park.png", "② 경상감영공원 (영)", "좋은 추억이 가득하길!", "good memories"],
  ["03_card_americano.png", "③ 아메리카노 (아)", "아이스아메리카노처럼 시원하고 행복한 하루하루!", "cool days"],
  ["04_card_isanghwa_birthplace.png", "④ 이상화 생가 (생)", "항상 생기가 가득하고 빛나는 너!", "shine on"],
  ["05_card_trash_bag.png", "⑤ 쓰레기봉투 (일)", "언제나 좋은 일들만 가득하길!", "good things"],
  ["06_card_kaci_architecture.png", "⑥ 한국건축 (축)", "축하할 일이 매일 늘어나길!", "more to celebrate"],
  ["07_card_cat_cafe.png", "⑦ 집사의 하루 (하)", "하고 싶은 일 다 하면서 지내자!", "do what you love"],
  ["08_card_happy_hair.png", "⑧ 해피 (해)", "언제나 해피한 너의 하루를 응원해!", "happy always"],
];

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    left: `${(i * 43) % 100}%`, delay: `${(i % 8) * 70}ms`, color: ["#f46b8a", "#efb04e", "#71aaa0", "#8a61c5"][i % 4],
  })), []);
  return <div className="poster-confetti" aria-hidden="true">{pieces.map((p, i) => <i key={i} style={{ left: p.left, background: p.color, animationDelay: p.delay }} />)}</div>;
}

function playBirthdayMelody() {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  let loopTimer: number | undefined;
  const start = () => {
    const notes = [392,392,440,392,523,494,392,392,440,392,587,523,392,392,784,659,523,494,440,698,698,659,523,587,523];
    const lengths = [0.22,0.22,0.42,0.42,0.42,0.72,0.22,0.22,0.42,0.42,0.42,0.72,0.22,0.22,0.42,0.42,0.42,0.42,0.72,0.22,0.22,0.42,0.42,0.42,0.9];
    let cursor = context.currentTime + 0.05;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index % 3 === 0 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, cursor);
      gain.gain.exponentialRampToValueAtTime(0.14, cursor + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, cursor + lengths[index] - 0.035);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(cursor);
      oscillator.stop(cursor + lengths[index]);
      cursor += lengths[index] + 0.035;
    });
    const cycleDuration = cursor - context.currentTime + 0.4;
    loopTimer = window.setTimeout(start, Math.ceil(cycleDuration * 1000));
  };
  context.resume().then(start).catch(start);
  window.addEventListener("pagehide", () => { if (loopTimer) window.clearTimeout(loopTimer); void context.close(); }, { once: true });
}

export default function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      setTilt({ x: (e.clientX / window.innerWidth - 0.5) * 5, y: (e.clientY / window.innerHeight - 0.5) * -5 });
    };
    const onOrientation = (e: DeviceOrientationEvent) => setTilt({ x: Math.max(-5, Math.min(5, (e.gamma || 0) / 7)), y: Math.max(-5, Math.min(5, ((e.beta || 0) - 35) / -7)) });
    window.addEventListener("mousemove", onPointer);
    window.addEventListener("deviceorientation", onOrientation);
    return () => { window.removeEventListener("mousemove", onPointer); window.removeEventListener("deviceorientation", onOrientation); };
  }, []);

  const openMemory = (index: number) => {
    setSelected(index);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 2400);
  };

  return (
    <main className={`poster-page ${introDone ? "is-ready" : "is-opening"}`}>
      {(celebrate || bursting) && <Confetti />}
      {bursting && <div className="gift-burst" aria-hidden="true"><span /><span /><span /></div>}
      <div className="poster-topbar"><span><Sparkles size={13} /> CYDAY 2026</span><span className="tilt-label">parallax / melody looping</span></div>
      <section className="poster-frame" style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}>
        <img className="poster-art" src={asset("final_poster_used_for_split.png")} alt="채영아 생일 축하해 포스터" />
        <div className="poster-sheen" aria-hidden="true" />
        <div className="poster-hotspots" aria-label="생일 축하 카드 사진들">
          {memories.map((memory, i) => <button key={memory[0]} className={`hotspot hotspot-${i + 1}`} onClick={() => openMemory(i)} aria-label={`${memory[1]} 카드 열기`}><span>♡</span></button>)}
        </div>
      </section>
      {selected !== null && <div className="memory-modal" role="dialog" aria-modal="true" aria-label="생일 카드 상세" onClick={() => setSelected(null)}><div className="memory-sheet" onClick={e => e.stopPropagation()}><button className="close-memory" onClick={() => setSelected(null)} aria-label="닫기"><X size={19} /></button><div className="memory-photo"><img src={asset(memories[selected][0])} alt={memories[selected][1]} /></div><div className="memory-details"><span className="memory-tag">FIELD NOTE / 0{selected + 1}</span><h2>{memories[selected][1]}</h2><p>{memories[selected][2]}</p><div className="memory-heart"><Heart fill="currentColor" size={16} /> {memories[selected][3]}</div></div></div></div>}
      {!introDone && <div className="opening-curtain"><div className="opening-rule" /><p className="opening-kicker">A PRIVATE EDITION / 2026</p><h2>For Chaeyoung</h2><p className="opening-copy">A living birthday poster,<br />assembled from eight little wishes.</p><button onClick={() => { playBirthdayMelody(); setBursting(true); setIntroDone(true); window.setTimeout(() => setBursting(false), 1450); }}>선물 열기 <ArrowDown size={15} /></button><span className="opening-foot">01 / 01 — open slowly · melody ready</span></div>}
    </main>
  );
}
