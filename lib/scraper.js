import axios from "axios";
import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @param {String} prompt
 * @param {String} system
 * @description Any Request? Contact me : vielynian@gmail.com
 * @author Kaviaann 2024
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
export async function hdown(link) {
        try {
            const { data: api } = await axios.get('https://hddownloaders.com');
            const token = cheerio.load(api)('#token').val();
            console.log(token)
            const { data } = await axios.post('https://hddownloaders.com/wp-json/aio-dl/video-data/', new URLSearchParams({ url: link, token }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Postify/1.0.0'
                }
            });
            return data;
        } catch (error) {
            return { error: error.response?.data || error.message };
        }
    }
 
export async function npmSearch(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        "https://www.npmjs.com/search?" + new URLSearchParams({ q: query }),
        {
          method: "GET",
          headers: {
            Referer: "https://www.npmjs.com/",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "X-Spiferack": 1,
          },
        }
      ).then((v) => v.json());
      if (!res.total) return reject("Packages Not Found");

      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}
export async function copilot(prompt, system) {
  return new Promise(async (resolve, reject) => {
    try {
      const BASE_URL = "https://omniplex.ai/api";
      const headers = {
        origin: BASE_URL.replace("/api", ""),
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
      };

      const chatJSON = {
        frequency_penalty: 0,
        max_tokens: 512,
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        presence_penalty: 0,
        temperature: 1,
        top_p: 1,
      };

      const a = await fetch(BASE_URL + "/think", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: prompt,
        }),
      }).then((v) => v.json());

      if (a.error) return reject("Failed to think");

      if (a.furtherInfo) {
        return resolve("Give more spesific prompt");
      } else {
        const b = await fetch(
          BASE_URL +
            "/multiSearch?" +
            new URLSearchParams({
              q: a.questions.join(","),
              limit: 15,
            })
        ).then((v) => v.json());

        if (b.message !== "Success") return reject("Failed to search");

        const c = await fetch(
          BASE_URL +
            "/scrape?" +
            new URLSearchParams({
              urls: b.data.webPages.value.map((v) => v.url).join(","),
            }),
          {
            method: "POST",
            headers,
          }
        ).then((v) => v.text());

        if (!c) return reject("Failed to scrape");
        chatJSON.messages[1].content = c + "\n\nQuestion : " + prompt;
        chatJSON.messages[0].content = `Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided web Search Results (URL and Summary).You must only use information from the provided search results.Use an unbiased and journalistic tone.Use this current date and time: ${new Date().toUTCString()}.Combine search results together into a coherent answer.Do not repeat text.Only cite the most relevant results that answer the question accurately.If different results refer to different entities with the same name, write separate answers for each entity.You have the ability to search and will be given websites and the scarped data from them and you will have to make up an answer with that only. ${system}`;
        const d = await fetch(BASE_URL + "/chat", {
          method: "POST",
          headers,
          body: JSON.stringify(chatJSON),
        }).then((v) => v.text());

        if (!d) return reject("Failed to generate answer");
        resolve({
          data: d,
          search: b.data,
          questions: a.questions,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}


export class BloxFruit {
    constructor() {
        this.base_url = "https://fruityblox.com";
        this.base_header = {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ms;q=0.6",
            "Cache-Control": "no-cache",
            Cookie: "_ga_F55Y1PYQ4M=GS1.1.1735536080.1.1.1735537683.0.0.0",
            Pragma: "no-cache",
            Priority: "u=0, i",
            "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": '"Windows"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        };
    }
    // ? Stock price
    async getStock() {
        return new Promise(async (resolve, reject) => {
            try {
                const r = await axios
                    .get(`${this.base_url}/stock`, {
                    headers: {
                        ...this.base_header,
                    },
                })
                    .then((v) => v.data)
                    .catch((e) => {
                    throw new Error("Failed to get blox fruit stock data");
                });
                const $ = cheerio.load(r);
                const c = $('div.col-span-full div[class="grid grid-cols-1 lg:grid-cols-2 gap-4"]').children("div");
                const d = {
                    normal: c
                        .eq(0)
                        .children("div")
                        .map((i, el) => {
                        return {
                            name: $(el).find("img").attr("alt"),
                            image: $(el).find("img").attr("src"),
                            price: $(el)
                                .find("p")
                                .map((i, el) => $(el).text().trim())
                                .get(),
                            link: (this.base_url + $(el).find("a").attr("href")),
                        };
                    })
                        .get(),
                    mirage: c
                        .eq(1)
                        .children("div")
                        .map((i, el) => {
                        return {
                            name: $(el).find("img").attr("alt"),
                            image: $(el).find("img").attr("src"),
                            price: $(el)
                                .find("p")
                                .map((i, el) => $(el).text().trim())
                                .get(),
                            link: (this.base_url + $(el).find("a").attr("href")),
                        };
                    })
                        .get(),
                };
                return resolve(d);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    // ? Value list
    async getFruitValue() {
        return new Promise(async (resolve, reject) => {
            try {
                const r = await axios
                    .get(`${this.base_url}/blox-fruits-value-list`, {
                    headers: {
                        ...this.base_header,
                    },
                })
                    .then((v) => v.data)
                    .catch((e) => {
                    throw new Error("Failed to get blox fruit value list data");
                });
                const $ = cheerio.load(r);
                return resolve($("div.col-span-full")
                    .children("div")
                    .slice(1)
                    .map((i, el) => {
                    return {
                        name: $(el)
                            .find("div.items-center.mr-auto div p.font-bold.uppercase")
                            .text()
                            .trim(),
                        type: $(el)
                            .find("p.text-xs")
                            .text(),
                        image: $(el).find("img").attr("src"),
                        price: $(el)
                            .find("div.items-center > p")
                            .map((i, el) => $(el).text())
                            .get(),
                        link: (this.base_url + $(el).find("a").attr("href")),
                    };
                })
                    .get());
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async getDetails(item) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!item)
                    throw new Error("Enter valid item name!");
                if (!item.includes(this.base_url + "/items/"))
                    item = this.base_url + "/items/" + item.split("/").pop();
                const r = await axios
                    .get(item, {
                    headers: {
                        ...this.base_header,
                    },
                })
                    .then((v) => v.data)
                    .catch((e) => {
                    throw new Error("Failed to get blox fruit details!");
                });
                const $ = cheerio.load(r);
                const c = $("div.p-4 div.grid div.col-span-full");
                const d = {
                    title: $(c).find("h1").text().trim().split(" ")[0],
                    description: $(c)
                        .find('p[class="text-center sm:text-start"]')
                        .text()
                        .trim(),
                    image: $(c).find("img").attr("src"),
                    price: $(c)
                        .find("div.items-center > p.text-center")
                        .map((i, el) => $(el).text().split(":")[1].trim())
                        .get(),
                };
                console.log(d);
                if (!d.title)
                    throw new Error("Item not found!");
                return resolve(d);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async getTrades(item) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!item)
                    throw new Error("Enter valid item name!");
                if (item.includes(`${this.base_url}`))
                    item = item.split("/").pop();
                const r = await axios
                    .get(this.base_url +
                    "/api/trades?" +
                    new URLSearchParams({
                        limit: "10",
                        skip: "0",
                        item,
                    }), {
                    headers: {
                        ...this.base_header,
                    },
                })
                    .then((v) => v.data)
                    .catch((e) => {
                    throw new Error("Failed to get latest blox fruit trades");
                });
                return resolve(r.map((v) => {
                    return {
                        id: v._id,
                        timestamp: v.date,
                        offer: v.has_items,
                        want: v.wants_items,
                        complete: v.completed,
                        server: v.server,
                        creator: {
                            ...v.creator,
                            image: this.base_url + v.creator.image,
                        },
                        seconds: v.time_ago,
                    };
                }));
            }
            catch (e) {
                return reject(e);
            }
        });
    }
}