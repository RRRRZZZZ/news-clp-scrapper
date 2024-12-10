import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function GET() {
  const eventsToEndpoint: { title: string; imgSrc: string }[] = [];

  const fetchEventsFromPage = async () => {
    const response = await fetch("https://chile.as.com/noticias/futbol/");
    const text = await response.text();
    const dom = new JSDOM(text);

    return Array.from(
      dom.window.document.querySelectorAll(".col-md-4.col-sm-6.col-xs-12")
    ).map((event) => {
      const title = event.querySelector(".s__tl a")?.textContent?.trim() || "";
      const imgSrc = event.querySelector(".mm__img")?.getAttribute("src") || "";

      return { title, imgSrc };
    });
  };

  const events = await fetchEventsFromPage();
  eventsToEndpoint.push(...events);

  const response = NextResponse.json(eventsToEndpoint);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
