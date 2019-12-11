import { launch, Page } from 'puppeteer-core'
import { getOptions } from './options'
import { FileType, Variant } from './types'
let _page: Page | null

async function getPage(isDev: boolean) {
  if (_page) {
    return _page
  }
  const options = await getOptions(isDev)
  const browser = await launch(options)
  _page = await browser.newPage()
  return _page
}

export async function getScreenshot(
  url: string,
  type: FileType,
  variant: Variant,
  isDev: boolean
) {
  const sizes = {
    story: { width: 1024, height: 1820 },
    card: { width: 2048, height: 1024 }
  }
  const page = await getPage(isDev)
  await page.setViewport(sizes[variant])
  await page.goto(url)
  const file = await page.screenshot({ type })
  return file
}
