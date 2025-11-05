import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApiKeyInput from "../ApiKeyInput";

describe("ApiKeyInput", () => {
  const mockSetApiKey = vi.fn();
  const mockSetShowKeyInput = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render input when showKeyInput is true", () => {
    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    expect(
      screen.getByPlaceholderText(/enter your openrouter api key/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should render input when apiKey is null", () => {
    render(
      <ApiKeyInput
        showKeyInput={false}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    expect(
      screen.getByPlaceholderText(/enter your openrouter api key/i)
    ).toBeInTheDocument();
  });

  it("should render edit button when apiKey exists and showKeyInput is false", async () => {
    render(
      <ApiKeyInput
        showKeyInput={false}
        apiKey="existing-key"
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /edit key/i })
      ).toBeInTheDocument();
    });
  });

  it("should show existing key value when editing", () => {
    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey="existing-key-123"
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    const input = screen.getByPlaceholderText(
      /enter your openrouter api key/i
    ) as HTMLInputElement;
    expect(input.value).toBe("existing-key-123");
  });

  it("should call setApiKey and setShowKeyInput when saving", async () => {
    const user = userEvent.setup();

    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    const input = screen.getByPlaceholderText(/enter your openrouter api key/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.type(input, "new-api-key");
    await user.click(saveButton);

    expect(mockSetApiKey).toHaveBeenCalledWith("new-api-key");
    expect(mockSetShowKeyInput).toHaveBeenCalledWith(false);
  });

  it("should trim whitespace when saving", async () => {
    const user = userEvent.setup();

    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    const input = screen.getByPlaceholderText(/enter your openrouter api key/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.type(input, "  key-with-spaces  ");
    await user.click(saveButton);

    expect(mockSetApiKey).toHaveBeenCalledWith("key-with-spaces");
  });

  it("should not save empty key", async () => {
    const user = userEvent.setup();

    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    // Should not call setApiKey with empty string
    expect(mockSetApiKey).not.toHaveBeenCalledWith("");
  });

  it("should call setShowKeyInput when edit button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ApiKeyInput
        showKeyInput={false}
        apiKey="existing-key"
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    await waitFor(() => {
      const editButton = screen.getByRole("button", { name: /edit key/i });
      expect(editButton).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit key/i });
    await user.click(editButton);

    expect(mockSetShowKeyInput).toHaveBeenCalledWith(true);
  });

  it("should update input value as user types", async () => {
    const user = userEvent.setup();

    render(
      <ApiKeyInput
        showKeyInput={true}
        apiKey={null}
        setApiKey={mockSetApiKey}
        setShowKeyInput={mockSetShowKeyInput}
      />
    );

    const input = screen.getByPlaceholderText(
      /enter your openrouter api key/i
    ) as HTMLInputElement;

    await user.type(input, "test-key");

    expect(input.value).toBe("test-key");
  });
});
