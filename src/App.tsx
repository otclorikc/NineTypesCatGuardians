
import { useState } from "react";
import CoverPage from "./pages/CoverPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";

type Page = "cover" | "quiz" | "result";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("cover");
  const [resultName, setResultName] = useState("");
  const [secondaryName, setSecondaryName] = useState("");

  if (currentPage === "quiz") {
    return (
      <QuizPage
        onComplete={(main, secondary) => {
          setResultName(main);
          setSecondaryName(secondary);
          setCurrentPage("result");
        }}
      />
    );
  }

  if (currentPage === "result") {
    return (
      <ResultPage
        resultName={resultName}
        secondaryName={secondaryName}
        onAgain={() => setCurrentPage("quiz")}
        onHome={() => setCurrentPage("cover")}
      />
    );
  }

  return (
    <main className="app">
      <CoverPage onStart={() => setCurrentPage("quiz")} />
    </main>
  );
}
