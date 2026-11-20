
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

export default function ResultPage({
  resultName,
  secondaryName,
  onAgain,
  onHome,
}: ResultPageProps) {
  const [showShare, setShowShare] = useState(false);

  const resultId = typeMap[resultName] || "peaceful";
  const profile = resultData[resultId];

  const secondaryId = secondaryName
    ? typeMap[secondaryName]
    : undefined;

  const secondaryProfile = secondaryId
    ? resultData[secondaryId]
    : undefined;

  const diagnosticNote =
    profile.pc?.diagnosticNote ||
    profile.mobile?.diagnosticNote ||
    defaultDiagnosticNote;

  const A = "/assets";

  return (
    <main className="result">
      {/* PC 结果页 */}
      <section
        className="result__desktop"
        style={{
          backgroundImage: `url("${profile.background.pc}")`,
        }}
      >
        <div className="result__desktop-frame">

          {/* PC 伴生体质弹窗 */}
          {secondaryProfile && (
            <div className="result__secondary-popup">
              <img
                src={`${A}/illustrations/asset_popup_result_secondarysecondarysecondary_type.png`}
                alt={`伴生体质：${secondaryProfile.typeName}`}
              />
            </div>
          )}

          <header className="result__header">
            ✦ 时愈堂 · 专属把脉报告 ✦
          </header>

          <div className="result__desktop-content">
            <div className="result__portrait">
              <img
                className="result__character"
                src={profile.characterImage}
                alt={profile.characterName}
              />

              <div className="result__guardian">
                <span>守护星</span>
                <strong>{profile.characterName}</strong>
              </div>

              <img
                className="result__badge"
                src={profile.badgeImage}
                alt={profile.badgeText}
              />
              <p className="result__badge-text">{profile.badgeText}</p>
            </div>

            <div className="result__details">
              <div className="result__type">
                <span>你的体质是</span>
                <h1>{profile.typeName}</h1>
              </div>

              <section className="result__traits">
                {profile.coreTraits.map((trait, index) => (
                  <p key={index}>{trait}</p>
                ))}
              </section>

              <section className="result__whisper">
                <img
                  src={`${A}/illustrations/asset_illustrated_popover_result_whisper.png`}
                  alt=""
                />
                <div>
                  <h2>{profile.whisperTitle}</h2>
                  <p>{profile.whisperText}</p>
                </div>
              </section>

              <section className="result__tags">
                <img
                  src={`${A}/illustrations/asset_illustrated_popover_result_tag_pc.png`}
                  alt=""
                />
                <div className="result__tag-list">
                  {profile.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="result__desktop-actions">
            <button type="button" onClick={onAgain}>
              <img
                src={`${A}/icons/result_navigation_again_pc.svg`}
                alt="再测一次"
              />
            </button>
            <button type="button" onClick={onHome}>
              <img
                src={`${A}/icons/result_navigation_home_pc.svg`}
                alt="首页合照"
              />
            </button>
            <button type="button" onClick={() => setShowShare(true)}>
              <img
                src={`${A}/icons/result_navigation_share_pc.svg`}
                alt="分享结果"
              />
            </button>
          </div>

          <p className="result__diagnostic">{diagnosticNote}</p>
        </div>
      </section>

      {/* Mobile 结果页 */}
      <section
        className="result__mobile"
        style={{
          backgroundImage: `url("${profile.background.mobile}")`,
        }}
      >

        {/* Mobile 伴生体质弹窗 */}
        {secondaryProfile && (
          <div className="result__secondary-popup">
            <img
              src={`${A}/illustrations/asset_popup_result_secondarysecondarysecondary_type.png`}
              alt={`伴生体质：${secondaryProfile.typeName}`}
            />
          </div>
        )}

        <header className="result__mobile-header">
          ✦ 时愈堂 · 专属把脉报告 ✦
        </header>

        <div className="result__mobile-profile">
          <div className="result__mobile-portrait">
            <img
              className="result__mobile-character"
              src={profile.characterImage}
              alt={profile.characterName}
            />
            <div className="result__mobile-guardian">
              <span>守护星</span>
              <strong>{profile.characterName}</strong>
            </div>
            <img
              className="result__mobile-badge"
              src={profile.badgeImage}
              alt={profile.badgeText}
            />
            <p>{profile.badgeText}</p>
          </div>

          <div className="result__mobile-type">
            <span>你的体质是</span>
            <h1>{profile.typeName}</h1>
          </div>
        </div>

        <section className="result__mobile-traits">
          {profile.coreTraits.map((trait, index) => (
            <p key={index}>{trait}</p>
          ))}
        </section>

        <section className="result__mobile-tags">
          {profile.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </section>

        <section className="result__mobile-whisper">
          <h2>{profile.whisperTitle}</h2>
          <p>{profile.whisperText}</p>
        </section>

        <div className="result__mobile-actions">
          <button type="button" onClick={onAgain}>
            <img
              src={`${A}/icons/result_navigation_again_mobile.svg`}
              alt="再测一次"
            />
          </button>
          <button type="button" onClick={onHome}>
            <img
              src={`${A}/icons/result_navigation_home_mobile.svg`}
              alt="首页合照"
            />
          </button>
          <button type="button" onClick={() => setShowShare(true)}>
            <img
              src={`${A}/icons/result_navigation_share_mobile.svg`}
              alt="分享结果"
            />
          </button>
        </div>

        <p className="result__mobile-diagnostic">{diagnosticNote}</p>

        <footer className="result__footer">
          《异境凉茶铺》 | 九大体质檐主守护星潮玩系列 | 深圳千雪影业有限公司
        </footer>
      </section>

      {/* 分享海报弹窗 */}
      {showShare && (
        <div
          className="result-share"
          onClick={() => setShowShare(false)}
        >
          <div
            className="result-share__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="result-share__close"
              type="button"
              onClick={() => setShowShare(false)}
              aria-label="关闭"
            >
              ×
            </button>

            <h2>✦ 专属把脉结果海报已生成</h2>

            <img
              className="result-share__poster"
              src={profile.share.posterImage}
              alt={profile.share.posterTitle}
            />

            <a
              className="result-share__download"
              href={profile.share.posterImage}
              download
            >
              下载高清海报
            </a>

            <p className="result-share__footer">
              异境凉茶铺｜九大体质檐主守护星｜深圳千雪影业有限公司
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
