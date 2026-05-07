"use client";
import React from "react";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

const CssEditor = ({ code, setCode, readOnly = false }) => {
  const { theme } = useTheme();
  const editorTheme = theme === "dark" ? oneDark : oneDark;

  return (
    <ReactCodeMirror
      value={code}
      readOnly={readOnly}
      height="100%"
      extensions={[css()]}
      theme={editorTheme}
      onChange={(val) => setCode(val)}
      className="overflow-auto h-full"
    />
  );
};

export default CssEditor;
