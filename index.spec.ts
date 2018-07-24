import M from "./index";

describe("Messenger JSON Builder", () => {
  it("creates a raw text message", () => {
    expect(M.getText("Hello")).toEqual({ text: "Hello" });
  });

  // TODO
});
