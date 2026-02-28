export const getParentUrl = () => {
  // Check if in iframe, use cynaps.io playground url as fallback
  if (window.self !== window.top) {
    const url = "https://cynaps.io/playground/";

    return new URL(url);
  }

  return new URL(window.location.href);
};

