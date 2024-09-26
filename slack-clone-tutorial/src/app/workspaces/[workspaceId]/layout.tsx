"use client";
import * as React from "react";
import { Toolbar } from "./toolbar";
const WorkspaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-full">
      {/* 工具栏组件 */}
      <Toolbar />
      {children}
    </div>
  );
};
export default WorkspaceLayout;
