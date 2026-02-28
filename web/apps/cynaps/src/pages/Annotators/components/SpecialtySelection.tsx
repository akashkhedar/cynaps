import React, { useState, useEffect } from "react";
import { Spinner } from "@cynaps/ui";
import "./SpecialtySelection.css";

// Types matching the backend API
export interface Specialization {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  min_test_questions: number;
  passing_score: number;
  requires_certification: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  specializations: Specialization[];
}

export interface SelectedExpertise {
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  specializationId?: number;
  specializationSlug?: string;
  specializationName?: string;
}

// Map category slugs to icon types
const getIconType = (slug: string): "cv" | "nlp" | "audio" | "chat" | "ai" | "ranking" => {
  const iconMap: Record<string, "cv" | "nlp" | "audio" | "chat" | "ai" | "ranking"> = {
    "computer-vision": "cv",
    "natural-language-processing": "nlp",
    "audiospeech-processing": "audio",
    "conversational-ai": "chat",
    "generative-ai": "ai",
    "ranking-and-scoring": "ranking",
  };
  return iconMap[slug] || "cv";
};

// SVG icons for each specialty
const SpecialtyIcon: React.FC<{ type: "cv" | "nlp" | "audio" | "chat" | "ai" | "ranking" }> = ({ type }) => {
  const icons = {
    cv: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    nlp: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    audio: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    chat: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="12" y2="13" />
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <circle cx="9" cy="13" r="1" />
        <circle cx="15" cy="13" r="1" />
        <path d="M9 17h6" />
      </svg>
    ),
    ranking: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  };
  return <div className="specialty-icon">{icons[type]}</div>;
};

// Fallback data if API fails
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1, name: "Computer Vision", slug: "computer-vision",
    description: "Image classification, object detection, segmentation, and OCR tasks",
    icon: "cv", specializations: [],
  },
  {
    id: 2, name: "Natural Language Processing", slug: "natural-language-processing",
    description: "Text classification, named entity recognition, and sentiment analysis",
    icon: "nlp", specializations: [],
  },
  {
    id: 3, name: "Audio & Speech Processing", slug: "audiospeech-processing",
    description: "Audio transcription, speaker identification, and sound classification",
    icon: "audio", specializations: [],
  },
  {
    id: 4, name: "Conversational AI", slug: "conversational-ai",
    description: "Dialogue quality assessment, intent classification, and response rating",
    icon: "chat", specializations: [],
  },
  {
    id: 5, name: "Generative AI", slug: "generative-ai",
    description: "LLM response evaluation, content quality rating, and comparison tasks",
    icon: "ai", specializations: [],
  },
  {
    id: 6, name: "Ranking & Scoring", slug: "ranking-and-scoring",
    description: "Content ranking, relevance scoring, and preference comparison",
    icon: "ranking", specializations: [],
  },
];

interface SpecialtySelectionProps {
  onConfirm: (selectedSpecialties: string[], expertiseData: SelectedExpertise[]) => void;
  isLoading?: boolean;
}

