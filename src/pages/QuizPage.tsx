import { useEffect, useMemo, useState } from "react";
import { groups, questions } from "../data/question";
import "./QuizPage.css";

const A = "/assets";
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
  "#572F00", "#3d2c1b", "#2c2011", "#2c2011",
  "#e5c07b", "#e5c07b", "#2c2011", "#2c2011",
];

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 读取本地进度
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
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  // 自动保存进度
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

  // 计算各组得分
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

  // 计算最终体质
  const resultType = useMemo(() => {
    const [first, second] = scores;

    if (!first || !second || first.score < 8) {
      return { main: "peaceful", secondary: "" };
    }

    if (second.score >= 8 && first.score - second.score <= 3) {
      return {
        main: first.id,
        secondary: second.id,
      };
    }

    return {
      main: first.id,
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

  // 选择答案后自动进入下一题
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

  // 返回上一题
  function goPrevious() {
    if (current > 0) {
      setCurrent((previous) => previous - 1);
    }
  }

  // 确认提交
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
    <main className="quiz">
      {/* 猫咪图标与文案 */}
      <div className="quiz__cat">
        <img
          src={`${A}/icons/asset_deco_test_cat_${String(groupIndex + 1).padStart(2, "0")}.png`}
          alt=""
        />
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
        <div className="quiz__progress-bg-mobile" aria-hidden="true" />

        <span className="quiz__progress-title">把脉进度</span>

        <div className="quiz__progress-track">
          <div
            className="quiz__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="quiz__progress-count">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(questions.length).padStart(2, "0")}
        </span>
      </section>

      {/* 题目卡片 */}
      <section className="quiz__card">
        <span className="quiz__number">
          {String(current + 1).padStart(2, "0")}
        </span>

        <h2 className="quiz__question">{question.title}</h2>

        {/* 答案选项 */}
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

      {/* 第32题提交确认弹窗 */}
      {showSubmit && (
        <div className="quiz__submit-overlay">
          {/* PC 弹窗 */}
          <div className="quiz__submit quiz__submit--pc">
            <p>如果确定答案无误</p>
            <button type="button" onClick={confirmSubmit}>
              确认提交
            </button>
          </div>

          {/* Mobile 弹窗 */}
          <div className="quiz__submit quiz__submit--mobile">
            <p>如果确定答案无误</p>
            <button type="button" onClick={confirmSubmit}>
              确认提交
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
