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

export default function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);

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

  const openMemory = (index: number) => { setSelected(index); setCelebrate(true); window.setTimeout(() => setCelebrate(false), 2400); };

  return (
    <main className="poster-page">
      {celebrate && <Confetti />}
      <div className="poster-topbar"><span><Sparkles size={13} /> CYDAY 2026</span><span className="tilt-label">tilt / tap the cards</span></div>
      <section className="poster-frame" style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}>
        <img className="poster-art" src={asset("final_poster_used_for_split.png")} alt="채영아 생일 축하해 포스터" />
        <div className="poster-hotspots" aria-label="생일 축하 카드 사진들">
          {memories.map((memory, i) => <button key={memory[0]} className={`hotspot hotspot-${i + 1}`} onClick={() => openMemory(i)} aria-label={`${memory[1]} 카드 열기`}><span>♡</span></button>)}
        </div>
        <button className="poster-scroll" onClick={() => document.getElementById("after-poster")?.scrollIntoView({ behavior: "smooth" })} aria-label="아래로 스크롤"><ArrowDown size={16} /></button>
      </section>
      <section id="after-poster" className="after-poster"><p className="after-kicker">a tiny interactive surprise</p><h1>포스터 속 카드를<br /><em>톡톡 눌러봐</em></h1><p>사진마다 채영이를 위한 작은 문장이 숨어 있어.<br />기기를 살짝 기울이면 포스터도 같이 흔들려.</p><div className="after-line"><span /> 08 little wishes <span /></div></section>
      {selected !== null && <div className="memory-modal" role="dialog" aria-modal="true" aria-label="생일 카드 상세" onClick={() => setSelected(null)}><div className="memory-sheet" onClick={e => e.stopPropagation()}><button className="close-memory" onClick={() => setSelected(null)} aria-label="닫기"><X size={19} /></button><div className="memory-photo"><img src={asset(memories[selected][0])} alt={memories[selected][1]} /></div><div className="memory-details"><span className="memory-tag">{memories[selected][3]}</span><h2>{memories[selected][1]}</h2><p>{memories[selected][2]}</p><div className="memory-heart"><Heart fill="currentColor" size={16} /> for chaeyoung</div></div></div></div>}
    </main>
  );
}
