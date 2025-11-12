import { GoogleGenAI, Type, Modality } from "@google/genai";
import { OutfitSuggestion } from '../types';

const getAiClient = () => {
    // API_KEY is automatically injected by the environment.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey });
};

const outfitSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: {
                type: Type.STRING,
                enum: ['Formal', 'Casual', 'Stylish'],
                description: 'The type of the outfit suggestion category.',
            },
            outfits: {
                type: Type.ARRAY,
                description: 'A list of 3 distinct outfit variations for this category.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: {
                            type: Type.STRING,
                            description: 'A detailed description of this specific outfit variation.',
                        },
                        items: {
                            type: Type.ARRAY,
                            description: 'A list of clothing item names for this outfit, e.g., "White Cotton T-Shirt".',
                            items: {
                                type: Type.STRING,
                            },
                        }
                    },
                    required: ['description', 'items'],
                },
            },
        },
        required: ['type', 'outfits'],
    },
};

const getPromptStandard = (season: string, occasion: string) => `You are an elite, agentic AI fashion couturier with over two decades of experience shaping the styles of global icons. Your expertise is unparalleled, blending classic tailoring with avant-garde trends. You are not just a stylist; you are a fashion visionary.

    **Mission:** Analyze the provided full-body photograph of a client from India. Based on your analysis of their physique, the context of the photo, and unspoken style cues, you will perform a bespoke style consultation.

    **Directive:** Curate three distinct, world-class style portfolios for the client, tailored for the '${season}' season and a '${occasion}' occasion.
    1.  **Formal:** Impeccable, powerful, and sophisticated.
    2.  **Casual:** Effortlessly chic, refined, and comfortable.
    3.  **Stylish:** Trend-forward, confident, and expressive.

    **Execution Parameters:**
    *   For **each** portfolio, you must generate exactly **three** unique and complete outfit compositions.
    *   For each composition, provide a "Stylist's Rationale"—a detailed, expert description explaining the sartorial choices. This rationale must cover silhouette, fabric interplay, color theory, and suitability for the specified occasion.
    *   Provide a precise "Garment Manifest"—a list of the specific clothing items that constitute the look (e.g., "Charcoal Gray Pinstripe Wool Trousers," "Ivory Silk Camisole").
    *   The entire output must be a single, flawless JSON object adhering strictly to the provided schema. No extraneous text or conversation.
    *   Your recommendations must be modern, culturally astute, and empower the client.`;

const getPromptInDepth = (season: string, occasion: string) => `You are "Nayara," an elite personal stylist and fashion consultant with over 15 years of experience dressing high-profile clients. Your reputation is built on your meticulous, research-based approach to style. You don't just suggest clothes; you conduct an in-depth analysis of each client to architect a look that is uniquely theirs.

**TOP-SECRET MISSION BRIEF:** You have been commissioned to perform a hyper-personalized style consultation for a client from India, based on the provided full-body photograph. Your task is to go beyond surface-level suggestions and conduct deep research into what cuts, fabrics, colors, and styles will harmonize with their specific physique, skin tone, and the context of the photo.

**DIRECTIVE:** For the '${season}' season and a '${occasion}' occasion, you will architect three complete, hyper-detailed style dossiers. These are not mere suggestions; they are blueprints for a new persona.
1.  **Formal:** A look that commands respect and exudes quiet power. It should be razor-sharp, sophisticated, and memorable.
2.  **Casual:** The epitome of "sprezzatura"—a studied carelessness. It must be comfortable yet devastatingly chic and polished.
3.  **Stylish:** A masterpiece of contemporary fashion. It should be bold, intelligently on-trend, and a true expression of individuality.

**EXECUTION PARAMETERS (STRICT COMPLIANCE REQUIRED):**
*   For **each** of the three dossiers, generate exactly **three** distinct, meticulously detailed outfit compositions.
*   **Deep-Dive Rationale:** For each composition, provide an extensive "Nayara's Vision." This is not a simple description. It must deconstruct your choices with expert precision, covering:
    *   **Physique Augmentation:** How the silhouette flatters or enhances the client's body type based on an in-depth analysis of their photo.
    *   **Color Science:** A detailed explanation of the color palette and why it complements the client's presumed skin tone and the occasion.
    *   **Textural Symphony:** How the interplay of different fabrics creates depth and luxury.
*   **Complete Garment Manifest:** List every single item required, with descriptive detail. (e.g., "High-waisted, wide-leg linen trousers in a sand-beige hue," not just "pants").
*   **Accessory Blueprint:** Provide specific recommendations for footwear, jewelry, bags, and belts. Be precise.
*   **The Pro-Tip:** Include one actionable styling tip for each outfit that elevates the look from great to unforgettable (e.g., "The French tuck on the silk blouse is non-negotiable for this look to achieve its intended nonchalance.").
*   **Sourcing Guidance:** Suggest types of stores or specific, globally recognized brands (e.g., Zara, Mango, H&M for accessible fashion; or higher-end examples if appropriate) where similar pieces might be found.
*   The final output must be a single, flawless JSON object, adhering strictly to the provided schema. No introductory text, no apologies, just pure, unadulterated style intelligence.`;

