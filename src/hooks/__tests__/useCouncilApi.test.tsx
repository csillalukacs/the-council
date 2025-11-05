import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCouncilApi } from "../useCouncilApi";
import type { CouncilMemberData } from "../useCouncilMembers";
import * as conversationStorage from "../../utils/conversationStorage";
import * as memberApiHelpers from "../../utils/memberApiHelpers";

// Mock dependencies
vi.mock("../../utils/conversationStorage");
vi.mock("../../utils/memberApiHelpers");

const mockMembers: CouncilMemberData[] = [
  {
    id: "member1",
    displayName: "Member 1",
    position: { x: 0, y: 0, z: 0 } as any,
    color: "#ff0000",
    textColor: "#ffffff",
    personality: "Test personality 1",
    geometryFn: () => <div />,
    font: "Arial",
  },
  {
    id: "member2",
    displayName: "Member 2",
    position: { x: 0, y: 0, z: 0 } as any,
    color: "#00ff00",
    textColor: "#ffffff",
    personality: "Test personality 2",
    geometryFn: () => <div />,
    font: "Arial",
  },
];

describe("useCouncilApi", () => {
  const mockApiKey = "test-api-key";
  const mockModels = ["model1", "model2"];

  beforeEach(() => {
    vi.clearAllMocks();
    (conversationStorage.createAndSaveConversation as any).mockReturnValue(0);
    (memberApiHelpers.fetchMemberAnswer as any).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with empty state", () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.answers).toEqual({});
      expect(result.current.activeMembers).toEqual([]);
    });
  });

  describe("askCouncil", () => {
    it("should not execute if query is empty", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("");
      });

      expect(
        conversationStorage.createAndSaveConversation
      ).not.toHaveBeenCalled();
      expect(memberApiHelpers.fetchMemberAnswer).not.toHaveBeenCalled();
    });

    it("should not execute if apiKey is null", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: null,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      expect(
        conversationStorage.createAndSaveConversation
      ).not.toHaveBeenCalled();
    });

    it("should create conversation and fetch answers for all members", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      expect(
        conversationStorage.createAndSaveConversation
      ).toHaveBeenCalledWith(
        "test query",
        ["member1", "member2"],
        expect.any(Object)
      );

      expect(memberApiHelpers.fetchMemberAnswer).toHaveBeenCalledTimes(2);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should set loading state during request", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      // Start the request
      act(() => {
        result.current.askCouncil("test query");
      });

      // Loading should be true immediately after starting
      expect(result.current.loading).toBe(true);

      // Wait for all requests to complete
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 5000 }
      );
    });

    it("should initialize answers with undefined for all members", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      act(() => {
        result.current.askCouncil("test query");
      });

      expect(result.current.answers).toEqual({
        member1: undefined,
        member2: undefined,
      });
    });

    it("should set all members as active initially", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      act(() => {
        result.current.askCouncil("test query");
      });

      expect(result.current.activeMembers).toEqual(["member1", "member2"]);
    });

    it("should map models to members correctly", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: ["custom-model1", "custom-model2"],
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      expect(memberApiHelpers.fetchMemberAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          memberId: "member1",
          model: "custom-model1",
        })
      );

      expect(memberApiHelpers.fetchMemberAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          memberId: "member2",
          model: "custom-model2",
        })
      );
    });
  });

  describe("retryMember", () => {
    it("should not retry if no last query", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.retryMember("member1");
      });

      expect(memberApiHelpers.fetchMemberAnswer).not.toHaveBeenCalled();
    });

    it("should not retry if apiKey is null", async () => {
      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: null,
          models: mockModels,
          members: mockMembers,
        })
      );

      // Set a last query by asking council first
      await act(async () => {
        await result.current.askCouncil("test query");
      });

      await act(async () => {
        await result.current.retryMember("member1");
      });

      // Should not retry because apiKey is null
      const initialCallCount = (memberApiHelpers.fetchMemberAnswer as any).mock
        .calls.length;
      expect(memberApiHelpers.fetchMemberAnswer).toHaveBeenCalledTimes(
        initialCallCount
      );
    });

    it("should retry member and clear error state", async () => {
      (conversationStorage.getStoredConversations as any).mockReturnValue([
        { query: "test query", answers: {} },
      ]);

      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      // First ask council
      await act(async () => {
        await result.current.askCouncil("test query");
      });

      // Set an error answer
      act(() => {
        // Simulate error state
        result.current.answers = { member1: "*silence*", member2: "Answer 2" };
      });

      // Retry the member
      await act(async () => {
        await result.current.retryMember("member1");
      });

      expect(memberApiHelpers.fetchMemberAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          memberId: "member1",
          query: "test query",
        })
      );

      // Should have cleared the error answer
      expect(result.current.answers.member1).toBeUndefined();
      expect(result.current.activeMembers).toContain("member1");
    });

    it("should add member to activeMembers if not already active", async () => {
      (conversationStorage.getStoredConversations as any).mockReturnValue([
        { query: "test query", answers: {} },
      ]);

      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      // Remove member from active
      act(() => {
        result.current.activeMembers = [];
      });

      await act(async () => {
        await result.current.retryMember("member1");
      });

      expect(result.current.activeMembers).toContain("member1");
    });
  });

  describe("state management", () => {
    it("should update answers when callbacks are called", async () => {
      let setAnswerCallback: (id: string, text: string) => void;
      (memberApiHelpers.fetchMemberAnswer as any).mockImplementation(
        (params: any) => {
          setAnswerCallback = params.callbacks.setAnswer;
          return Promise.resolve(true);
        }
      );

      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      await act(async () => {
        setAnswerCallback!("member1", "Test answer");
      });

      expect(result.current.answers.member1).toBe("Test answer");
    });

    it("should remove active member when callback is called", async () => {
      let removeActiveMemberCallback: (id: string) => void;
      (memberApiHelpers.fetchMemberAnswer as any).mockImplementation(
        (params: any) => {
          removeActiveMemberCallback = params.callbacks.removeActiveMember;
          return Promise.resolve(true);
        }
      );

      const { result } = renderHook(() =>
        useCouncilApi({
          apiKey: mockApiKey,
          models: mockModels,
          members: mockMembers,
        })
      );

      await act(async () => {
        await result.current.askCouncil("test query");
      });

      expect(result.current.activeMembers).toContain("member1");

      await act(async () => {
        removeActiveMemberCallback!("member1");
      });

      expect(result.current.activeMembers).not.toContain("member1");
    });
  });
});
