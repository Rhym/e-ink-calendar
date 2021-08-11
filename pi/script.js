const puppeteer = require("puppeteer");

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  let browser = await puppeteer.launch({ headless: true, executablePath: "/usr/bin/chromium-browser" });
  const page = await browser.newPage();
  await page.goto("YOUR_WEBPAGE_URL");

  // 5 second timeout: allows the page to fully render before taking the screenshot
  await timeout(5000);

  // Set your screen size
  await page.setViewport({ width: 800, height: 480 });
  await page.screenshot({ path: "/home/pi/Scripts/eink.png", type: "png" });
  await browser.close();
})();
