import { ParsedRequest, Variant } from './types'
const records = require(`${__dirname}/../../records.json`)
const { readFileSync } = require('fs')

const fonts = `${__dirname}/../../_fonts`
const rglr = readFileSync(`${fonts}/Inter-Regular.woff2`).toString('base64')
const bold = readFileSync(`${fonts}/Inter-Bold.woff2`).toString('base64')
const blck = readFileSync(`${fonts}/Inter-Black.woff2`).toString('base64')

const colors = {
  darker: '#121217',
  dark: '#17171d',
  darkless: '#252429',
  black: '#1f2d3d',
  steel: '#273444',
  slate: '#3c4858',
  muted: '#8492a6',
  smoke: '#e0e6ed',
  snow: '#f9fafc',
  white: '#ffffff',
  red: '#ec3750',
  orange: '#ff8c37',
  yellow: '#f1c40f',
  green: '#33d6a6',
  cyan: '#5bc0de',
  blue: '#338eda'
}

function getCss(variant: Variant) {
  let background = colors.snow
  variant

  return `
    @font-face {
      font-family: 'Inter';
      font-weight: 400;
      src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 700;
      src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 900;
      src: url(data:font/woff2;charset=utf-8;base64,${blck}) format('woff2');
    }

    body {
      margin: 0;
      height: 100vh;
      background-color: ${background};
      font-family: 'Inter', sans-serif;
      font-size: 100px;
      font-weight: 400;
      display: flex;
      flex-direction: column;
      ${variant === 'story' && 'text-align: center;'}
    }

    .container {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      ${
        variant === 'story'
          ? `
          justify-content: center;
          flex-direction: column;
          text-align: center;
        `
          : `
          padding: 0 125px;
          text-align: left;
      `
      }
    }

    .brand {
      background-color: ${colors.red};
      color: ${colors.white};
      font-size: 75px;
      padding: 50px ${variant === 'story' ? 0 : 125}px;
      width: 100%;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    
    .heading-detail {
      color: ${colors.muted};
      font-weight: 700;
      font-size: 75px;
    }
    .heading {
      margin: 25px 0 50px;
      font-size: 175px;
      font-weight: 900;
      line-height: 0.875;
      letter-spacing: -.01em;
    }
    
    .avatar-wrapper {
      position: relative;
      ${variant === 'story' ? 'margin-bottom: 35px;' : 'margin-right: 100px;'}
    }
    .avatar {
      width: 350px;
      height: 350px;
      object-fit: cover;
      object-position: center;
      border-radius: 175px;
    }
    .avatar-badge {
      display: inline-block;
      width: 125px;
      height: 125px;
      border-radius: 75px;
      position: absolute;
      top: 0;
      left: 0;
      color: ${colors.white};
      font-size: 75px;
      font-weight: 700;
      line-height: 125px;
      font-weight: black;
      text-align: center;
    }
    .bg-rep { background-color: ${colors.red}; }
    .bg-dem { background-color: ${colors.blue}; }

    .funding {
      font-weight: 700;
      font-size: 100px;
      text-transform: uppercase;
      width: 100%;
      color: ${colors.white};
      text-align: ${variant === 'story' ? 'center' : 'left'};
      padding: 50px ${variant === 'story' ? '0px' : '50px 50px 575px'};
    }
  `
}

const getYear = (date: string) => date.slice(0, 4)
const withCommas = (num: number | string) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

type Profile = {
  id: string,
  fundingType: 'rights' | 'control',
  gunRightsTotal: number,
  gunControlTotal: number
}

export function getHtml(parsedReq: ParsedRequest) {
  const { id, variant } = parsedReq
  const p = records.find((r: Profile) => r.id === id)
  const { fundingType, gunRightsTotal, gunControlTotal } = p
  const fundingTotal = fundingType === 'control' ? gunControlTotal : gunRightsTotal
  return `<!DOCTYPE html>
  <html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(variant)}
  </style>
  <body>
    <div class="brand">
      ${variant === 'story' ? '@gunfunded' : 'gunfunded.com'}
    </div>
    <div class="container">
      <div class="avatar-wrapper">
        <div class="avatar-badge bg-${p.party
          .toLowerCase()
          .slice(0, 3)}">${p.party.slice(0, 1)}</div>
        <img
          class="avatar"
          src="https://avatars.gunfunded.com/${p.ids.bioguide}.jpg">
      </div>
      <div>
        <div class="heading-detail">
          ${p.role === 'rep' ? p.id : p.state}
          ${p.role === 'sen' ? 'Senator' : 'Representative'}
        </div>
        <div class="heading">
          ${p.name.full}
        </div>
        ${
          variant === 'story'
            ? `
            <div class="heading-detail">
              Current term ${getYear(p.termStart)}–${getYear(p.termEnd)}
            </div>
            `
            : ''
        }
      </div>
    </div>
    <div class="funding bg-${gunRightsTotal > 0 ? 'rep' : 'dem'}">
      <span>$${withCommas(fundingTotal)}</span> in&nbsp;gun&nbsp;funding
    </div>
  </body>
</html>`
}
