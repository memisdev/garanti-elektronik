import { describe, it, expect } from "vitest";
import { escapeIlike } from "@/lib/escapeIlike";

describe("escapeIlike", () => {
  it("escapes percent signs", () => {
    expect(escapeIlike("100%")).toBe("100\\%");
  });

  it("escapes underscores", () => {
    expect(escapeIlike("a_b")).toBe("a\\_b");
  });

  it("escapes both percent and underscore", () => {
    expect(escapeIlike("%_foo_%")).toBe("\\%\\_foo\\_\\%");
  });

  it("returns plain strings unchanged", () => {
    expect(escapeIlike("hello world")).toBe("hello world");
  });

  it("handles empty string", () => {
    expect(escapeIlike("")).toBe("");
  });
});
