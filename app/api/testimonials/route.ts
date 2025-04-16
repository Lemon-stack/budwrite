import { NextResponse } from "next/server";

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
    const testimonials = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Example parsing logic - adjust based on your form's structure
    const entries = doc.querySelectorAll(".entry");
    entries.forEach((entry) => {
      const quote = entry.querySelector(".quote")?.textContent;
      const name = entry.querySelector(".name")?.textContent;
      const role = entry.querySelector(".role")?.textContent;

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
