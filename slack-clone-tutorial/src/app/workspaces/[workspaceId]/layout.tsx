"use client";
import * as React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";

const WorkspaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-full">
      {/* 工具栏组件 */}
      <Toolbar />
      <div className=" flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};
export default WorkspaceLayout;
