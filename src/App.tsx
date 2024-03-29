import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import Styles from "@/App.module.css";
import { DEFAULT_TEXT_DATA, DEFAULT_TEXT_TEMPLATE } from "@/default_values";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(detectPrefersDarkMode());
  const [isError, setIsError] = useState(false);
  const [isData, setIsData] = useState(false);
  const [textData, setTextData] = useState(DEFAULT_TEXT_DATA);
  const [textTemplate, setTextTemplate] = useState(DEFAULT_TEXT_TEMPLATE);
  const [textOutput, setTextOutput] = useState("");

  applyDarkMode(isDarkMode);

  const textInput = isData ? textData : textTemplate;

  function updateTextInput(e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    if (isData) {
      setTextData(text);
    } else {
      setTextTemplate(text);
    }
  }

  function handleKeydown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  function parseData() {
    try {
      const data = JSON.parse(textData);
      return {
        data,
        error_message: null,
      };
    } catch (e) {
      return {
        data: null,
        error_message: (e as Error).stack!,
      };
    }
  }

  async function updateResult() {
    const data = parseData();
    if (data.error_message != null) {
      setIsError(true);
      setTextOutput(data.error_message);
      return;
    }
    setIsError(false);
    setTextOutput("");
  }

  useEffect(() => {
    updateResult();
  }, [isError, textOutput, textData, textTemplate]);

  return (
    <>
      <nav className="navbar is-info">
        <div className="navbar-brand">
          <h2 className="navbar-item title">Live VTL Simulator</h2>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <span
              className={classNames(
                Styles.NavbarIcon,
                Styles.CursorPointer,
                "icon",
                "mr-5",
              )}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
            </span>
            <a
              href="https://github.com/sinofseven/live-vtl-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                Styles.NavbarIcon,
                "icon",
                "has-text-black",
              )}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </nav>
      <div className="container is-fullhd pt-5">
        <div className="columns">
          <div className="column">
            <div className="tabs">
              <ul>
                <li className={classNames({ "is-active": isData })}>
                  <a onClick={() => setIsData(true)}>data.json</a>
                </li>
                <li className={classNames({ "is-active": !isData })}>
                  <a onClick={() => setIsData(false)}>template.vtl</a>
                </li>
              </ul>
            </div>
            <textarea
              className={classNames("textarea", Styles.Editor)}
              value={textInput}
              onChange={updateTextInput}
              onKeyDown={handleKeydown}
            />
          </div>
          <div className="column">
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>Result</a>
                </li>
              </ul>
            </div>
            <textarea
              className={classNames("textarea", Styles.Editor, {
                "is-danger": isError,
              })}
              value={textOutput}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

function detectPrefersDarkMode(): boolean {
  const match = window.matchMedia("(prefers-color-scheme: dark)");
  return match.matches;
}

function applyDarkMode(isDarkMode: boolean) {
  const elm = document.getElementsByTagName("html")[0];
  elm.setAttribute("data-theme", isDarkMode ? "dark" : "light");
}
