import React, { useState } from "react";
import { Button } from "@cynaps/ui";
import { useAPI } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import "./Config.scss";

const generatorClass = cn("ai-generator");

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
    <div className={generatorClass} style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "#ececec" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "16px", fontWeight: "bold", background: "linear-gradient(90deg, #8b5cf6, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        ✨ AI Template Generator
      </h2>
      <p style={{ marginBottom: "24px", opacity: 0.8 }}>
        Describe the labeling task you want to create in natural language. Our Mistral AI Agent will automatically generate the correct Cynaps XML configuration for you.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <textarea
          style={{
            width: "100%",
            height: "150px",
            padding: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit"
          }}
          placeholder="E.g. I want to classify customer reviews into Positive, Negative, or Need Follow-up, and also highlight the specific product mentioned."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div style={{ padding: "12px", background: "rgba(2ef, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            look="primary"
            style={{
              background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
              border: "none",
              padding: "10px 24px",
              height: "auto",
              fontSize: "15px",
              fontWeight: 600
            }}
          >
            {loading ? "Generating..." : "Generate Magic Template"}
          </Button>
          <Button onClick={onCancel} disabled={loading} style={{ padding: "10px 24px", height: "auto" }}>
            Cancel
          </Button>
        </div>
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <h4 style={{ opacity: 0.7, marginBottom: "8px" }}>Example Prompts:</h4>
        <ul style={{ display: "flex", flexDirection: "column", gap: "8px", opacity: 0.8 }}>
          <li style={{ cursor: "pointer", padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }} onClick={() => setPrompt("Create a template for bounding box detection of cars, pedestrians, and traffic lights in images.")}>
            "Create a template for bounding box detection of cars, pedestrians, and traffic lights in images."
          </li>
          <li style={{ cursor: "pointer", padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }} onClick={() => setPrompt("I need to transcribe audio files and flag if there is background noise.")}>
            "I need to transcribe audio files and flag if there is background noise."
          </li>
        </ul>
      </div>
    </div>
  );
};
