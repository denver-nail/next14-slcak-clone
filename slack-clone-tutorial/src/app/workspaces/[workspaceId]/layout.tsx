"use client";
import * as React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSiderbar from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";

const WorkspaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { parentMessageId, onClose } = usePanel();
  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      {/* 工具栏组件 */}
      <Toolbar />

      <div className=" flex h-[calc(100vh-40px)]">
        {/* 侧边工具栏组件 */}
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel defaultSize={20} minSize={11}>
            <WorkspaceSiderbar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={29}>
            {children}
          </ResizablePanel>
          {/* 一对一聊天区域 */}
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                load s
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
export default WorkspaceLayout;
