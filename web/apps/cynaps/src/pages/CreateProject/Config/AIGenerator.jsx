import React, { useState } from "react";
import { Button } from "@cynaps/ui";
import { useAPI } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import "./Config.scss";

const generatorClass = cn("ai-generator");

const primaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "0 16px",
  height: "40px",
  minWidth: "160px",
  background: "#8b5cf6",
  border: "1px solid #8b5cf6",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Space Grotesk', system-ui, sans-serif",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const outlineButtonStyle = {
  ...primaryButtonStyle,
  background: "transparent",
  color: "#8b5cf6",
  minWidth: "90px",
};

export const AIGenerator = ({ project, setTemplate, onCancel }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useAPI();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.callApi("generateTemplate", {
        params: { pk: project.id },
        body: { prompt },
        errorFilter: () => true, // Bypass global error intercepts
      });

      if (response && response.xml_config) {
        setTemplate(response.xml_config);
      } else if (response && response.error) {
        setError(response.error);
      } else {
        setError("Failed to generate template. Unknown error.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={generatorClass} style={{ padding: "0 20px", maxWidth: "800px", margin: "20px auto 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <h1 className="text-2xl font-semibold mb-2">AI Template Generator</h1>
      <p className="mb-6 opacity-70 text-sm max-w-2xl">
        Describe the labeling task you want to create in natural language. Our Mistral AI Agent will automatically generate the correct Cynaps XML configuration for you.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <textarea
          className="CF-textarea-ls p-3 text-left"
          style={{ width: "100%", height: "120px", resize: "vertical" }}
          placeholder="E.g. I want to classify customer reviews into Positive, Negative, or Need Follow-up, and also highlight the specific product mentioned."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="p-3 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm text-left">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-2">
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139, 92, 246, 0.9)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#8b5cf6")}
          >
            {loading ? "Generating..." : "Generate Magic Template"}
          </button>
          
          <button
            type="button"
            style={outlineButtonStyle}
            onClick={onCancel}
            disabled={loading}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Cancel
          </button>
        </div>
      </div>
      
      <div className="mt-10 w-full max-w-2xl">
        <h4 className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-4">Example Prompts</h4>
        <ul className="flex flex-col gap-3">
          <li 
            className="cursor-pointer p-4 border border-white/10 rounded-md text-sm opacity-80 hover:bg-white/5 hover:border-white/20 transition-all text-left"
            onClick={() => setPrompt("Create a template for bounding box detection of cars, pedestrians, and traffic lights in images.")}
          >
            "Create a template for bounding box detection of cars, pedestrians, and traffic lights in images."
          </li>
          <li 
            className="cursor-pointer p-4 border border-white/10 rounded-md text-sm opacity-80 hover:bg-white/5 hover:border-white/20 transition-all text-left"
            onClick={() => setPrompt("I need to transcribe audio files and flag if there is background noise.")}
          >
            "I need to transcribe audio files and flag if there is background noise."
          </li>
        </ul>
      </div>
    </div>
  );
};
