"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { GenerateUIResponse, generateUISS } from "@/services/generateUISS";
import React, { useState } from "react";

export interface Element {
  type: string;
  label?: string;
  children?: Element[];
  attributes?: { name: string; value: string }[];
}

// const templateJSON: Element = {
//   type: "table",
//   children: [
//     {
//       type: "tr",
//       children: [
//         {
//           type: "th",
//           label: "Date",
//         },
//         {
//           type: "th",
//           label: "Bill File",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-01-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_01_01.pdf",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-02-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_02_01.pdf",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-02-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_02_01.pdf",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-02-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_02_01.pdf",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-02-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_02_01.pdf",
//         },
//       ],
//     },
//     {
//       type: "tr",
//       children: [
//         {
//           type: "td",
//           label: "2023-02-01",
//         },
//         {
//           type: "td",
//           label: "bill_2023_02_01.pdf",
//         },
//       ],
//     },

//   ],
// };

function renderElement(element: Element): React.ReactNode {
  console.log("ELEMENT: ", element);
  const { type, label, children, attributes } = element;

  const props = attributes?.reduce(
    (acc, { name, value }) => ({ ...acc, [name]: value }),
    {}
  );
  console.log("PROPS: ", props);

  // if (type === "input") {
  //   return React.createElement(type, { ...props, type: "text" });
  // }

  if (label) {
    const element = React.createElement(type, {...props}, label);
    console.log("ELEMENT: ", element);
    return element
  }

  if (children) {
    const element = React.createElement(type, {...props}, children.map((child) => renderElement(child)));
    console.log("ELEMENT: ", element);
    return element
  }

  return null;
}

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [apiResponse, setApiResponse] = useState<GenerateUIResponse | null>();
  const [templateJSON, setTemplateJSON] = useState<Element | null>(null);

  const handleGenerateUI = async () => {
    const response = await generateUISS({ user_input: userQuery });
    console.log("WORKING RESPONSE: ", response);
    if (response) {
      console.log("response not null");
      setTemplateJSON(parseGenerateUIFuncArgs(response.function.arguments));
    } 
    setApiResponse(response);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="user-query">Enter user query</Label>
          <Input
            id="user-query"
            placeholder="Generate a forms..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleGenerateUI}>Generate UI</Button>
          </div>
        </div>

        <div>
          <h2>Raw Output</h2>
          <div className="border border-gray-200 p-4 w-full">
            <p>{JSON.stringify(apiResponse)}</p>
          </div>
        </div>

        <div>
          <h2>Output HTML</h2>
          {templateJSON ? renderElement(templateJSON) : null}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
