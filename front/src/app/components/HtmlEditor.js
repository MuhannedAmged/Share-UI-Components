"use client";
import React from "react";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

const HtmlEditor = ({ code, setCode, classes = "", readOnly = false }) => {
  const { theme } = useTheme();
  const editorTheme = theme === "dark" ? oneDark : oneDark;

  return (
    <ReactCodeMirror
      value={code}
      readOnly={readOnly}
      height="100%"
      extensions={[html()]}
      theme={editorTheme}
      onChange={(val) => setCode(val)}
      className={"overflow-auto h-full " + classes}
    />
  );
};

export default HtmlEditor;
