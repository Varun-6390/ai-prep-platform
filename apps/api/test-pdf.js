const fs = require("fs");

async function main() {
  const file = process.argv[2];

  if (!file) {
    console.error("Usage: node test-pdf.js <path-to-pdf>");
    process.exit(1);
  }

  console.log("Reading:", file);

  const buffer = fs.readFileSync(file);

  console.log("PDF size:", buffer.length, "bytes");

  try {
    const { getDocumentProxy, extractText } = await import("unpdf");

    console.log("unpdf loaded");

    const data = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );

    console.log("Creating PDF document...");

    const pdf = await getDocumentProxy(data);

    console.log("PDF loaded");
    console.log("Pages:", pdf.numPages);

    console.log("Extracting text...");

    const result = await extractText(pdf, {
      mergePages: true,
    });

    console.log("Extraction completed");
    console.log("Characters:", result.text.length);

    console.log("\n--- EXTRACTED TEXT ---\n");
    console.log(result.text.slice(0, 3000));

    console.log("\nPDF TEST SUCCESS");
  } catch (error) {
    console.error("\n========== PDF TEST FAILED ==========");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Stack:", error?.stack);
    console.error("=====================================\n");

    process.exit(1);
  }
}

main();