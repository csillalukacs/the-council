// Theme constants for consistent styling across the application

// Color palette
export const COLORS = {
  // Primary accent color (cyan/blue)
  primary: "#66ccff",
  primaryText: "#ccf6ff",
  primaryDark: "#80eaff",
  
  // Background colors
  bgDark: "#000",
  bgGradient: "radial-gradient(circle at center, #111, #000)",
  bgOverlay: "rgba(0,0,0,0.7)",
  bgModal: "rgba(15,25,35,0.95)",
  
  // Neutral colors
  white: "#ffffff",
  gray: "#888",
  textMuted: "rgba(255,255,255,0.7)",
  
  // UI element colors
  borderLight: "rgba(102,204,255,0.4)",
  borderLightSubtle: "rgba(102,204,255,0.2)",
  bgGlassLight: "rgba(102,204,255,0.1)",
  bgGlassMedium: "rgba(102,204,255,0.15)",
  bgWhiteGlass: "rgba(255,255,255,0.1)",
  shadowGlow: "rgba(102,204,255,0.3)",
} as const;

// Spacing scale
export const SPACING = {
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  xxl: "20px",
  xxxl: "24px",
} as const;

// Border radius
export const RADIUS = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "10px",
} as const;

// Typography
export const TYPOGRAPHY = {
  fontSize: {
    xs: "11px",
    sm: "12px",
    md: "13px",
    base: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "20px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    bold: "700",
  },
  letterSpacing: "0.5px",
} as const;

// Shadows
export const SHADOWS = {
  glow: "0 0 12px rgba(102, 204, 255, 0.3)",
  glowStrong: "0 0 20px rgba(102,204,255,0.3)",
} as const;

// Glass morphism base styles
const glassBase = {
  background: COLORS.bgGlassLight,
  border: `1px solid ${COLORS.borderLight}`,
  backdropFilter: "blur(6px)",
  color: COLORS.primaryText,
} as const;

const glassMediumBase = {
  background: COLORS.bgGlassMedium,
  border: `1px solid ${COLORS.borderLight}`,
  backdropFilter: "blur(6px)",
  color: COLORS.primaryText,
} as const;

// Common style patterns
export const STYLES = {
  // Glass morphism effect
  glass: glassBase,
  
  glassMedium: glassMediumBase,
  
  // Buttons
  button: {
    ...glassBase,
    borderRadius: RADIUS.md,
    color: COLORS.primaryText,
    cursor: "pointer",
    padding: `${SPACING.sm} ${SPACING.md}`,
    transition: "all 0.2s ease",
  },
  
  buttonPrimary: {
    ...glassMediumBase,
    borderRadius: RADIUS.md,
    color: COLORS.primaryText,
    cursor: "pointer",
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: TYPOGRAPHY.fontSize.base,
    letterSpacing: TYPOGRAPHY.letterSpacing,
    boxShadow: SHADOWS.glow,
    transition: "all 0.2s ease",
  },
  
  buttonDisabled: {
    background: "rgba(102, 204, 255, 0.05)",
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: RADIUS.md,
    color: COLORS.primaryText,
    cursor: "not-allowed",
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: TYPOGRAPHY.fontSize.base,
    letterSpacing: TYPOGRAPHY.letterSpacing,
    opacity: 0.6,
  },
  
  // Inputs
  input: {
    background: "transparent",
    border: "none",
    color: COLORS.primaryText,
    outline: "none",
  },
  
  inputContainer: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    background: COLORS.bgGlassMedium,
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: RADIUS.md,
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.fontSize.base,
    letterSpacing: TYPOGRAPHY.letterSpacing,
    backdropFilter: "blur(6px)",
    boxShadow: SHADOWS.glow,
  },
  
  // Modal
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: COLORS.bgOverlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  
  modalContent: {
    background: COLORS.bgModal,
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: RADIUS.xl,
    color: COLORS.primaryText,
    overflowY: "auto" as const,
    padding: SPACING.xxxl,
    boxShadow: SHADOWS.glowStrong,
    backdropFilter: "blur(6px)",
    position: "relative" as const,
  },
  
  // Text containers
  textBubble: {
    background: COLORS.bgWhiteGlass,
    border: `1px solid rgba(255,255,255,0.3)`,
    padding: `${SPACING.xs} ${SPACING.md}`,
    borderRadius: RADIUS.md,
    backdropFilter: "blur(4px)",
  },
} as const;

