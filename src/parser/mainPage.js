import axios from "axios";
import * as cheerio from "cheerio";
import { BASEURL, chunkArray } from "../helpers/index.js";

const mainPage = async (pathName, page = "1") => {
  const URL = `${BASEURL}${pathName}${
     ~~page
    }`,
    response = await axios.get(URL),
    $ = cheerio.load(response.data),
    maxPage = $("ul.pagination li:nth-last-child(2)")
    .text()
    .replace(/,| /g, "");  
    let list = [];

  $("div.post-article>article").each((i, el) => {
    const posterElement = $(el).find("div.thumb a img");
    const titleElement = $(el).find("div.info>h2")
    const ratingElement = $(el).find("div.info>.top-post>.rating")
    const episodeElement = $(el).find("div.info>ul>li:eq(2)")
    const slugElement = $(el).find("div.thumb>a")
    const title = titleElement.text().trim()
    const rating = ratingElement.text().trim()
    const episode = episodeElement.text().trim()
    const poster = posterElement.attr("src");
    const rawSlug = slugElement.attr("href");
    const slug = rawSlug.replace(/^https:\/\/nimegami\.id\//, '').replace(/\//g, '');
     const dataList = {
        title,
        slug,
        rating,
        poster,
        episode,
      };

    list.push(dataList);
  });

 
  if (~~page < 1) throw new Error("Page not found");
  const data = {
    maxPage,
    list
  }
  return data;
};

export default mainPage;
