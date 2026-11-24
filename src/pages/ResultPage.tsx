
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
  const [showSecondary, setShowSecondary] = useState(false);
  const [hasViewedSecondary, setHasViewedSecondary] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const primaryId = typeMap[resultName] || "peaceful";
  const secondaryId = secondaryName
    ? typeMap[secondaryName]
    : undefined;

  const primaryProfile = resultData[primaryId];
  const secondaryProfile = secondaryId
    ? resultData[secondaryId]
    : undefined;

  const profile =
    showSecondary && secondaryProfile
      ? secondaryProfile
      : primaryProfile;

  const diagnosticNote =
    profile.pc?.diagnosticNote ||
    profile.mobile?.diagnosticNote ||
    defaultDiagnosticNote;

  const badgeParts = profile.badgeText.split(" ");

  function viewSecondary() {
    setHasViewedSecondary(true);
    setShowSecondary(true);
  }

  function toggleSecondary() {
    setShowSecondary((current) => !current);
  }

  function renderSecondaryControl(className: string) {
    if (!secondaryProfile) return null;

    return (
      <div className={className}>
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
    );
  }

  return (
    <main className="result">
      {/* ================= PC ================= */}
      <section
        className="result__desktop"
        style={{
          backgroundImage: `url("${profile.background.pc}")`,
        }}
      >
        <div className="result__desktop-frame">

          {renderSecondaryControl(
            "result__secondary-control result__secondary-control--pc"
          )}

          <header className="result__header">
            ✦ 时愈堂 · 专属把脉报告 ✦
          </header>

          <div className="result__desktop-content">

            {/* 左侧角色区域 */}
            <div className="result__portrait">

              <div className="result__portrait-title">
                守护星
              </div>

              <img
                className="result__character"
                src={profile.characterImage}
                alt={profile.characterName}
              />

              <strong className="result__guardian-name">
                {profile.characterName}
              </strong>

            </div>

            {/* 右侧内容区域 */}
            <div className="result__details">

              <div className="result__type">
                <span>你的体质是</span>
                <h1>{profile.typeName}</h1>
              </div>

              {/* 核心特质 */}
              <section className="result__traits">
                <h2>★ 核心特质</h2>

                <div className="result__traits-scroll">
                  {profile.coreTraits.map((trait, index) => (
                    <p key={index}>{trait}</p>
                  ))}
                </div>
              </section>

              {/* Tag 与悄悄话横向排列 */}
              <div className="result__support">

                <section className="result__tags">
                  <div className="result__tag-list">
                    {profile.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </section>

                <section className="result__whisper">
                  <h2>{profile.whisperTitle}</h2>
                  <p>{profile.whisperText}</p>
                </section>

              </div>

            </div>
          </div>

          {/* PC 徽章：覆盖在内容框右上方 */}
          <div className="result__badge">
            <img
              src={profile.badgeImage}
              alt=""
            />

            <div className="result__badge-text">
              <span>{badgeParts[0]}</span>
              <strong>{badgeParts.slice(1).join(" ")}</strong>
            </div>
          </div>

          {/* PC 导航 */}
          <nav className="result__desktop-actions">

            <button
              className="result-button result-button--again"
              type="button"
              onClick={onAgain}
            >
              ✦ 感觉不对，再测一次 ✦
            </button>

            <button
              className="result-button result-button--share"
              type="button"
              onClick={() => setShowShare(true)}
            >
              ✦ 分享结果，看专属动画 ✦
            </button>

            <button
              className="result-button result-button--home"
              type="button"
              onClick={onHome}
            >
              ✦ 还不够，看喵喵全家福 ✦
            </button>

          </nav>

          <p className="result__diagnostic">
            {diagnosticNote}
          </p>

        </div>
      </section>

      {/* ================= Mobile ================= */}
      <section
        className="result__mobile"
        style={{
          backgroundImage: `url("${profile.background.mobile}")`,
        }}
      >

        <header className="result__mobile-header">
          ✦ 时愈堂 · 专属把脉报告 ✦
        </header>

        {renderSecondaryControl(
          "result__mobile-secondary-control"
        )}

        {/* 移动端角色区 */}
        <section className="result__mobile-profile">

          <div className="result__mobile-type">
            <span>你的体质是</span>
            <strong>{profile.typeName}</strong>
          </div>

          <div className="result__mobile-badge-score">
            <span>{badgeParts[0]}</span>
            <strong>{badgeParts.slice(1).join(" ")}</strong>
          </div>

          <div className="result__mobile-guardian">
            <span>守护星为</span>
            <strong>{profile.characterName}</strong>
          </div>

          <div className="result__mobile-hero">

            {/* 徽章图在后 */}
            <img
              className="result__mobile-badge-image"
              src={profile.badgeImage}
              alt=""
            />

            {/* 角色图在前 */}
            <img
              className="result__mobile-character"
              src={profile.characterImage}
              alt={profile.characterName}
            />

          </div>

        </section>

        {/* 核心特质 */}
        <section className="result__mobile-traits">
          <h2>★ 核心特质</h2>

          <div className="result__mobile-traits-content">
            {profile.coreTraits.map((trait, index) => (
              <p key={index}>{trait}</p>
            ))}
          </div>
        </section>

        {/* Tag */}
        <section className="result__mobile-tags">
          {profile.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </section>

        {/* 悄悄话 */}
        <section className="result__mobile-whisper">
          <h2>{profile.whisperTitle}</h2>
          <p>{profile.whisperText}</p>
        </section>

        {/* 移动端导航 */}
        <nav className="result__mobile-actions">

          <button
            className="result-button result-button--share"
            type="button"
            onClick={() => setShowShare(true)}
          >
            ✦ 分享测试结果，看专属动画 ✦
          </button>

          <div className="result__mobile-actions-row">

            <button
              className="result-button result-button--again"
              type="button"
              onClick={onAgain}
            >
              ✦ 再测一次 ✦
            </button>

            <button
              className="result-button result-button--home"
              type="button"
              onClick={onHome}
            >
              ✦ 喵喵全家福 ✦
            </button>

          </div>

        </nav>

        {/* 诊断手册 */}
        <p className="result__mobile-diagnostic">
          {diagnosticNote}
        </p>

        <footer className="result__footer">
          《异境凉茶铺》 | 九大体质檐主守护星潮玩系列 | 深圳千雪影业有限公司
        </footer>

      </section>

      {/* ================= 分享弹窗 ================= */}
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
