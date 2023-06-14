import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import type { UserFile } from "../services/UserFiles";

const CodeEditorContainer = styled.div`
  display: flex;
  width: 60vw;
  height: 90vh;
  flex-direction: column;
  align-items: stretch;
  border-right: 1px solid #808080;
`;

const CodeEditorOptionsMenu = styled.menu`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-direction: row;
  background-color: #f1f1f1;
  padding: 0;
  margin: 0;
  max-height: 75px;
  min-height: 75px;
`;

const DropdownMenu = styled(Dropdown.Menu)`
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
`;

const DropdownNoBorder = styled(Dropdown)`
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0;

  :focus {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  :hover {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background-color: green;
  }
`;

const DropdownToggle = styled(Dropdown.Toggle)`
  border-radius: 0px !important;
`;

const DropdownItem = styled(Dropdown.Item)`
  :hover {
    background-color: grey !important;
  }
  background-color: #f1f1f1;
`;

const CodeEditorSpan = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
  border-right: 1px solid #808080;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  align-items: center;
`;

type CurrentSettings = {
  theme: {
    background: string;
    text: string;
    border: string;
  };
};

const EditorCurrentSettings = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 20px;
  ${/*@ts-ignore*/ ""}
  border-top: 1px solid ${(props: CurrentSettings) => props.theme.border};
  border-bottom: 1px solid ${(props: CurrentSettings) => props.theme.border};
  background-color: ${(props: CurrentSettings) => props.theme.background};
  font-size: 0.75em;

  span {
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
    display: flex;
    color: ${(props: CurrentSettings) => props.theme.text};
  }
`;

export type CodeEditorProps = {
  saveUserFile: (
    filename: string,
    filecontent: string,
    filetype: string
  ) => void;
  getUserFile: (filename: string) => Promise<UserFile | null>;
  filenames: string[];
  currentFileIndex: number;
  setCurrentFileIndex: (index: number) => void;
};

const CodeEditor = ({
  saveUserFile,
  getUserFile,
  filenames,
  currentFileIndex,
  setCurrentFileIndex,
}: CodeEditorProps) => {
  const [language, setLanguage] = useState<string>("typescript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [defaultCodeExample, setDefaultCodeExample] = useState<string>(
    defaultExamplesByLanguage[
      language as keyof typeof defaultExamplesByLanguage
    ]
  );
  const [filename, setFilename] = useState<string>(
    filenames[currentFileIndex] || "trading_algo_0"
  );
  const [filecontent, setFilecontent] = useState<string>(defaultCodeExample);

  useEffect(() => {
    if (filenames.length === 0) return;

    setFilename(filenames[currentFileIndex]);

    getUserFile(filenames[currentFileIndex]).then((file) => {
      if (!file) return;

      setFilecontent(file.content);
      setLanguage(file.type);
    });
  }, [currentFileIndex, filenames]);

  const onChoseLanguage = (e: MouseEvent) => {
    //@ts-ignore
    const selectedLanguage: string = e.target.dataset.name;
    setLanguage(selectedLanguage);
  };

  const onChoseTheme = (e: MouseEvent) => {
    //@ts-ignore
    const selectedTheme: string = e.target.dataset.name;
    setTheme(selectedTheme);
  };

  const onChoseFilename = (e: MouseEvent) => {
    //@ts-ignore
    const selectedFilename: string = e.target.dataset.name;
    console.log(e);
    // setFilename(selectedFilename);
    setCurrentFileIndex(filenames.indexOf(selectedFilename));
  };

  const processChange = debounce((fileContent: string) => {
    saveUserFile(filename, fileContent, language);
  });

  useEffect(() => {
    setDefaultCodeExample(
      defaultExamplesByLanguage[
        language as keyof typeof defaultExamplesByLanguage
      ]
    );
  }, [language, theme]);

  const languages = ["typescript", "javascript", "python", "c", "go"];
  const renderedLanguages = languages.map((language: string, index: number) => {
    return (
      <DropdownItem
        className="button"
        key={index}
        data-name={language}
        onClick={onChoseLanguage}
      >
        {language}
      </DropdownItem>
    );
  });

  const languageDropdownMenu = (
    <DropdownNoBorder className="shadow-none">
      <DropdownToggle className="button shadow-none" variant="none">
        Language
      </DropdownToggle>

      <DropdownMenu>{renderedLanguages}</DropdownMenu>
    </DropdownNoBorder>
  );

  const themes = ["vs-dark", "light"];
  const renderedThemes = themes.map((theme, index) => {
    return (
      <DropdownItem
        className="button"
        key={index}
        data-name={theme}
        onClick={onChoseTheme}
      >
        {theme}
      </DropdownItem>
    );
  });

  const themeDropdownMenu = (
    <DropdownNoBorder className="shadow-none">
      <DropdownToggle className="button shadow-none" variant="none">
        Theme
      </DropdownToggle>

      <DropdownMenu>{renderedThemes}</DropdownMenu>
    </DropdownNoBorder>
  );

  const renderedFilenames = filenames.map((filename, index) => {
    return (
      <DropdownItem
        className="button"
        key={index}
        data-name={filename}
        onClick={onChoseFilename}
      >
        {filename}
      </DropdownItem>
    );
  });

  const fileDropdownMenu = (
    <DropdownNoBorder className="shadow-none">
      <DropdownToggle className="button shadow-none" variant="none">
        File
      </DropdownToggle>

      <DropdownMenu>{renderedFilenames}</DropdownMenu>
    </DropdownNoBorder>
  );

  return (
    <CodeEditorContainer id="code-editor-container">
      <CodeEditorOptionsMenu id="code-editor-options-menu">
        <CodeEditorSpan>Code Editor</CodeEditorSpan>
        {languageDropdownMenu}
        {themeDropdownMenu}
        {fileDropdownMenu}
      </CodeEditorOptionsMenu>

      <Editor
        height="90%"
        width="100%"
        defaultLanguage="typescript"
        theme={theme}
        defaultValue={defaultCodeExample}
        value={filecontent}
        language={language}
        onChange={(value, event) => {
          // console.log({value, event});
          processChange(value || "");
        }}
      />
      <EditorCurrentSettings
        id="code-editor-current-settings"
        theme={{
          background: theme === "vs-dark" ? "#4a4747" : "#ffffff",
          text: theme === "vs-dark" ? "#f1f1f1" : "#d94c0c", //'#5A5A5A',
          border: theme === "vs-dark" ? "#808080" : "#f1f1f1", //'#054f96',
        }}
      >
        <span>{filename}</span>
        <span>{language}</span>
        <span>{theme}</span>
      </EditorCurrentSettings>
    </CodeEditorContainer>
  );
};
export default CodeEditor;

/* Helpers & constants */

function debounce(func: (fileContent: string) => void, timeout: number = 300) {
  let timer: number;
  return (fileContent: string) => {
    clearTimeout(timer); //@ts-ignore
    timer = setTimeout(() => {
      func(fileContent);
    }, timeout);
  };
}

export const defaultExamplesByLanguage = {
  typescript: `
function foo(bar: number[] = [0,1,2,3,4,5,6]) {
  /*... your code here */
}
  `,
  javascript: `
function foo(bar = [0,1,2,3,4,5,6]) {
  /*... your code here */
}
  `,
  python: `
def foo(bar = [0,1,2,3,4,5,6]):
  #... your code here 
  `,
  c: `
void foo(double bar[7] = {0,1,2,3,4,5,6}) {
  /*... your code here */
}
  `,
  go: `
func foo(bar []float32 = [...]float32{0,1,2,3,4,5,6}) {
  /*... your code here */
}
  `,
};
