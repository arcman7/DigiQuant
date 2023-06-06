import React, { useCallback, useState, useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';


const CodeEditorContainer = styled.div`
  display: flex;
  // justify-content: space-between;
  align-items: center;
  width: 60vh;
  height: 90vh;
  flex-direction: column;
`;

const CodeEditorOptionsMenu = styled.menu`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50px;
  flex-direction: row;
  background-color: #f1f1f1;
  padding: 0;
`;

const DropdownMenu = styled(Dropdown.Menu)`
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  padding-top: 6px;
`;

const DropdownNoBorder = styled(Dropdown)`
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0;

  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  font-weight: normal;
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



const CodeEditor = () => {
  const [language, setLanguage] = useState('typescript');
  const [theme, setTheme] = useState('vs-dark');
  const [defaultCodeExample, setDefaultCodeExample] = useState(defaultExamplesByLanguage[language as keyof typeof defaultExamplesByLanguage]);

  const onChoseLanguage = (e: MouseEvent) => {
    //@ts-ignore
    const selectedLanguage: string = e.target.dataset.name
    setLanguage(selectedLanguage);
  };

  const onChoseTheme = (e: MouseEvent) => {
    //@ts-ignore
    const selectedTheme: string = e.target.dataset.name
    setTheme(selectedTheme);
  };

  useEffect(() => {
    setDefaultCodeExample(
      defaultExamplesByLanguage[language as keyof typeof defaultExamplesByLanguage]
    );
  }, [language, theme]);

  const languages = ['typescript', 'javascript', 'python', 'c++', 'go'];
  const renderedLanguages = languages.map((language, index) => {
    return (
      <DropdownItem
        className="button"
        key={index}
        data-name={language}
        onClick={onChoseLanguage}
      >{language}
      </DropdownItem>
    );
  });

  const languageDropdownMenu = (
    <DropdownNoBorder className="shadow-none">
      <DropdownToggle className="button shadow-none" variant="none">
       Language
      </DropdownToggle>
      
      <DropdownMenu>
        {renderedLanguages}
      </DropdownMenu>
    </DropdownNoBorder>
  );

  const themes = ['vs-dark', 'light'];
  const renderedThemes = themes.map((theme, index) => {
    return (
      <DropdownItem
        className="button"
        key={index}
        data-name={theme}
        onClick={onChoseTheme}
      >{theme}
      </DropdownItem>
    );
  });

  const themeDropdownMenu = (
    <DropdownNoBorder className="shadow-none">
      <DropdownToggle className="button shadow-none" variant="none">
       Theme
      </DropdownToggle>
      
      <DropdownMenu>
        {renderedThemes}
      </DropdownMenu>
    </DropdownNoBorder>
  );

  return (
    <CodeEditorContainer id="code-editor-container">
      <CodeEditorOptionsMenu id="code-editor-options-menu">
        <CodeEditorSpan>
          Code Editor
        </CodeEditorSpan>
        {languageDropdownMenu}
        {themeDropdownMenu}
      </CodeEditorOptionsMenu>
      <Editor
        height="90%"
        width="100%"
        defaultLanguage="typescript"
        theme={theme}
        defaultValue={defaultCodeExample}
        value={defaultCodeExample}
        language={language}
      />
    </CodeEditorContainer>
  );
};  
export default CodeEditor;

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
  'c++': `
void foo(int bar[7] = {0,1,2,3,4,5,6}) {
  /*... your code here */
}
  `,
  go: `
func foo(bar []int = []int{0,1,2,3,4,5,6}) {
  /*... your code here */
}
  `,
};