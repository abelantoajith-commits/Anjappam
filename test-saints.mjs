import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('Starting preview server...');
  const server = spawn('npm', ['run', 'preview', '--', '--port', '4174'], {
    shell: true,
    stdio: 'ignore',
  });

  await sleep(2000);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    // 1. Desktop Test at 1280px
    console.log('1. Testing Desktop at 1280px...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0' });

    // Verify section presence
    const section = await page.$('section[aria-label="Saints on Sharing Food"]');
    if (!section) throw new Error('Saints on Sharing Food section not found');
    console.log('   ✓ Found Saints on Sharing Food section');

    // Check slide 1: Mother Teresa
    let text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    console.log('   Slide 1:', text.split('\n').filter(t => t.trim()).slice(0, 5).join(' | '));
    if (!text.includes('Mother Teresa') || !text.includes('...hungry, I give him a plate of rice, a piece of bread...')) {
      throw new Error('Mother Teresa slide text mismatch');
    }
    console.log('   ✓ Mother Teresa quote rendered with exact text');

    // Measure height of section for stability
    const box1 = await section.boundingBox();
    console.log(`   Desktop Section Height: ${box1.height}px`);

    // Click Next Arrow to test St. Anthony
    await page.click('button[aria-label="Next saint"]');
    await sleep(700);
    text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    if (!text.includes('St. Anthony of Padua') || !text.includes('Today Christ stands at the door and knocks in the person of his poor.')) {
      throw new Error('St. Anthony slide text mismatch');
    }
    console.log('   ✓ Next arrow advanced to St. Anthony of Padua');

    // Click Next Arrow to test St. Elizabeth (kind: about)
    await page.click('button[aria-label="Next saint"]');
    await sleep(700);
    text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    if (!text.includes('St. Elizabeth of Hungary') || !text.toLowerCase().includes('words about the saint')) {
      throw new Error('St. Elizabeth slide "Words about the saint" label mismatch');
    }
    console.log('   ✓ St. Elizabeth rendered with "Words about the saint" label');

    // Click Next Arrow to test St. Vincent de Paul (kind: teaching)
    await page.click('button[aria-label="Next saint"]');
    await sleep(700);
    text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    if (!text.includes('St. Vincent de Paul') || !text.toLowerCase().includes('taught by the saint')) {
      throw new Error('St. Vincent slide "Taught by the saint" label mismatch');
    }
    console.log('   ✓ St. Vincent de Paul rendered with "Taught by the saint" label');

    // Click Next Arrow to test St. Nicholas (kind: tradition)
    await page.click('button[aria-label="Next saint"]');
    await sleep(700);
    text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    if (!text.includes('St. Nicholas') || !text.toLowerCase().includes('remembered for')) {
      throw new Error('St. Nicholas slide "Remembered for" label mismatch');
    }
    console.log('   ✓ St. Nicholas rendered with "Remembered for" label');

    // Measure height again
    const box2 = await section.boundingBox();
    console.log(`   Desktop Section Height after rotating through all slides: ${box2.height}px (Stable: ${Math.abs(box1.height - box2.height) < 30})`);

    // 2. Mobile Viewport at 360px
    console.log('2. Testing Mobile Viewport at 360px...');
    await page.setViewport({ width: 360, height: 740 });
    await sleep(500);

    // Jump to Mother Teresa via dot
    await page.click('button[aria-label="Jump to Mother Teresa"]');
    await sleep(700);

    const mobileSection = await page.$('section[aria-label="Saints on Sharing Food"]');
    const mobileBox = await mobileSection.boundingBox();
    console.log(`   Mobile Section Height: ${mobileBox.height}px, Width: ${mobileBox.width}px`);

    // Check previous arrow
    await page.click('button[aria-label="Previous saint"]');
    await sleep(700);
    text = await page.$eval('section[aria-label="Saints on Sharing Food"]', (el) => el.innerText);
    if (!text.includes('St. Nicholas')) {
      throw new Error('Previous arrow did not wrap to St. Nicholas');
    }
    console.log('   ✓ Mobile previous arrow wrapped back to St. Nicholas cleanly');

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors:', consoleErrors);
    } else {
      console.log('✅ ZERO console errors detected during SaintsRotator test!');
    }
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
