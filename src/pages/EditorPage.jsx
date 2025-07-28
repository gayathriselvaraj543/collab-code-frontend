
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import LanguageSelector from "../components/LanguageSelector";
import socket from "../socket";
import UserMenu from "../components/UserMenu";
import "./EditorPage.css";

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
};

const EditorPage = () => {
  const { roomID } = useParams();
  const location = useLocation();
  const username = location.state?.name || "Guest";

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const [codeByLanguage, setCodeByLanguage] = useState({
    javascript: "// Start coding JavaScript...",
    python: "# Start coding Python...",
    java: "// Start coding Java...",
    cpp: "// Start coding C++...",
  });

  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    socket.emit("join-room", { roomId: roomID, username });

    socket.on("code-update", ({ language, code }) => {
      setCodeByLanguage((prev) => ({
        ...prev,
        [language]: code,
      }));
    });

    socket.on("user-list", ({ activeUsers, allUsers }) => {
      setActiveUsers(activeUsers);
      setAllUsers(allUsers);
    });

    return () => {
      socket.off("code-update");
      socket.off("user-list");
    };
  }, [roomID, username]);

  const handleCodeChange = (value) => {
    // Update only selected language code
    setCodeByLanguage((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }));

    // Emit only the selected language code
    socket.emit("code-change", {
      roomId: roomID,
      language: selectedLanguage,
      code: value,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeByLanguage[selectedLanguage]);
    alert("📋 Code copied!");
  };

  const handleSave = () => {
    const blob = new Blob([codeByLanguage[selectedLanguage]], {
      type: "text/plain;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${selectedLanguage}`;
    a.click();
  };


  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("http://localhost:5000/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: codeByLanguage[selectedLanguage],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output || "No output.");
      } else {
        setOutput(data.error || "Error running code.");
      }
    } catch (err) {
      setOutput("Server error or network issue.");
    }

    setIsRunning(false);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-left">
          <h2>👩🏻‍💻Realtime Code Editor – Room: {roomID}</h2>
        </div>
        <div className="header-right">
          <UserMenu />
        </div>
      </div>
      
      <div className="sidebar">
        <div className="users-section">
          <h4>👥 Active Users:</h4>
          <ul>
            {activeUsers.length === 0 && <li>No active users</li>}
            {activeUsers.map((u) => (
              <li key={u.id}> 🟢 {u.username}</li>
            ))}
          </ul>

          <h4>🕒 Room History:</h4>
          <ul>
            {allUsers.map((u) => (
              <li key={u.username}>
                👤 {u.username}
                <span className="last-seen">
                  {new Date(u.lastSeen).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="main-editor">
        <div className="language-selector">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>

        <div className="codemirror-container">
          <CodeMirror
            value={codeByLanguage[selectedLanguage]}
            height="500px"
            theme={oneDark}
            extensions={[languageExtensions[selectedLanguage]]}
            onChange={handleCodeChange}
          />
        </div>

        <div className="editor-buttons">
          <button onClick={handleCopy}>📋 Copy</button>
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Running..." : "▶️ Run"}
          </button>
        </div>

  
        <div className="output-container">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
