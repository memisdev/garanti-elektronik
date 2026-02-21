import { useCallback } from "react";

let sharedObserver: IntersectionObserver | null = null;
const observedElements = new WeakSet<Element>();

function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            sharedObserver?.unobserve(entry.target);
            observedElements.delete(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );
  }
  return sharedObserver;
}

function observeItems(container: HTMLElement) {
  const observer = getSharedObserver();
  const items = container.querySelectorAll(".reveal-on-scroll");
  items.forEach((item) => {
    if (!observedElements.has(item)) {
      observedElements.add(item);
      observer.observe(item);
    }
  });
}

export const useRevealOnScroll = <T extends HTMLElement = HTMLElement>() => {
  const ref = useCallback((node: T | null) => {
    if (!node) return;
    observeItems(node);
  }, []);

  return ref;
};
