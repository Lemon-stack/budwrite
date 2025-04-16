import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export async function GET() {
  try {
    // Replace with your Google Form's published URL
    const formUrl = process.env.GOOGLE_FORM_URL;
    if (!formUrl) {
      return NextResponse.json(
        { error: "Google Form URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(formUrl);
    const html = await response.text();

    // Parse the HTML to extract testimonials
    const testimonials: Testimonial[] = [];
    const $ = cheerio.load(html);

    // Example parsing logic - adjust based on your form's structure
    $(".entry").each((_, element) => {
      const quote = $(element).find(".quote").text().trim();
      const name = $(element).find(".name").text().trim();
      const role = $(element).find(".role").text().trim();

      if (quote && name && role) {
        testimonials.push({
          quote,
          author: name,
          role,
        });
      }
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
