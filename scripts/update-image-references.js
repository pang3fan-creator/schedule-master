const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

// Find all .mdx files
const mdxFiles = [
  ...glob.sync("posts/**/*.mdx", { cwd: path.join(__dirname, "..") }),
  ...glob.sync("posts/es/**/*.mdx", { cwd: path.join(__dirname, "..") }),
];

// Update pricing page
const pricingPagePath = path.join(
  __dirname,
  "../app/[locale]/pricing/page.tsx",
);

function updateMdxFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // Replace PNG with WebP in coverImage
  content = content.replace(
    /(coverImage:\s*["']?)\/blog\/([^"']+)\.png/g,
    "$1/blog/$2.webp",
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(
      `Updated: ${path.relative(path.join(__dirname, ".."), filePath)}`,
    );
    return true;
  }
  return false;
}

function updatePricingPage(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // Replace PNG with WebP in product image URLs
  content = content.replace(/\/products\/([^"']+)\.png/g, "/products/$1.webp");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(
      `Updated: ${path.relative(path.join(__dirname, ".."), filePath)}`,
    );
    return true;
  }
  return false;
}

async function main() {
  console.log("=== Updating MDX Files ===");
  let mdxCount = 0;
  for (const file of mdxFiles) {
    const fullPath = path.join(__dirname, "..", file);
    if (updateMdxFile(fullPath)) {
      mdxCount++;
    }
  }
  console.log(`Updated ${mdxCount} MDX files`);

  console.log("\n=== Updating Pricing Page ===");
  updatePricingPage(pricingPagePath);

  console.log("\n✅ All image references updated to WebP!");
}

main().catch(console.error);
