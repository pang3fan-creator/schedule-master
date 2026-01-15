/**
 * Blog Article Translation Script using Tencent Cloud TMT API
 * 
 * Usage:
 *   1. Install SDK: npm install tencentcloud-sdk-nodejs-tmt
 *   2. Set environment variables in .env.local:
 *      TENCENT_SECRET_ID=your-secret-id
 *      TENCENT_SECRET_KEY=your-secret-key
 *   3. Run: npx tsx scripts/translate-posts.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { createRequire } from 'module';

// Create require for CommonJS module
const require = createRequire(import.meta.url);
const tencentcloud = require('tencentcloud-sdk-nodejs-tmt');
const TmtClient = tencentcloud.tmt.v20180321.Client;

// Configuration from environment
const TENCENT_SECRET_ID = process.env.TENCENT_SECRET_ID;
const TENCENT_SECRET_KEY = process.env.TENCENT_SECRET_KEY;
const TENCENT_REGION = 'ap-guangzhou';

// Initialize TMT client
function createTmtClient() {
    const clientConfig = {
        credential: {
            secretId: TENCENT_SECRET_ID,
            secretKey: TENCENT_SECRET_KEY,
        },
        region: TENCENT_REGION,
        profile: {
            httpProfile: {
                endpoint: 'tmt.tencentcloudapi.com',
            },
        },
    };
    return new TmtClient(clientConfig);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateText(client: any, text: string, sourceLang: string = 'en', targetLang: string = 'es'): Promise<string> {
    const MAX_CHARS = 2000;

    if (text.length <= MAX_CHARS) {
        const params = {
            SourceText: text,
            Source: sourceLang,
            Target: targetLang,
            ProjectId: 0,
        };
        const response = await client.TextTranslate(params);
        return response.TargetText;
    }

    // Split text by paragraphs for long content
    const paragraphs = text.split(/\n\n+/);
    const translatedParagraphs: string[] = [];

    for (const paragraph of paragraphs) {
        if (paragraph.trim().length === 0) {
            translatedParagraphs.push('');
            continue;
        }

        if (paragraph.length > MAX_CHARS) {
            // Further split long paragraphs
            const sentences = paragraph.split(/(?<=[.!?。！？])\s+/);
            let chunk = '';
            const translatedChunks: string[] = [];

            for (const sentence of sentences) {
                if ((chunk + sentence).length > MAX_CHARS && chunk) {
                    const params = {
                        SourceText: chunk,
                        Source: sourceLang,
                        Target: targetLang,
                        ProjectId: 0,
                    };
                    const response = await client.TextTranslate(params);
                    translatedChunks.push(response.TargetText);
                    await sleep(200);
                    chunk = sentence;
                } else {
                    chunk += (chunk ? ' ' : '') + sentence;
                }
            }

            if (chunk) {
                const params = {
                    SourceText: chunk,
                    Source: sourceLang,
                    Target: targetLang,
                    ProjectId: 0,
                };
                const response = await client.TextTranslate(params);
                translatedChunks.push(response.TargetText);
            }

            translatedParagraphs.push(translatedChunks.join(' '));
        } else {
            const params = {
                SourceText: paragraph,
                Source: sourceLang,
                Target: targetLang,
                ProjectId: 0,
            };
            const response = await client.TextTranslate(params);
            translatedParagraphs.push(response.TargetText);
        }

        await sleep(200);
    }

    return translatedParagraphs.join('\n\n');
}

async function translateMdxFile(client: any, inputPath: string, outputPath: string): Promise<void> {
    console.log(`\n📄 Translating: ${path.basename(inputPath)}`);

    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    console.log('  ├─ Translating title...');
    const translatedTitle = await translateText(client, frontmatter.title || '');
    await sleep(300);

    console.log('  ├─ Translating excerpt...');
    const translatedExcerpt = await translateText(client, frontmatter.excerpt || '');
    await sleep(300);

    console.log('  ├─ Translating content...');
    const translatedContent = await translateText(client, content);

    const translatedFrontmatter = {
        ...frontmatter,
        title: translatedTitle,
        excerpt: translatedExcerpt,
    };

    const outputContent = matter.stringify(translatedContent, translatedFrontmatter);

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, outputContent);
    console.log(`  └─ ✅ Saved to: ${outputPath}`);
}

async function main() {
    console.log('🌐 Blog Article Translation Script (Tencent Cloud TMT)\n');
    console.log('='.repeat(50));

    if (!TENCENT_SECRET_ID || !TENCENT_SECRET_KEY) {
        console.error('❌ Error: Tencent Cloud credentials not set');
        console.log('\nTo set up:');
        console.log('  1. Get SecretId/SecretKey from: https://console.cloud.tencent.com/cam/capi');
        console.log('  2. Add to .env.local:');
        console.log('     TENCENT_SECRET_ID=your-secret-id');
        console.log('     TENCENT_SECRET_KEY=your-secret-key');
        process.exit(1);
    }

    const client = createTmtClient();
    const postsDir = path.join(process.cwd(), 'posts');
    const outputDir = path.join(postsDir, 'es');

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
    console.log(`Found ${files.length} articles to translate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
        const inputPath = path.join(postsDir, file);
        const outputPath = path.join(outputDir, file);

        try {
            await translateMdxFile(client, inputPath, outputPath);
            successCount++;
            await sleep(1000);
        } catch (error) {
            console.error(`  └─ ❌ Error: ${error}`);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n✅ Translation complete!`);
    console.log(`   Success: ${successCount} | Errors: ${errorCount}`);
    console.log(`\n📁 Translated files saved to: ${outputDir}`);
}

main().catch(console.error);
