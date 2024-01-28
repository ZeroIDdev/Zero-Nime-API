import axios from "axios";
import * as cheerio from "cheerio";
import { BASEURL, chunkArray } from "../helpers/index.js";

const mainPage = async (pathName, page = "1") => {
  const URL = `${BASEURL}${pathName}${
     ~~page
    }`,
    response = await axios.get(URL),
    $ = cheerio.load(response.data),
    maxPage = $(".pagin .page-numbers:not(.prev,.next,.dots):last")
      .text()
      .replace(/,| /g, ""),
    list = [];

  $("div.post-article>article").each((i, el) => {
    const posterElement = $(el).find("div.thumb a img");
    const titleElement = $(el).find("div.info>h2")
    const ratingElement = $(el).find("div.info>.top-post>.rating")
    const episodeElement = $(el).find("div.info>ul>li:eq(2)")
    const title = titleElement.text().trim()
    const rating = ratingElement.text().trim()
    const episode = episodeElement.text().trim()
    const poster = posterElement.attr("src");
     const dataList = {
        title,
        rating,
        poster,
        episode,
      };

    list.push(dataList);
  });

 
  if (~~page < 1) throw new Error("Page not found");

  return list;
};

export default mainPage;
