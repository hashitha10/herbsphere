import React from "react";


export default function ARViewer({ model, usdz, alt }) {
  if (!model) return <p className="text-sm text-gray-500">3D not available</p>;
  return <model-viewer src={model} ios-src={usdz} alt={alt} ar camera-controls auto-rotate style={{ width: "100%", height: "280px" }} />;
}
