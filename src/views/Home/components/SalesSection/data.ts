import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration, no hassle.'),
  bodyText: t('Trade any token on ETH Chain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/trade',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: '/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'BULL', alt: t('BULL token') },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('BullionFX makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: '/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with bull token') },
    ],
  },
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('BULL makes our world go round.'),
  bodyText: t(
    'BULL token is at the heart of the BullionFX ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/trade?outputCurrency=0x7D3258C5F0ef16598458c99B8aF2154e74aEb5b0&chainId=1',
    text: t('Buy BULL'),
    external: false,
  },
  secondaryButton: {
    to: '/',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/bull/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d bullionfx') },
      { src: 'top-right', alt: t('Small 3d bullionfx') },
      { src: 'coin', alt: t('BULL token') },
      { src: 'top-left', alt: t('Small 3d bullionfx') },
    ],
  },
})