export const SpecialtySelection: React.FC<SpecialtySelectionProps> = ({
  onConfirm,
  isLoading = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<SelectedExpertise[]>([]);
  const [view, setView] = useState<"categories" | "specializations">("categories");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/annotators/expertise/categories", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: Category) => {
    if (category.specializations && category.specializations.length > 0) {
      // Show specializations for this category
      setSelectedCategory(category);
      setView("specializations");
    } else {
      // No specializations, add the category itself as expertise
      toggleExpertise({
        categoryId: category.id,
        categorySlug: category.slug,
        categoryName: category.name,
      });
    }
  };

  const toggleExpertise = (expertise: SelectedExpertise) => {
    setSelectedExpertise((prev) => {
      const key = expertise.specializationId
        ? `${expertise.categoryId}-${expertise.specializationId}`
        : `${expertise.categoryId}`;
      
      const exists = prev.some(
        (e) =>
          e.categoryId === expertise.categoryId &&
          e.specializationId === expertise.specializationId
      );

      if (exists) {
        return prev.filter(
          (e) =>
            !(e.categoryId === expertise.categoryId &&
              e.specializationId === expertise.specializationId)
        );
      }
      return [...prev, expertise];
    });
  };

  const isExpertiseSelected = (categoryId: number, specializationId?: number) => {
    return selectedExpertise.some(
      (e) =>
        e.categoryId === categoryId &&
        e.specializationId === specializationId
    );
  };

  const handleBack = () => {
    setView("categories");
    setSelectedCategory(null);
  };

  const handleConfirm = () => {
    if (selectedExpertise.length > 0) {
      // Convert to legacy format for test case lookup
      const slugs = selectedExpertise.map(
        (e) => e.specializationSlug || e.categorySlug
      );
      onConfirm(slugs, selectedExpertise);
    }
  };

  const totalTests = selectedExpertise.length * 3; // Approximate tests per expertise

  if (loading) {
    return (
      <div className="specialty-selection" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <Spinner size={32} />
      </div>
    );
  }

  // Specialization selection view
  if (view === "specializations" && selectedCategory) {
    return (
      <div className="specialty-selection">
        <div className="specialty-selection__header">
          <button className="specialty-selection__back" onClick={handleBack} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
          <div className="specialty-selection__number">02/</div>
          <h1 className="specialty-selection__title">Select Expertise in {selectedCategory.name}</h1>
          <p className="specialty-selection__subtitle">
            Choose specific skills you want to be tested on. Passing each test earns you a badge.
          </p>
        </div>

        <div className="specialty-selection__grid">
          {/* Option to select the whole category */}
          <button
            type="button"
            className={`specialty-card specialty-card--category ${
              isExpertiseSelected(selectedCategory.id) ? "specialty-card--selected" : ""
            }`}
            onClick={() =>
              toggleExpertise({
                categoryId: selectedCategory.id,
                categorySlug: selectedCategory.slug,
                categoryName: selectedCategory.name,
              })
            }
          >
            <SpecialtyIcon type={getIconType(selectedCategory.slug)} />
            <div className="specialty-card__content">
              <h3 className="specialty-card__name">{selectedCategory.name} (General)</h3>
              <p className="specialty-card__description">
                General {selectedCategory.name.toLowerCase()} skills covering all areas
              </p>
              <div className="specialty-card__meta">
                <span className="specialty-card__badge">Category Badge</span>
              </div>
            </div>
            <div className="specialty-card__checkbox">
              {isExpertiseSelected(selectedCategory.id) ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <div className="specialty-card__checkbox-empty" />
              )}
            </div>
          </button>

          {/* Individual specializations */}
          {selectedCategory.specializations.map((spec) => (
            <button
              key={spec.id}
              type="button"
              className={`specialty-card ${
                isExpertiseSelected(selectedCategory.id, spec.id) ? "specialty-card--selected" : ""
              }`}
              onClick={() =>
                toggleExpertise({
                  categoryId: selectedCategory.id,
                  categorySlug: selectedCategory.slug,
                  categoryName: selectedCategory.name,
                  specializationId: spec.id,
                  specializationSlug: spec.slug,
                  specializationName: spec.name,
                })
              }
            >
              <SpecialtyIcon type={getIconType(selectedCategory.slug)} />
              <div className="specialty-card__content">
                <h3 className="specialty-card__name">{spec.name}</h3>
                <p className="specialty-card__description">{spec.description}</p>
                <div className="specialty-card__meta">
                  <span className="specialty-card__badge">Specialty Badge</span>
                  <span className="specialty-card__passing">Pass: {spec.passing_score}%</span>
                </div>
              </div>
              <div className="specialty-card__checkbox">
                {isExpertiseSelected(selectedCategory.id, spec.id) ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div className="specialty-card__checkbox-empty" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="specialty-selection__footer">
          <div className="specialty-selection__summary">
            {selectedExpertise.length > 0 ? (
              <>
                <span className="specialty-selection__count">
                  {selectedExpertise.length} expertise selected
                </span>
                <span className="specialty-selection__divider">•</span>
                <span className="specialty-selection__hint">
                  Pass at least 1 to unlock dashboard access
                </span>
              </>
            ) : (
              <span className="specialty-selection__hint">
                Select at least one expertise to continue
              </span>
            )}
          </div>
          <button
            type="button"
            className="specialty-selection__confirm"
            onClick={handleConfirm}
            disabled={selectedExpertise.length === 0 || isLoading}
          >
            {isLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Spinner size={16} />
                <span>Loading tests...</span>
              </div>
            ) : (
              <>
                Start Test
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Category selection view (default)
  return (
    <div className="specialty-selection">
      <div className="specialty-selection__header">
        <div className="specialty-selection__number">01/</div>
        <h1 className="specialty-selection__title">Select Your Expertise</h1>
        <p className="specialty-selection__subtitle">
          Choose the annotation areas you're skilled in. You'll earn badges for each expertise you pass.
        </p>
      </div>

      <div className="specialty-selection__grid">
        {categories.map((category) => {
          const hasSpecializations = category.specializations && category.specializations.length > 0;
          const isSelected = selectedExpertise.some((e) => e.categoryId === category.id);
          
          return (
            <button
              key={category.id}
              type="button"
              className={`specialty-card ${isSelected ? "specialty-card--selected" : ""}`}
              onClick={() => handleCategorySelect(category)}
            >
              <SpecialtyIcon type={getIconType(category.slug)} />
              <div className="specialty-card__content">
                <h3 className="specialty-card__name">{category.name}</h3>
                <p className="specialty-card__description">{category.description}</p>
                <div className="specialty-card__meta">
                  {hasSpecializations ? (
                    <span className="specialty-card__specs">
                      {category.specializations.length} specializations
                    </span>
                  ) : (
                    <span className="specialty-card__tests">3 test tasks</span>
                  )}
                </div>
              </div>
              <div className="specialty-card__arrow">
                {hasSpecializations ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                ) : isSelected ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div className="specialty-card__checkbox-empty" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="specialty-selection__footer">
        <div className="specialty-selection__summary">
          {selectedExpertise.length > 0 ? (
            <>
              <span className="specialty-selection__count">
                {selectedExpertise.length} expertise selected
              </span>
              <span className="specialty-selection__divider">•</span>
              <span className="specialty-selection__total-tests">
                ~{totalTests} test tasks
              </span>
            </>
          ) : (
            <span className="specialty-selection__hint">
              Select a category to view expertise options
            </span>
          )}
        </div>
        <button
          type="button"
          className="specialty-selection__confirm"
          onClick={handleConfirm}
          disabled={selectedExpertise.length === 0 || isLoading}
        >
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Spinner size={16} />
              <span>Loading tests...</span>
            </div>
          ) : (
            <>
              Start Test
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Also export for backwards compatibility
export { FALLBACK_CATEGORIES as SPECIALTIES };
