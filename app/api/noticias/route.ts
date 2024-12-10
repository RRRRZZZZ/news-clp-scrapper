import { NextResponse, NextRequest } from "next/server";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function GET(request: Request) {
  const eventsToEndpoint: any[] = [];

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

  return NextResponse.json(eventsToEndpoint);
}
