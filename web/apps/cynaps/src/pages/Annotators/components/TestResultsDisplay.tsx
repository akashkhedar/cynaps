import React from "react";
import type { TestResult, SpecialtyScore, TaskScore } from "../data/scoring";
import { SPECIALTIES } from "./SpecialtySelection";
import "./TestResultsDisplay.css";

// Badge icon for earned expertise
const BadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l2.09 6.26L21 9.27l-5.18 4.73L17.82 22 12 18.18 6.18 22l1.82-8 L3 9.27l6.91-1.01L12 2z" />
  </svg>
);

// SVG icons for specialties (matching SpecialtySelection)
const getSpecialtyIconSvg = (id: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "computer-vision": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    "natural-language-processing": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    "audiospeech-processing": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    "conversational-ai": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="12" y2="13" />
      </svg>
    ),
    "generative-ai": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <circle cx="9" cy="13" r="1" />
        <circle cx="15" cy="13" r="1" />
        <path d="M9 17h6" />
      </svg>
    ),
    "ranking-and-scoring": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  };
  return iconMap[id] || (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
};

interface EarnedBadge {
  name: string;
  category: string;
  specialization?: string | null;
  earned_at: string;
}

interface TestResultsDisplayProps {
  result: TestResult;
  earnedBadges?: EarnedBadge[];
  onRetry?: () => void;
  onContinue?: () => void;
}

