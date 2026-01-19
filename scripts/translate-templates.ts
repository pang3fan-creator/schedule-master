
import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { TEMPLATES, TemplateData } from '../lib/templates'; // Adjust path if needed
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    if (!text || !text.trim()) return text;

    const MAX_CHARS = 2000;

    if (text.length <= MAX_CHARS) {
        // Simple translation for short text
        const params = {
            SourceText: text,
            Source: sourceLang,
            Target: targetLang,
            ProjectId: 0,
        };
        try {
            const response = await client.TextTranslate(params);
            return response.TargetText;
        } catch (err) {
            console.error(`Error translating text: "${text.substring(0, 20)}..."`, err);
            return text; // Fallback to original
        }
    }

    // Split text by paragraphs for long content (reuse logic from translate-posts.ts simplified)
    const paragraphs = text.split(/\n\n+/);
    const translatedParagraphs: string[] = [];

    for (const paragraph of paragraphs) {
        if (paragraph.trim().length === 0) {
            translatedParagraphs.push('');
            continue;
        }
        // Recursive call for paragraph
        const translated = await translateText(client, paragraph, sourceLang, targetLang);
        translatedParagraphs.push(translated);
        await sleep(200);
    }

    return translatedParagraphs.join('\n\n');
}

async function translateTemplates() {
    console.log('🌐 Template Translation Script (Tencent Cloud TMT)\n');
    console.log('='.repeat(50));

    if (!TENCENT_SECRET_ID || !TENCENT_SECRET_KEY) {
        console.error('❌ Error: Tencent Cloud credentials not set in .env.local');
        process.exit(1);
    }

    const client = createTmtClient();
    const translatedTemplates: Record<string, TemplateData> = {};

    const templateSlugs = Object.keys(TEMPLATES);
    console.log(`Found ${templateSlugs.length} templates to translate to Spanish (ES)...\n`);

    for (const slug of templateSlugs) {
        const template = TEMPLATES[slug];
        console.log(`  Translating: ${template.title}...`);

        // Deep copy definition to avoid mutating original if we were running in same context (though script allows mutation of local var)
        const translated: TemplateData = { ...template };

        // Translate Fields
        translated.title = await translateText(client, template.title);
        translated.description = await translateText(client, template.description);
        await sleep(200); // Rate limit

        if (template.longDescription) {
            translated.longDescription = await translateText(client, template.longDescription);
            await sleep(300);
        }

        if (template.category) {
            translated.category = await translateText(client, template.category);
            await sleep(200);
        }

        // Translate Events
        if (translated.events && translated.events.length > 0) {
            console.log(`    - Translating ${translated.events.length} events...`);
            const translatedEvents: any[] = [];
            for (const event of translated.events) {
                const newEvent = { ...event };
                newEvent.title = await translateText(client, event.title);
                if (event.description) {
                    newEvent.description = await translateText(client, event.description);
                }
                translatedEvents.push(newEvent);
                await sleep(250); // Enforce delay between events
            }
            translated.events = translatedEvents;
        }

        translatedTemplates[slug] = translated;
        console.log(`  ✅ Done: ${slug}`);
        await sleep(500);
    }

    // Write output
    const outputPath = path.join(__dirname, '../lib/templates/es.ts');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate TypeScript file content
    const fileContent = `
import type { TemplateData } from "../templates";

export const TEMPLATES_ES: Record<string, TemplateData> = ${JSON.stringify(translatedTemplates, null, 4)};
`;

    fs.writeFileSync(outputPath, fileContent);

    console.log('\n' + '='.repeat(50));
    console.log(`\n✅ All templates translated! Saved to: ${outputPath}`);
}

translateTemplates().catch(console.error);
