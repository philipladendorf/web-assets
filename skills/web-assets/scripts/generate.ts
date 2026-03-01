/**
 * Web Assets Generator
 *
 * Generates images using Google Gemini for web project assets.
 * Requires GOOGLE_API_KEY environment variable.
 *
 * Usage:
 *   npx tsx generate.ts --prompt "..." --output "./image" [--aspect-ratio "16:9"]
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

interface Args {
	prompt: string;
	output: string;
	aspectRatio?: string;
}

function parseArgs(): Args {
	const args = process.argv.slice(2);
	const result: Partial<Args> = {};

	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--prompt' && args[i + 1]) {
			result.prompt = args[i + 1];
			i++;
		} else if (args[i] === '--output' && args[i + 1]) {
			result.output = args[i + 1];
			i++;
		} else if (args[i] === '--aspect-ratio' && args[i + 1]) {
			result.aspectRatio = args[i + 1];
			i++;
		}
	}

	if (!result.prompt) {
		console.error('Error: --prompt is required');
		process.exit(1);
	}

	if (!result.output) {
		console.error('Error: --output is required');
		process.exit(1);
	}

	return result as Args;
}

function getClient(): GoogleGenAI {
	const apiKey = process.env.GOOGLE_API_KEY;
	if (!apiKey) {
		console.error('Error: GOOGLE_API_KEY environment variable is required.');
		console.error('Get one at https://aistudio.google.com/apikey');
		process.exit(1);
	}
	return new GoogleGenAI({ apiKey });
}

function ensureDir(filePath: string): void {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function addAspectRatioToPrompt(prompt: string, aspectRatio?: string): string {
	if (!aspectRatio) return prompt;

	const ratioDescriptions: Record<string, string> = {
		'1:1': 'square format (1:1 aspect ratio)',
		'16:9': 'widescreen format (16:9 aspect ratio)',
		'21:9': 'ultrawide format (21:9 aspect ratio)',
		'4:3': 'standard format (4:3 aspect ratio)',
		'3:4': 'portrait format (3:4 aspect ratio)',
		'1.91:1':
			'landscape format suitable for Open Graph (1.91:1 aspect ratio, 1200x630 pixels)',
		'2:1': 'landscape format (2:1 aspect ratio)',
	};

	const description = ratioDescriptions[aspectRatio];
	if (description) {
		return `${prompt}. Generate in ${description}.`;
	}

	return `${prompt}. Generate with ${aspectRatio} aspect ratio.`;
}

async function generateImage(
	client: GoogleGenAI,
	prompt: string,
	outputPath: string,
): Promise<void> {
	console.log(`Generating image...`);
	console.log(`Output: ${outputPath}.[png/jpg]`);

	try {
		const response = await client.models.generateContent({
			model: 'gemini-3.1-flash-image-preview',
			contents: prompt,
			config: {
				responseModalities: ['image', 'text'],
			},
		});

		const parts = response.candidates?.[0]?.content?.parts;
		if (!parts) {
			console.error('No response parts returned');
			process.exit(1);
		}

		for (const part of parts) {
			if (part.inlineData?.data) {
				const ext = part.inlineData.mimeType === 'image/png' ? 'png' : 'jpg';
				const finalPath = `${outputPath}.${ext}`;

				ensureDir(finalPath);

				const buffer = Buffer.from(part.inlineData.data, 'base64');
				fs.writeFileSync(finalPath, buffer);

				console.log(`\n✓ Saved: ${finalPath}`);
				console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
				return;
			}
		}

		console.error('No image data in response');
		console.error('Response parts:', JSON.stringify(parts, null, 2));
		process.exit(1);
	} catch (err) {
		console.error('Generation failed:', err);
		process.exit(1);
	}
}

async function main(): Promise<void> {
	const args = parseArgs();
	const client = getClient();

	const finalPrompt = addAspectRatioToPrompt(args.prompt, args.aspectRatio);

	console.log(`\n--- Web Assets Generator ---\n`);
	console.log(
		`Prompt: ${finalPrompt.substring(0, 100)}${finalPrompt.length > 100 ? '...' : ''}\n`,
	);

	await generateImage(client, finalPrompt, args.output);
}

main();
