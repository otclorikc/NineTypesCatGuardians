
import { useEffect, useMemo, useState } from "react";
import { groups, questions } from "../data/question";
import "./QuizPage.css";

const A = `${import.meta.env.BASE_URL}assets`;
const STORAGE_KEY = "nine-types-quiz-progress";
const LETTERS = ["A", "B", "C", "D"];

type Answers = Record<string, number>;

type SavedProgress = {
  current: number;
  answers: Answers;
};

type QuizPageProps = {
  onComplete: (main: string, secondary: string) => void;
};

const groupTextColors = [
  "#572F00",
  "#3d2c1b",
  "#2c2011",
  "#2c2011",
  "#e5c07b",
  "#e5c07b",
  "#2c2011",
  "#2c2011",
];

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data: SavedProgress = JSON.parse(saved);

        if (data && typeof data === "object") {
          setCurrent(
            Number.isInteger(data.current)
              ? Math.min(Math.max(data.current, 0), questions.length - 1)
              : 0
          );

          setAnswers(
            data.answers && typeof data.answers === "object"
              ? data.answers
              : {}
          );
        }
      }
    } catch (error) {
      console.error("读取答题进度失败：", error);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ current, answers })
      );
    } catch (error) {
      console.error("保存答题进度失败：", error);
    }
  }, [current, answers, loaded]);

  const scores = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          score: questions
            .filter((question) => question.group === group.id)
            .reduce(
              (total, question) => total + (answers[question.id] || 0),
              0
            ),
        }))
        .sort((a, b) => b.score - a.score),
    [answers]
  );

  const resultType = useMemo(() => {
    const [first, second] = scores;

    if (!first || first.score < 8) {
      return {
        main: "peaceful",
        secondary: "",
      };
    }

    if (
      second &&
      second.score >= 8 &&
      first.score - second.score <= 1
    ) {
      return {
        main: first.constitution,
        secondary: second.constitution,
      };
    }

    return {
      main: first.constitution,
      secondary: "",
    };
  }, [scores]);

  const question = questions[current];

  if (!question) return null;

  const group = groups.find((item) => item.id === question.group);
  if (!group) return null;

  const groupIndex = groups.findIndex((item) => item.id === group.id);
  const selected = answers[question.id];
  const progress = ((current + 1) / questions.length) * 100;

  function chooseAnswer(value: number) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));

    if (current < questions.length - 1) {
      setCurrent((previous) => previous + 1);
    } else {
      setShowSubmit(true);
    }
  }

  function goPrevious() {
    if (current > 0) {
      setCurrent((previous) => previous - 1);
    }
  }

  function confirmSubmit() {
    setShowSubmit(false);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("清除答题进度失败：", error);
    }

    onComplete(resultType.main, resultType.secondary);
  }

  return (
    <main className={`quiz quiz--group-${groupIndex + 1}`}>
{/* 当前组猫咪 */}
<div className="quiz__cat">
  <img
    src={`${A}/icons/asset_deco_test_cat_${String(
      groupIndex + 1
    ).padStart(2, "0")}.png`}
    alt=""
  />

  {/* 独立玻璃背景框 */}
  <div className="quiz__cat-label-bg" aria-hidden="true" />

  {/* 独立文字 */}
  <span
    className="quiz__cat-label"
    style={{ color: groupTextColors[groupIndex] || "#2c2011" }}
  >
    {group.catText}
  </span>
</div>
      {/* 答题进度 */}
      <section className="quiz__progress">
        <div className="quiz__progress-bg" aria-hidden="true" />

        <div className="quiz__progress-content">
          <span className="quiz__progress-label">把脉进度</span>

          <span className="quiz__progress-count">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(questions.length).padStart(2, "0")}
          </span>

          <span className="quiz__progress-percent">
            {Math.round(progress)}%
          </span>

          <div className="quiz__progress-track">
            <div
              className="quiz__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* 题目卡片 */}
      <section className="quiz__question-card">
        <div className="quiz__question-heading">
          <span className="quiz__number">
            #{String(current + 1).padStart(2, "0")}
          </span>

          <h1>{question.title}</h1>
        </div>
{/* 上一题 */}
{current > 0 && (
  <button
    type="button"
    className="quiz__previous"
    onClick={goPrevious}
  >
    ＜ 上一题
  </button>
)}
        <div className="quiz__options">
          {question.options.map((option, index) => {
            const value = index + 1;

            return (
              <button
                key={index}
                type="button"
                className={`quiz__option ${
                  selected === value ? "is-selected" : ""
                }`}
                onClick={() => chooseAnswer(value)}
              >
                <span className="quiz__option-letter">
                  {LETTERS[index]}
                </span>

                <span className="quiz__option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </section>

{/* 第32题提交确认弹窗 */}
{showSubmit && (
  <div className="quiz-modal">
    <div className="quiz-modal__panel">

      {/* PC 弹窗 */}
      <div className="quiz-modal__desktop">
        <img
          className="quiz-modal__image"
          src={`${A}/illustrations/asset_illustrated_popup_test_submit_pc.png`}
          alt=""
        />

        <h2 className="quiz-modal__pc-title">
  如果确定答案无误
</h2>
<h2 className="quiz-modal__pc-subtitle">
  檐主就准备开方子啦
</h2>

        <button
          type="button"
          className="quiz-modal__pc-confirm"
          onClick={confirmSubmit}
        >
          别吊胃口了
        </button>

        <button
          type="button"
          className="quiz-modal__close"
          onClick={() => setShowSubmit(false)}
          aria-label="关闭并返回修改"
        >
          ×
        </button>
      </div>

      {/* Mobile 弹窗 */}
      <div className="quiz-modal__mobile">
        <img
          className="quiz-modal__image"
          src={`${A}/illustrations/asset_illustrated_popup_test_submit_mobile.png`}
          alt=""
        />

        <h2 className="quiz-modal__mobile-title">
  如果确定答案无误
</h2>
<h2 className="quiz-modal__mobile-subtitle">
  檐主就准备开方子啦
</h2>

        <button
          type="button"
          className="quiz-modal__mobile-confirm"
          onClick={confirmSubmit}
        >
          ✦ 别吊胃口了 ✦
        </button>

        <button
          type="button"
          className="quiz-modal__close"
          onClick={() => setShowSubmit(false)}
          aria-label="关闭并返回修改"
        >
          ×
        </button>
      </div>

    </div>
  </div>
)}
    </main>
  );
}