export const TestResultsDisplay: React.FC<TestResultsDisplayProps> = ({
  result,
  earnedBadges = [],
  onRetry,
  onContinue,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSpecialtyName = (id: string) => {
    // Search by slug since SPECIALTIES now uses slug as identifier
    return SPECIALTIES.find((s) => s.slug === id)?.name || id;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "#22c55e";
    if (percentage >= 70) return "#8b5cf6";
    if (percentage >= 50) return "#fbbf24";
    return "#ef4444";
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="test-results">
      {/* Hero Section */}
      <div className={`test-results__hero ${result.passed ? "test-results__hero--passed" : "test-results__hero--failed"}`}>
        <div className="test-results__hero-content">
          <div className="test-results__status-icon">
            {result.passed ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <h1 className="test-results__title">
            {result.passed ? "Congratulations!" : "Almost There!"}
          </h1>
          <p className="test-results__subtitle">
            {result.passed
              ? "You've passed the annotation skill assessment."
              : `You need ${result.passingThreshold}% to pass. Keep practicing!`}
          </p>
        </div>
      </div>

      {/* Earned Badges Section - only show if badges were earned */}
      {earnedBadges.length > 0 && (
        <div className="test-results__badges-section">
          <div className="test-results__badges-header">
            <BadgeIcon />
            <h2>Badges Earned</h2>
          </div>
          <div className="test-results__badges-grid">
            {earnedBadges.map((badge, index) => (
              <div key={index} className="test-results__badge-card">
                <div className="test-results__badge-icon">
                  {getSpecialtyIconSvg(badge.category.toLowerCase().replace(/\s+/g, '-'))}
                </div>
                <div className="test-results__badge-info">
                  <div className="test-results__badge-name">{badge.name}</div>
                  {badge.specialization && (
                    <div className="test-results__badge-category">{badge.category}</div>
                  )}
                </div>
                <div className="test-results__badge-verified">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </div>
              </div>
            ))}
          </div>
          <p className="test-results__badges-info">
            Your badges are now visible on your profile and will help match you with relevant projects.
          </p>
        </div>
      )}

      {/* Score Overview */}
      <div className="test-results__overview">
        <div className="test-results__score-card test-results__score-card--main">
          <div className="test-results__score-label">Overall Score</div>
          <div
            className="test-results__score-value"
            style={{ color: getGradeColor(result.percentage) }}
          >
            {result.percentage.toFixed(1)}%
          </div>
          <div className="test-results__score-grade" style={{ background: getGradeColor(result.percentage) }}>
            Grade: {getGrade(result.percentage)}
          </div>
        </div>

        <div className="test-results__stats">
          <div className="test-results__stat">
            <span className="test-results__stat-value">{result.earnedPoints}</span>
            <span className="test-results__stat-label">/ {result.totalPoints} points</span>
          </div>
          <div className="test-results__stat">
            <span className="test-results__stat-value">{Object.keys(result.specialtyScores).length}</span>
            <span className="test-results__stat-label">specialties tested</span>
          </div>
          <div className="test-results__stat">
            <span className="test-results__stat-value">{formatTime(result.timeTaken)}</span>
            <span className="test-results__stat-label">time taken</span>
          </div>
        </div>
      </div>

      {/* Specialty Breakdown */}
      <div className="test-results__section">
        <h2 className="test-results__section-title">Performance by Specialty</h2>
        <div className="test-results__specialty-grid">
          {Object.values(result.specialtyScores).map((specialty: SpecialtyScore) => (
            <div
              key={specialty.specialty}
              className={`test-results__specialty-card ${specialty.passed ? "test-results__specialty-card--passed" : "test-results__specialty-card--failed"}`}
            >
              <div className="test-results__specialty-header">
                <span className="test-results__specialty-icon">
                  {getSpecialtyIconSvg(specialty.specialty)}
                </span>
                <span className="test-results__specialty-name">
                  {getSpecialtyName(specialty.specialty)}
                </span>
                {specialty.passed ? (
                  <span className="test-results__specialty-badge test-results__specialty-badge--passed">
                    Passed
                  </span>
                ) : (
                  <span className="test-results__specialty-badge test-results__specialty-badge--failed">
                    Failed
                  </span>
                )}
              </div>
              <div className="test-results__specialty-score">
                <div className="test-results__specialty-percentage">
                  {specialty.percentage.toFixed(0)}%
                </div>
                <div className="test-results__specialty-points">
                  {specialty.earnedPoints} / {specialty.totalPoints} pts
                </div>
              </div>
              <div className="test-results__specialty-bar">
                <div
                  className="test-results__specialty-bar-fill"
                  style={{
                    width: `${specialty.percentage}%`,
                    background: specialty.passed ? "#8b5cf6" : "#ef4444",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Details */}
      <div className="test-results__section">
        <h2 className="test-results__section-title">Task-by-Task Results</h2>
        <div className="test-results__tasks">
          {result.taskScores.map((task: TaskScore, index: number) => (
            <div key={task.testCaseId} className="test-results__task">
              <div className="test-results__task-header">
                <div className="test-results__task-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="test-results__task-info">
                  <div className="test-results__task-title">{task.title}</div>
                  <div className="test-results__task-specialty">
                    <span className="test-results__task-specialty-icon">{getSpecialtyIconSvg(task.specialty)}</span>
                    {getSpecialtyName(task.specialty)}
                  </div>
                </div>
                <div className="test-results__task-score">
                  <span
                    className="test-results__task-percentage"
                    style={{ color: getGradeColor(task.percentage) }}
                  >
                    {task.percentage.toFixed(0)}%
                  </span>
                  <span className="test-results__task-points">
                    {task.earnedPoints} / {task.maxPoints}
                  </span>
                </div>
              </div>
              <div className="test-results__task-feedback">{task.feedback}</div>
              {task.details.length > 0 && (
                <div className="test-results__task-details">
                  {task.details.map((detail, i) => (
                    <div
                      key={i}
                      className={`test-results__task-detail ${detail.match ? "test-results__task-detail--correct" : "test-results__task-detail--incorrect"}`}
                    >
                      <span className="test-results__detail-icon">
                        {detail.match ? "✓" : "✗"}
                      </span>
                      <span className="test-results__detail-text">
                        Your answer: <strong>{detail.annotation}</strong>
                        {!detail.match && (
                          <> — Expected: <strong>{detail.expected}</strong></>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="test-results__actions">
        {!result.passed && onRetry && (
          <button
            type="button"
            className="test-results__button test-results__button--secondary"
            onClick={onRetry}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Retry Test
          </button>
        )}
        {result.passed && onContinue && (
          <button
            type="button"
            className="test-results__button test-results__button--primary"
            onClick={onContinue}
          >
            Continue to Dashboard
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
