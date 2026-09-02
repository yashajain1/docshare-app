const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const url = process.env.SLIDES_URL || 'http://localhost:3000/slides.html';
    console.log('Opening slides at', url);
    await page.goto(url, { waitUntil: 'networkidle0' });
    const slidesCount = await page.$$eval('.slides > section', s => s.length);
    console.log('Found', slidesCount, 'slides');
    if (slidesCount === 0) {
      console.error('No slides found — make sure slides.html is served at', url);
      await browser.close();
      process.exit(1);
    }
    for (let i = 0; i < slidesCount; i++) {
      await page.evaluate(n => Reveal.slide(n), i);
      await page.waitForTimeout(700);
      const filename = `slide_${String(i).padStart(2, '0')}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log('Wrote', filename);
    }
    await browser.close();
  } catch (err) {
    console.error('renderSlides error', err);
    process.exit(1);
  }
})();
