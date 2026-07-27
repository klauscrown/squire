/** Medidas da login — espelham o mockup de referência (px lógicos). */
export const loginLayout = {
  screen: {
    paddingTop: 24,
    paddingBottom: 32,
    maxWidth: 360,
    horizontal: 24,
  },
  header: {
    topSpacer: 20,
    logoSize: 38,
    logoTracking: 8,
    logoToTagline: 10,
    taglineToWelcome: 20,
    welcomeToSub: 6,
    sectionBottom: 24,
  },
  field: {
    height: 52,
    radius: 14,
    gap: 14,
    iconSlot: 46,
  },
  forgot: {
    marginTop: -2,
    marginBottom: 8,
  },
  button: {
    height: 52,
    radius: 14,
    marginTop: 6,
    iconSize: 15,
    fontSize: 15,
  },
  divider: {
    marginVertical: 20,
    gap: 14,
    fontSize: 11,
  },
  social: {
    height: 88,
    radius: 14,
    gap: 10,
    paddingVertical: 18,
    iconBadge: 44,
    iconRadius: 12,
    iconToLabel: 10,
    labelSize: 13,
  },
  register: {
    marginTop: 20,
    gap: 6,
    titleSize: 13,
    subtitleSize: 12,
    ctaSize: 13,
    maxSubtitleWidth: 280,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
  },
} as const;
