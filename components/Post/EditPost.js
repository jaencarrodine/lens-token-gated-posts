import React from 'react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import {usePost} from "../../store/usePost";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function EditPost() {
  const postContent = usePost(state => state.postContent)
  const setPostContent = usePost(state => state.setPostContent)
  return (
    <div className='h-full  pt-4'>
      <MDEditor value={postContent} height ={400} onChange={setPostContent} />
    </div>
  );
}