export const getOutfitSuggestions = async (imageBase64: string, mimeType: string, season: string, occasion: string, inDepthMode: boolean): Promise<OutfitSuggestion[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';

    const prompt = inDepthMode
        ? getPromptInDepth(season, occasion)
        : getPromptStandard(season, occasion);

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: outfitSchema,
            },
        });

        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString) as OutfitSuggestion[];

        // Basic validation
        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            throw new Error('AI response is not a valid array of suggestions.');
        }

        return suggestions;

    } catch (error) {
        console.error("Error fetching outfit suggestions:", error);
        throw new Error("Failed to parse or receive suggestions from the AI model.");
    }
};

export const generateTryOnImages = async (imageBase64: string, mimeType: string, outfitDescription: string): Promise<string[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';

    const prompt = `Your primary and most critical task is to generate a high-quality, photorealistic image with a strict aspect ratio of 1:1. This is a non-negotiable requirement.

    Your secondary task is to perform a hyper-realistic virtual try-on. You must dress the person from the input image in the following outfit: "${outfitDescription}".

    Follow these crucial instructions with extreme precision:
    
    1.  **ASPECT RATIO (MANDATORY):** The final output image's dimensions MUST strictly conform to the 1:1 aspect ratio. The image must be a perfect square.
    
    2.  **PRESERVE THE PERSON:** It is absolutely crucial that you DO NOT change the person's face, expression, head position, hair, or skin tone. The person must be perfectly identical to the original image. Maintain their exact body shape, size, and posture.
    
    3.  **FABRIC & TEXTURE REALISM:** Render the clothing with photorealistic textures. If the outfit includes denim, it should have the correct weave and texture. If it's silk, it should have a subtle sheen and soft folds. Pay close attention to the fabric's drape, how it hangs and folds according to the person's pose.
    
    4.  **LIGHTING & SHADOWS:** The lighting on the new clothes must perfectly match the lighting in the original photo. Replicate the direction, softness, and color temperature of the light source. The shadows cast by the new clothes on the person's body, and the shadows on the clothes themselves, must be consistent with the original scene's lighting.
    
    5.  **SEAMLESS INTEGRATION:** The new outfit should look completely natural and not like a digital sticker. The edges of the clothing should blend realistically with the person's body and the background. Ensure the fabric conforms to the body's contours.
    
    6.  **BACKGROUND:** Maintain the original background. Do not alter or replace it.
    
    Generate 3 high-quality, photorealistic variations based on this prompt, with every image strictly adhering to the 1:1 aspect ratio.`;

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    const generatedImages: string[] = [];
    
    // Generate 3 images sequentially
    for (let i = 0; i < 3; i++) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    generatedImages.push(imageUrl);
                }
            }
        } catch (error) {
             console.error(`Error generating image ${i+1}:`, error);
             // If one fails, we can continue and return what we have
        }
    }
    
    if (generatedImages.length === 0) {
        throw new Error("The AI model failed to generate any images.");
    }

    return generatedImages;
};