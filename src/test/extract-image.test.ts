import { describe, it, expect } from "vitest";
import { extractImageFromResponse } from "@/lib/ai/extract-image";

describe("extractImageFromResponse", () => {
  it("extracts base64 data from a valid Gemini response", () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { text: "Here is the image" },
              { inlineData: { mimeType: "image/png", data: "iVBORw0KGgoAAAANS==" } },
            ],
          },
        },
      ],
    };
    expect(extractImageFromResponse(response)).toBe("iVBORw0KGgoAAAANS==");
  });

  it("returns null when no candidates", () => {
    expect(extractImageFromResponse({})).toBeNull();
  });

  it("returns null when candidates have no image parts", () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [{ text: "No image here" }],
          },
        },
      ],
    };
    expect(extractImageFromResponse(response)).toBeNull();
  });

  it("returns null when candidates array is empty", () => {
    expect(extractImageFromResponse({ candidates: [] })).toBeNull();
  });

  it("returns first image when multiple images exist", () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { inlineData: { mimeType: "image/png", data: "first" } },
              { inlineData: { mimeType: "image/jpeg", data: "second" } },
            ],
          },
        },
      ],
    };
    expect(extractImageFromResponse(response)).toBe("first");
  });
});
