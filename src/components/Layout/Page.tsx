import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useBullUsdcPrice } from 'hooks/useUSDCPrice'
import Container from './Container'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 12px;
  padding-bottom: 12px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 12px;
    padding-bottom: 12px;
  }
`

export const PageMeta: React.FC<React.PropsWithChildren<{ symbol?: string }>> = ({ symbol }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { pathname } = useRouter()
  const cakePriceUsd = useBullUsdcPrice()
  const cakePriceUsdDisplay = cakePriceUsd ? `$${cakePriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t, locale) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  let pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
  if (symbol) {
    pageTitle = [symbol, title].join(' - ')
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, symbol, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
