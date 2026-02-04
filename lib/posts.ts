import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  author: string;
  featured: boolean;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

/**
 * Get the posts directory for a specific locale
 * Falls back to English (root posts/) if locale directory doesn't exist
 */
function getPostsDir(locale: string = "en"): string {
  if (locale === "en") {
    return postsDirectory;
  }

  const localeDir = path.join(postsDirectory, locale);
  if (fs.existsSync(localeDir)) {
    return localeDir;
  }

  // Fallback to English if locale directory doesn't exist
  return postsDirectory;
}

/**
 * Get all posts for a specific locale
 * @param locale - The locale to get posts for (default: 'en')
 */
export function getAllPosts(locale: string = "en"): Post[] {
  const dir = getPostsDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        category: data.category || "Uncategorized",
        date: data.date || "",
        readTime: data.readTime || "",
        coverImage: data.coverImage || "",
        author: data.author || "Anonymous",
        featured: data.featured || false,
        content,
      };
    });

  // Sort by date descending
  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Get a single post by slug for a specific locale
 * @param slug - The post slug
 * @param locale - The locale to get the post for (default: 'en')
 */
export function getPostBySlug(
  slug: string,
  locale: string = "en",
): Post | null {
  const dir = getPostsDir(locale);
  const fullPath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    excerpt: data.excerpt || "",
    category: data.category || "Uncategorized",
    date: data.date || "",
    readTime: data.readTime || "",
    coverImage: data.coverImage || "",
    author: data.author || "Anonymous",
    featured: data.featured || false,
    content,
  };
}

/**
 * Get all categories for a specific locale
 * @param locale - The locale to get categories for (default: 'en')
 */
export function getAllCategories(locale: string = "en"): string[] {
  const posts = getAllPosts(locale);
  const categories = new Set(posts.map((post) => post.category));
  return ["All", ...Array.from(categories)];
}

/**
 * Get all post slugs (for generating static params)
 * Returns slugs from English posts since slug is shared across locales
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
