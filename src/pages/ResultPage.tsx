import { useState } from "react";
import { resultData, type ResultId } from "../data/result";
import "./ResultPage.css";

type ResultPageProps = {
  resultName: string;
  secondaryName: string;
  onAgain: () => void;
  onHome: () => void;
};

const typeMap: Record<string, ResultId> = {
  平和质: "peaceful",
  气虚质: "qi_deficiency",
  阳虚质: "yang_deficiency",
  阴虚质: "yin_deficiency",
  痰湿质: "phlegm_dampness",
  湿热质: "damp_heat",
  血瘀质: "blood_stasis",
  气郁质: "qi_stagnation",
  特禀质: "special_diathesis",
};

const defaultDiagnosticNote =
  "时愈堂诊断手册：题目每4题一组，分别为气虚、阳虚、阴虚、痰湿、湿热、血瘀、气郁、特禀。若有单组≥8分，则判定为该组体质。若全组＜8分，则判定为天选平和体质。";

const A = "/assets";

export default function ResultPage({
  resultName,
  secondaryName,
  onAgain,
  onHome,
}: ResultPageProps) {
  const [showSecondary, setShowSecondary] = useState(false);
  const [hasViewedSecondary, setHasViewedSecondary] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const primaryId = typeMap[resultName] || "peaceful";
  const secondaryId = secondaryName ? typeMap[secondaryName] : undefined;
  const primaryProfile = resultData[primaryId];
  const secondaryProfile = secondaryId ? resultData[secondaryId] : undefined;
  const profile = showSecondary && secondaryProfile ? secondaryProfile : primaryProfile;

  const diagnosticNote =
    profile.pc?.diagnosticNote ||
    profile.mobile?.diagnosticNote ||
    defaultDiagnosticNote;

  function viewSecondary() {
    setHasViewedSecondary(true);
    setShowSecondary(true);
  }

  function toggleSecondary() {
    setShowSecondary((current) => !current);
  }

  return (
    <main className="result">
      {/* PC 结果页 */}
      <section
        className="result__desktop"
        style={{ backgroundImage: `url("${profile.background.pc}")` }}
      >
        <div className="result__desktop-frame">
          {secondaryProfile && (
            <div className="result__secondary-control result__secondary-control--pc">
              {!hasViewedSecondary ? (
                <button type="button" onClick={viewSecondary}>
                  恭喜拥有伴生体质，点击查看
                </button>
              ) : (
                <button type="button" onClick={toggleSecondary}>
                  {showSecondary ? "返回主体质" : "返回伴生体质"}
                </button>
              )}
            </div>
          )}

          <header className="result__header">✦ 时愈堂 · 专属把脉报告 ✦</header>

          <div className="result__desktop-content">
            <div className="result__portrait">
              <img className="result__character" src={profile.characterImage} alt={profile.characterName} />
              <div className="result__guardian">
                <span>守护星</span>
                <strong>{profile.characterName}</strong>
              </div>
              <img className="result__badge" src={profile.badgeImage} alt={profile.badgeText} />
              <p className="result__badge-text">{profile.badgeText}</p>
            </div>

            <div className="result__details">
              <div className="result__type">
                <span>你的体质是</span>
                <h1>{profile.typeName}</h1>
              </div>

              <section className="result__traits">
                {profile.coreTraits.map((trait, index) => <p key={index}>{trait}</p>)}
              </section>

              <section className="result__whisper">
                <h2>{profile.whisperTitle}</h2>
                <p>{profile.whisperText}</p>
              </section>

              <section className="result__tags">
                <div className="result__tag-list">
                  {profile.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </section>
            </div>
          </div>

          <div className="result__desktop-actions">
            <button type="button" onClick={onAgain}>再测一次</button>
            <button type="button" onClick={() => setShowShare(true)}>分享结果</button>
            <button type="button" onClick={onHome}>首页合照</button>
          </div>

          <p className="result__diagnostic">{diagnosticNote}</p>
        </div>
      </section>

      {/* Mobile 结果页 */}
      <section
        className="result__mobile"
        style={{ backgroundImage: `url("${profile.background.mobile}")` }}
      >
        {secondaryProfile && (
          <div className="result__mobile-secondary-control">
            {!hasViewedSecondary ? (
              <button
                className="result__mobile-secondary-button result__mobile-secondary-button--first"
                type="button"
                onClick={viewSecondary}
              >
                恭喜拥有伴生体质，点击查看
              </button>
            ) : showSecondary ? (
              <button
                className="result__mobile-secondary-button result__mobile-secondary-button--primary"
                type="button"
                onClick={toggleSecondary}
              >
                返回主体质
              </button>
            ) : (
              <button
                className="result__mobile-secondary-button result__mobile-secondary-button--secondary"
                type="button"
                onClick={toggleSecondary}
              >
                返回伴生体质
              </button>
            )}
          </div>
        )}

        <header className="result__mobile-header">✦ 时愈堂 · 专属把脉报告 ✦</header>

        <div className="result__mobile-profile">
          <div className="result__mobile-portrait">
            <img className="result__mobile-character" src={profile.characterImage} alt={profile.characterName} />
            <div className="result__mobile-guardian">
              <span>守护星</span>
              <strong>{profile.characterName}</strong>
            </div>
            <img className="result__mobile-badge" src={profile.badgeImage} alt={profile.badgeText} />
            <p>{profile.badgeText}</p>
          </div>
          <div className="result__mobile-type">
            <span>你的体质是</span>
            <h1>{profile.typeName}</h1>
          </div>
        </div>

        <section className="result__mobile-traits">
          {profile.coreTraits.map((trait, index) => <p key={index}>{trait}</p>)}
        </section>

        <section className="result__mobile-tags">
          {profile.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </section>

        <section className="result__mobile-whisper">
          <h2>{profile.whisperTitle}</h2>
          <p>{profile.whisperText}</p>
        </section>

        <div className="result__mobile-actions">
          <button type="button" onClick={onAgain}>
            <img src={`${A}/icons/result_navigation_again_mobile.svg`} alt="再测一次" />
          </button>
          <button type="button" onClick={() => setShowShare(true)}>
            <img src={`${A}/icons/result_navigation_share_mobile.svg`} alt="分享结果" />
          </button>
          <button type="button" onClick={onHome}>
            <img src={`${A}/icons/result_navigation_home_mobile.svg`} alt="首页合照" />
          </button>
        </div>

        <p className="result__mobile-diagnostic">{diagnosticNote}</p>
        <footer className="result__footer">
          《异境凉茶铺》 | 九大体质檐主守护星潮玩系列 | 深圳千雪影业有限公司
        </footer>
      </section>

      {showShare && (
        <div className="result-share" onClick={() => setShowShare(false)}>
          <div className="result-share__panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="result-share__close"
              type="button"
              onClick={() => setShowShare(false)}
              aria-label="关闭"
            >×</button>
            <h2>✦ 专属把脉结果海报已生成</h2>
            <img className="result-share__poster" src={profile.share.posterImage} alt={profile.share.posterTitle} />
            <a className="result-share__download" href={profile.share.posterImage} download>下载高清海报</a>
            <p className="result-share__footer">
              异境凉茶铺｜九大体质檐主守护星｜深圳千雪影业有限公司
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
