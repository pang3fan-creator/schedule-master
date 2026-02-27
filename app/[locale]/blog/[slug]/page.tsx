import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/date-format";
import { PageLayout } from "@/components/PageLayout";
import { BlogCard } from "@/components/BlogCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Use English posts for slugs since slugs are shared across locales
  const posts = getAllPosts("en");
  // Generate for all locales and all slugs
  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    })),
  );
}

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tryschedule.com";

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "Blog" });

  if (!post) {
    return {
      title: t("detail.postNotFound"),
    };
  }

  const blogUrl =
    locale === "en"
      ? `${baseUrl}/blog/${slug}`
      : `${baseUrl}/${locale}/blog/${slug}`;

  return {
    title: `${post.title} | TrySchedule Blog`,
    description: post.excerpt || post.title,
    keywords: [
      t(`categories.${post.category.toLowerCase()}`).toLowerCase(),
      "schedule builder",
      "scheduling tips",
      "productivity",
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage || "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: [post.coverImage || "/opengraph-image.png"],
    },
    alternates: {
      canonical: blogUrl,
      languages: {
        en: `${baseUrl}/blog/${slug}`,
        es: `${baseUrl}/es/blog/${slug}`,
        "x-default": `${baseUrl}/blog/${slug}`,
      },
    },
  };
}

// Generate Article Schema for structured data
function generateArticleSchema(
  post: ReturnType<typeof getPostBySlug>,
  slug: string,
  locale: string,
) {
  if (!post) return null;

  const dateStr = post.date ? new Date(post.date).toISOString() : undefined;
  const blogUrl =
    locale === "en"
      ? `${baseUrl}/blog/${slug}`
      : `${baseUrl}/${locale}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverImage || `${baseUrl}/opengraph-image.png`,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${baseUrl}/blog`,
    },
    publisher: {
      "@type": "Organization",
      name: "TrySchedule",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    datePublished: dateStr,
    dateModified: dateStr,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
  };
}

// Simple markdown parser for basic formatting
function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === "ul") {
        elements.push(
          <ul
            key={key++}
            className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300"
          >
            {currentList.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: formatInline(item) }}
              />
            ))}
          </ul>,
        );
      } else {
        elements.push(
          <ol
            key={key++}
            className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300"
          >
            {currentList.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: formatInline(item) }}
              />
            ))}
          </ol>,
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        "<code class='bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-900 dark:text-gray-100'>$1</code>",
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-blue-600 dark:text-blue-400 hover:underline'>$1</a>",
      );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4"
        >
          {line.replace("## ", "")}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={key++}
          className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3"
        >
          {line.replace("### ", "")}
        </h3>,
      );
      continue;
    }

    // Image
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      const [, alt, src] = imageMatch;
      elements.push(
        <figure key={key++} className="my-8">
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || "Blog image"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {alt && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 italic">
              {alt}
            </figcaption>
          )}
        </figure>,
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote
          key={key++}
          className="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-600 dark:text-gray-300 bg-blue-50/50 dark:bg-blue-900/20 rounded-r"
        >
          {line.replace("> ", "").replace(/"/g, "")}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(line.replace(/^[-*]\s/, ""));
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(line.replace(/^\d+\.\s*/, ""));
      continue;
    }

    // Table
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList();
      const tableLines: string[] = [line];
      let j = i + 1;
      while (
        j < lines.length &&
        lines[j].trim().startsWith("|") &&
        lines[j].trim().endsWith("|")
      ) {
        tableLines.push(lines[j]);
        j++;
      }
      i = j - 1;

      if (tableLines.length >= 2) {
        const parseRow = (row: string) => {
          return row
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim());
        };

        const headerCells = parseRow(tableLines[0]);
        const dataRows = tableLines.slice(2).map(parseRow);

        elements.push(
          <div
            key={key++}
            className="my-6 overflow-x-auto rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
          >
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {headerCells.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      className="border-b-2 border-r border-gray-300 dark:border-gray-600 last:border-r-0 px-4 py-3 text-left text-sm font-bold text-gray-800 dark:text-gray-200"
                      dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p
        key={key++}
        className="text-gray-700 dark:text-gray-300 leading-relaxed my-4"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />,
    );
  }

  flushList();
  return elements;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "Blog" });

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = getAllPosts(locale);
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  // Generate Article Schema
  const articleSchema = generateArticleSchema(post, slug, locale);
  const blogUrl =
    locale === "en"
      ? `${baseUrl}/blog/${slug}`
      : `${baseUrl}/${locale}/blog/${slug}`;
  const blogListUrl = locale === "en" ? "/blog" : `/${locale}/blog`;

  return (
    <>
      {/* Article Schema JSON-LD */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <PageLayout contentPadding="">
        {/* Article Header */}
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: t("breadcrumb.home"), href: "/" },
                { label: t("breadcrumb.blog"), href: blogListUrl },
                { label: post.title },
              ]}
            />
          </div>

          <div className="text-center mb-8">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {t(`categories.${post.category.toLowerCase()}`)}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl leading-tight">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date, locale)}</span>
              <span>•</span>
              <span>
                {t("readTime", { minutes: parseInt(post.readTime) || 0 })}
              </span>
            </div>
          </div>

          {/* Article Card Wrapper */}
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 md:p-10 shadow-sm mb-12">
            {/* Cover Image */}
            <div className="mb-10 rounded-xl overflow-hidden aspect-[16/9] relative">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center text-blue-300 dark:text-blue-500">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300">
              {parseMarkdown(post.content)}
            </div>

            {/* Share Section */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("detail.share")}
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(blogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                {t("detail.relatedArticles")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.slug}
                    {...relatedPost}
                    featured={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AdSense 广告单元 */}
          <div className="mt-12 max-w-4xl mx-auto px-4">
            <AdSenseUnit adSlot="4997547205" />
          </div>
        </article>
      </PageLayout>
    </>
  );
}
