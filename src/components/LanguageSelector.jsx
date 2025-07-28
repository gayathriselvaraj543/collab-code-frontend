import React from "react";

function LanguageSelector({ selectedLanguage, setSelectedLanguage }) {
  return (
    <div>
      <label htmlFor="language">Choose Language: </label>
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>

        <option value="java">Java</option>
      </select>
    </div>
  );
}

export default LanguageSelector;
