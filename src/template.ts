import * as marked from 'marked'
import { sanitizeHtml } from './sanitizer'

function getCss(theme: string, fontSize: string) {
  let background = '#ffffff'
  // let foreground = '#e42d42'
  let radial = '#dde1e4'

  if (theme === 'dark') {
    background = '#17171d'
    // foreground = '#ffffff'
    radial = '#606e77'
  }

  return `
    body {
      background: ${background};
      background-image: radial-gradient(circle at 25px 25px, ${radial} 3%, transparent 0%),   
        radial-gradient(circle at 75px 75px, ${radial} 3%, transparent 0%);
      background-size: 100px 100px;
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-family: 'Gotham A', 'Gotham B', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
      letter-spacing: -.01em;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;
      font-size: .75em;
      white-space: pre-wrap;
    }

    code:before, code:after {
      content: '\`';
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .logo {
      width: 275px;
      height: 275px;
    }

    .plus {
      color: #7a8c97;
      font-size: 100px;
      padding: 0 50px;
    }

    .spacer {
      margin: 100px 150px 150px;
    }

    .brand {
      font-size: 85px;
      padding: 50px;
      text-align: center;
      position: absolute;
      top: 0;
      width: 100%;
      color: #7a8c97;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nyu {
      color: ${theme === 'dark' ? '#8900e1' : '#57068c'};
      font-weight: bold;
      font-size: 100px;
      padding-left: .25em;
    }
    
    .heading {
      background-image: linear-gradient(to bottom right, #8900e1 12.5%, #57068c);
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 50px 100px 45px;
      font-weight: bold;
      line-height: 0.875;
      letter-spacing: -.06em;
    }

    .heading * {
      margin: 0;
    }

    .metadata {
      font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
      text-transform: uppercase;
      color: #7a8c97;
      letter-spacing: 0;
    }
    
    .avatar {
      width: 125px;
      border-radius: 125px;
      margin: 0 25px 0 50px;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, metadata, theme, md, fontSize, images } = parsedReq
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <link rel="stylesheet" href="http://assets.lachlanjc.me/bf566c6457ac/gotham.css" />
  <body>
    <div class="brand">
      <img class="avatar" src="https://github.com/lachlanjc.png">
      @lachlanjc @ <span class="nyu">IMA</span>
    </div>
    <div class="spacer">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
          <img class="logo" src="${sanitizeHtml(images[0])}" />
          ${images.slice(1).map(img => {
            return `<div class="plus">+</div>
            <img class="logo" src="${sanitizeHtml(img)}" />`
          })}
        </div>`
          : ''
      }
      <div class="heading">${md ? marked(text) : sanitizeHtml(text)}</div>
      ${metadata != undefined ? `<div class="metadata">${metadata}</div>` : ''}
    </div>
  </body>
</html>`
}
