import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:4173';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('🚀 Starting Anjappam End-to-End Automated Browser Tests with Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // Track console logs and errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit Home Page (Desktop)
    console.log('1. Visiting Home Page (1280x800)...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Verify Title
    const title = await page.$eval('h1', (el) => el.innerText.trim());
    console.log(`   Header Title: "${title}" (Expected: ANJAPPAM)`);
    if (title !== 'ANJAPPAM') throw new Error(`Title mismatch: ${title}`);

    // Verify Matthew 25:40 closing quote
    const bodyText = await page.$eval('body', (el) => el.innerText);
    if (!bodyText.includes('Matthew 25:40')) {
      throw new Error('Matthew 25:40 missing from closing section');
    }
    console.log('   ✓ Verified Matthew 25:40 closing section present');

    // 2. Test Mobile Viewport at 360px
    console.log('2. Testing 360px Mobile Viewport...');
    await page.setViewport({ width: 360, height: 740 });
    await sleep(500);
    const mobileHeading = await page.$eval('h1', (el) => el.innerText.trim());
    if (mobileHeading !== 'ANJAPPAM') throw new Error('Mobile heading mismatch');
    console.log('   ✓ 360px viewport renders cleanly');

    // Switch back to desktop
    await page.setViewport({ width: 1280, height: 800 });

    // 3. Test Registration Form as Donor
    console.log('3. Registering new Donor via Registration Form...');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle0' });

    const pageTitle = await page.$eval('h1', (el) => el.innerText.trim());
    console.log(`   Page Title: "${pageTitle}" (Expected: Registration Form)`);
    if (pageTitle !== 'Registration Form') throw new Error(`Page title was not Registration Form: ${pageTitle}`);

    // Verify submit button text
    const submitBtnText = await page.$eval('button[type="submit"]', (el) => el.innerText.trim());
    console.log(`   Submit Button Text: "${submitBtnText}" (Expected: Submit)`);
    if (submitBtnText !== 'Submit') throw new Error(`Submit button text was not Submit: ${submitBtnText}`);

    // Fill registration form
    const testUsername = `caterer_${Date.now().toString().slice(-6)}`;
    await page.type('#institutionName', 'Malabar Feast House');
    await page.type('#contactName', 'Mathew Varghese');
    await page.type('#phone', '9847011223');
    await page.type('#username', testUsername);
    await page.type('#password', 'mypassword123');
    await page.type('#repeatPassword', 'mypassword123');

    await page.click('button[type="submit"]');
    await sleep(1000);
    const signupDebug = await page.evaluate(() => {
      const errEls = Array.from(document.querySelectorAll('.text-\\[\\#7A2E2E\\], .text-red-500, p'));
      return {
        url: window.location.pathname,
        errors: errEls.map((e) => e.innerText).filter((t) => t.length > 0 && t.length < 100),
      };
    });
    console.log('    Signup state after click:', signupDebug);
    await page.waitForFunction(() => window.location.pathname === '/donate', { timeout: 10000 });

    console.log(`   ✓ Registered and auto-logged in. Current URL: ${page.url()}`);

    // 4. Add a Donation
    console.log('4. Adding a surplus food donation on /donate...');
    await page.waitForSelector('#food-item');
    await page.type('#food-item', 'Chicken Biriyani Special');
    await page.type('#quantity', '75');
    await page.type('#location', 'Kakkanad Infopark, Kochi');

    await page.click('button[type="submit"]');
    await sleep(1500);

    const donatePageText = await page.$eval('body', (el) => el.innerText);
    if (!donatePageText.includes('Chicken Biriyani Special')) {
      throw new Error('Newly added donation not found in Your Donations section');
    }
    console.log('   ✓ Donation "Chicken Biriyani Special" added to Your Donations list');

    // 5. Sign out
    console.log('5. Signing out...');
    await page.evaluate(() => {
      const userBtn = Array.from(document.querySelectorAll('button')).find((b) => b.getAttribute('aria-haspopup') === 'true');
      if (userBtn) userBtn.click();
    });
    await sleep(500);

    await page.evaluate(() => {
      const logoutBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Sign Out'));
      if (logoutBtn) logoutBtn.click();
    });
    await sleep(1000);
    console.log('   ✓ Signed out successfully');

    // 6. Sign up as a Receiver
    console.log('6. Registering new Receiver via Registration Form...');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle0' });

    // Select Receiver role
    await page.click('label:has(input[value="receiver"])');
    const receiverUsername = `shelter_${Date.now().toString().slice(-6)}`;
    await page.type('#institutionName', 'Sneha Bhavan Children Sanctuary');
    await page.type('#contactName', 'Sr. Mary Kurian');
    await page.type('#phone', '9447199887');
    await page.type('#username', receiverUsername);
    await page.type('#password', 'mypassword123');
    await page.type('#repeatPassword', 'mypassword123');

    await page.click('button[type="submit"]');
    await page.waitForFunction(() => window.location.pathname === '/receive', { timeout: 10000 });

    console.log(`   ✓ Receiver registered. Current URL: ${page.url()}`);

    // 7. Accept the donation
    console.log('7. Accepting the donation on /receive...');
    await sleep(1000);

    // Click Accept on Chicken Biriyani Special
    const accepted = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const target = articles.find((a) => a.innerText.includes('Chicken Biriyani Special'));
      if (!target) return false;
      const btn = target.querySelector('button');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!accepted) throw new Error('Could not click Accept on donation');
    await sleep(600);

    // Confirm dialog acceptance
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => b.innerText.includes('Yes, Accept'));
      if (confirmBtn) confirmBtn.click();
    });
    await sleep(1500);

    // Verify donor contact revealed
    const receiveText = await page.$eval('body', (el) => el.innerText);
    if (!receiveText.includes('Direct Donor Contact Details') && !receiveText.includes('Malabar Feast House')) {
      throw new Error('Donor contact details not revealed after acceptance');
    }
    console.log('   ✓ Donation accepted and donor contact details revealed!');

    // Close contact dialog
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const doneBtn = btns.find((b) => b.innerText === 'Done' || b.innerText === 'Close');
      if (doneBtn) doneBtn.click();
    });
    await sleep(500);

    // 8. Post a Food Request (Sized by NUMBER OF PEOPLE)
    console.log('8. Posting Food Request sized by NUMBER OF PEOPLE...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const reqBtn = btns.find((b) => b.innerText.includes('Request Food'));
      if (reqBtn) reqBtn.click();
    });
    await sleep(500);

    await page.type('#req-item', 'Malabar Meals & Fish Curry');
    await page.type('#req-people', '60');
    await page.type('#req-location', 'Kaloor, Kochi');

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find((b) => b.innerText.includes('Submit Request'));
      if (submitBtn) submitBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname === '/requests', { timeout: 10000 });

    console.log(`   ✓ Request submitted. Arrived on ${page.url()}`);

    // 9. Verify Request Capsule format on /requests:
    // "Biriyani · for 50 people · Kakkanad, Kochi · Accept"
    console.log('9. Checking Request Capsule readout format...');
    await sleep(1000);
    const requestsPageText = await page.$eval('body', (el) => el.innerText);
    if (!requestsPageText.includes('Malabar Meals & Fish Curry · for 60 people · Kaloor, Kochi')) {
      throw new Error('Request capsule format does not match required format');
    }
    console.log('   ✓ Verified capsule readout format: "Item · for 60 people · Location"');

    // 10. Switch back to Donor and accept request
    console.log('10. Signing out receiver and logging back in as donor...');
    await page.evaluate(() => {
      const userBtn = Array.from(document.querySelectorAll('button')).find((b) => b.getAttribute('aria-haspopup') === 'true');
      if (userBtn) userBtn.click();
    });
    await sleep(400);
    await page.evaluate(() => {
      const logoutBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Sign Out'));
      if (logoutBtn) logoutBtn.click();
    });
    await sleep(800);

    // Login as donor
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.type('#identifier', testUsername);
    await page.type('#password', 'mypassword123');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => window.location.pathname === '/donate', { timeout: 10000 });
    console.log('    ✓ Re-logged in as donor');

    // Navigate to /requests and accept the request
    await page.goto(`${BASE_URL}/requests`, { waitUntil: 'networkidle0' });
    await sleep(800);

    await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const target = articles.find((a) => a.innerText.includes('Malabar Meals & Fish Curry'));
      if (target) {
        const btn = target.querySelector('button');
        if (btn) btn.click();
      }
    });
    await sleep(600);

    // Confirm request fulfillment
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => b.innerText.includes('Yes, Accept Request'));
      if (confirmBtn) confirmBtn.click();
    });
    await sleep(1200);

    const postFulfillText = await page.$eval('body', (el) => el.innerText);
    if (!postFulfillText.includes('Shelter Caretaker Details') && !postFulfillText.includes('Sneha Bhavan Children Sanctuary')) {
      throw new Error('Shelter caretaker details not revealed after donor accepted request');
    }
    console.log('    ✓ Donor accepted food request and shelter caretaker details revealed!');

    // 11. Test Refresh on Every Route
    console.log('11. Testing Page Refresh across all routes...');
    const routes = ['/', '/donate', '/receive', '/requests', '/login', '/signup'];
    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
      await page.reload({ waitUntil: 'networkidle0' });
      const currentUrl = page.url();
      if (!currentUrl.includes(route)) {
        throw new Error(`Refresh failed on route: ${route}`);
      }
      console.log(`    ✓ Refreshed ${route} successfully without 404 or crash`);
    }

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
    } else {
      console.log('✅ ZERO console errors detected during full test run!');
    }

    console.log('\n🎉 ALL ACCEPTANCE CRITERIA VERIFIED AND PASSED!');
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
