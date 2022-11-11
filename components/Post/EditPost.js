import React from 'react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function EditPost() {
  const [value, setValue] = useState("## Use markdown to write your post here\nWhen you're finished, use the post button to encrypt the content and post it to Lens.  You can use the access control button to decide who will be able to decrypt the post. \n\n\n\n");
  return (
    <div className='h-full  pt-32'>
      <MDEditor value={value} height ={400} onChange={setValue} />
    </div>
  );
}


