import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { FaChevronDown } from "react-icons/fa6";

const MARKDOWN_MAX = 540;

export const Markdown: React.FC<{
  children: string;
  initialExpanded?: boolean;
  maxHeight?: number;
}> = ({ children, initialExpanded, maxHeight = MARKDOWN_MAX }) => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const [markdownExpanded, setMarkdownExpanded] = useState(initialExpanded);

  const markdownHeight = useMemo(
    () => markdownRef.current?.clientHeight || 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markdownRef.current]
  );
  const rewriteLinks = () => {
    const visit = require("unist-util-visit");

    return function transformer(tree: any) {
      visit.visit(tree, "link", (node: any) => {
        node.data = {
          ...node.data,
          hProperties: {
            ...(node.data || {}).hProperties,
            target: "_blank",
          },
        };
      });
    };
  };

  return (
    <div className="w-full flex flex-col mt-5 pb-5" ref={markdownRef}>
      <div
        style={{
          maxHeight: markdownExpanded ? undefined : maxHeight + "px",
          overflow: "hidden",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[rewriteLinks]}
          className="prose prose-headings:m-0 prose-headings:font-normal prose-hr:my-8 prose-p:text-foreground clear-both dark:prose-invert"
        >
          {children}
        </ReactMarkdown>
      </div>
      {markdownHeight > maxHeight && !markdownExpanded && (
        <div className="w-full flex flex-row justify-center items-center bg-card py-2">
          <Button
            variant="secondary"
            onClick={() => setMarkdownExpanded(true)}
            className="gap-2 w-full md:w-auto"
          >
            Show More <FaChevronDown />
          </Button>
        </div>
      )}
    </div>
  );
};
