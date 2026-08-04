export const grimoireImages = {
  mascot: require('../../assets/images/grimoire/squire-mascot.png'),
  sessionHero: require('../../assets/images/grimoire/session-hero.jpg'),
  campaignEldoria: require('../../assets/images/grimoire/campaign-eldoria.jpg'),
  campaignZaun: require('../../assets/images/grimoire/campaign-zaun.jpg'),
  campaignVoid: require('../../assets/images/grimoire/campaign-void.jpg'),
  loginHero: require('../../assets/images/grimoire/login-hero.jpg'),
  /** Atmosfera full-bleed (design de referência do grimório) */
  atmosphereBg: require('../../assets/images/grimoire/atmosphere-bg.jpg'),
} as const;

export const grimoireBannerFallbacks = [
  grimoireImages.campaignEldoria,
  grimoireImages.campaignZaun,
  grimoireImages.campaignVoid,
] as const;

export function getGrimoireBannerFallback(index: number) {
  return grimoireBannerFallbacks[index % grimoireBannerFallbacks.length];
}
