
import "./HomePage.css";
import { resultData, type ResultId } from "../data/result";

type HomePageProps = {
  onStart: () => void;
};

const cardOrder: ResultId[] = [
  "damp_heat",
  "blood_stasis",
  "qi_stagnation",
  "special_diathesis",
  "peaceful",
  "qi_deficiency",
  "yang_deficiency",
  "yin_deficiency",
  "phlegm_dampness",
];

const mobileCardLayout: Record<
  ResultId,
  { left: number; top: number; rotate: number }
> = {
  damp_heat: { left: 94, top: 143, rotate: -20 },
  blood_stasis: { left: 116, top: 122, rotate: -16 },
  qi_stagnation: { left: 142, top: 107, rotate: -12 },
  special_diathesis: { left: 173, top: 98, rotate: -8 },
  peaceful: { left: 217, top: 92, rotate: 0 },
  qi_deficiency: { left: 246, top: 98, rotate: 8 },
  yang_deficiency: { left: 260, top: 106, rotate: 12 },
  yin_deficiency: { left: 271, top: 122, rotate: 16 },
  phlegm_dampness: { left: 279, top: 143, rotate: 20 },
};

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="home">
      <header className="home__nav">
        <div className="home__brand">✦ 檐主九大体质守护喵</div>

        <div className="home__nav-actions">
          <button
            className="home__button home__button--primary"
            type="button"
            onClick={onStart}
          >
            再测一遍 ✦
          </button>

          <span className="home__button home__button--secondary">
            潮玩众筹
          </span>
        </div>
      </header>

      <section className="home__gallery">
        <div className="home__gallery-heading">
          <h1>九大体质守护喵 · 全员集结</h1>
          <p className="home__gallery-hint home__gallery-hint--pc">
            点击查看更多守护喵
          </p>
          <p className="home__gallery-hint home__gallery-hint--mobile">
            滑动查看更多守护喵
          </p>
        </div>

        <div className="home__carousel home__carousel--pc">
          <div className="home__carousel-track">
            {cardOrder.map((id) => {
              const profile = resultData[id];

              return (
                <article
                  className={`home__card home__card--pc ${
                    id === "peaceful" ? "home__card--peaceful" : ""
                  }`}
                  key={id}
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.2), rgba(0,0,0,.2)), url("${profile.background.pc}")`,
                  }}
                >
                  <div className="home__card-character">
                    <img
                      src={profile.characterImage}
                      alt={profile.characterName}
                    />
                  </div>
                  <div className="home__card-name">
                    {profile.typeName} | {profile.characterName}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="home__carousel home__carousel--mobile">
          <div className="home__mobile-track">
            {cardOrder.map((id) => {
              const profile = resultData[id];
              const layout = mobileCardLayout[id];
              const isPeaceful = id === "peaceful";

              return (
                <article
                  className={`home__card home__card--mobile ${
                    isPeaceful ? "home__card--peaceful" : ""
                  }`}
                  key={id}
                  style={{
                    left: `${layout.left}px`,
                    top: `${layout.top}px`,
                    transform: `rotate(${layout.rotate}deg)`,
                    backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.2), rgba(0,0,0,.2)), url("${profile.background.mobile}")`,
                  }}
                >
                  <div className="home__card-character">
                    <img
                      src={profile.characterImage}
                      alt={profile.characterName}
                    />
                  </div>
                  <div className="home__card-name">
                    {isPeaceful
                      ? `${profile.typeName} | ${profile.characterName}`
                      : `${profile.typeName}·${profile.characterName}`}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="home__divider" />

      <section className="home__bottom">
        <div className="home__media-panel">
          <h2>📺 B站正版动画番剧 · 《异境凉茶铺》</h2>
          <div className="home__media-placeholder">
            <span>▶ 点击播放官方先行预告PV</span>
          </div>
        </div>

        <div className="home__support-panel">
          <h2>🐾 星心解忧 · 青少年情绪关怀与心理支持服务</h2>
          <div className="home__support-placeholder">
            <p>已累计向心理健康公益捐助资金 万元</p>
            <span>参与潮玩众筹，深圳市关爱行动公益基金会即捐赠 元</span>
          </div>
        </div>
      </section>

      <footer className="home__footer">
        ✦ 把脉虽严谨，结果仅娱乐 · 《异境凉茶铺》时愈堂 ✦
      </footer>
    </main>
  );
}
