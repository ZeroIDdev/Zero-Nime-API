import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
const animeDetails = async (slug) => {
  try {
    // Launching the browser
    // const browser = await puppeteer.launch({
    // headless: "new",
    // executablePath:'/usr/bin/chromium-browser',
    // args: ['--no-sandbox']});
    chromium.setGraphicsMode = false
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
    // Creating a new page
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2*60*1000)
    // Navigating to the specified URL
    await page.goto(`https://nimegami.id/${slug}/`);

    await page.waitForSelector('.icon-play');

    // Clicking on the '.icon-play' element
    await page.click('.icon-play');

    // Waiting for a short period (you might need to adjust this)
    await page.waitForTimeout(1000);

    // Getting the content after the click
    const htmlContent = await page.evaluate(()=>{
      return document.documentElement.innerHTML
    });

    // Closing the browser
    await browser.close();

    // Using cheerio to parse the HTML content
    const $ = cheerio.load(htmlContent);

    // Extracting the title from the parsed HTML
    const framElement = $('div.video-streaming>iframe').attr("src")
    // const streamingUrl = framElement.attr("src")
    const info = $('div.info2>table')
    // const judul = $(info).find('tbody:nth-first-child>td:nth-last-child').text().trim()
    const data = {
      framElement,
      // judul
    };

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default animeDetails;
