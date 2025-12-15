import React from "react";

export default function AudioGuide({ file }) {
  if (!file) return null;
  return (
    <div className="mt-3">
      <audio controls src={file} className="w-full" />
    </div>
  );
}
