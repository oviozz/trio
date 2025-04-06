
import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Initialize the Google Gen AI client with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

// Define the model ID for Gemini 2.0 Flash experimental
const MODEL_ID = "gemini-2.0-flash-exp-image-generation"

export async function POST(req: NextRequest) {
    try {
        // Parse JSON request
        const requestData = await req.json()
        const { productImage, userImage } = requestData

        if (!productImage || !userImage) {
            return NextResponse.json({ error: "Product image and user image are required" }, { status: 400 })
        }

        // Prepare the message parts
        const messageParts = []

        // Add the text prompt
        messageParts.push({
            text: "Generate a image of the user person wearing this clothing item. Maintain the person's identity and proportions accurately.",
        })

        // Add the user image
        if (userImage) {
            const userImageParts = userImage.split(",")
            if (userImageParts.length < 2) {
                throw new Error("Invalid user image format")
            }

            const userBase64Image = userImageParts[1]
            const userMimeType = userImage.includes("image/png") ? "image/png" : "image/jpeg"

            messageParts.push({
                inlineData: {
                    data: userBase64Image,
                    mimeType: userMimeType,
                },
            })
        }

        // Add the product image
        if (productImage) {
            // Handle both URL and base64 formats
            if (productImage.startsWith("data:")) {
                const productImageParts = productImage.split(",")
                if (productImageParts.length < 2) {
                    throw new Error("Invalid product image format")
                }

                const productBase64Image = productImageParts[1]
                const productMimeType = productImage.includes("image/png") ? "image/png" : "image/jpeg"

                messageParts.push({
                    inlineData: {
                        data: productBase64Image,
                        mimeType: productMimeType,
                    },
                })
            } else {
                // If it's a URL, we need to fetch it first
                try {
                    const imageResponse = await fetch(productImage)
                    const imageBuffer = await imageResponse.arrayBuffer()
                    const base64Image = Buffer.from(imageBuffer).toString("base64")
                    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg"

                    messageParts.push({
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    })
                } catch (error) {
                    console.error("Error fetching product image:", error)
                    throw new Error("Failed to fetch product image")
                }
            }
        }

        // Generate the content
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: [{ role: "user", parts: messageParts }],
            config: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                responseModalities: ["Text", "Image"],
            },
        })

        let textResponse = null
        let imageData = null
        let mimeType = "image/png"

        if (!response?.candidates?.[0]?.content?.parts) {
            throw new Error("Invalid response structure from Gemini API");
        }

        // Process the response
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if ("inlineData" in part && part.inlineData) {
                    // Get the image data
                    imageData = part.inlineData.data
                    mimeType = part.inlineData.mimeType || "image/png"
                } else if ("text" in part && part.text) {
                    // Store the text
                    textResponse = part.text
                    console.log(textResponse);
                }
            }
        }

        // Return the base64 image and description as JSON
        return NextResponse.json({
            resultImageUrl: imageData ? `data:${mimeType};base64,${imageData}` : null,
            description: textResponse,
        })
    } catch (error) {
        console.error("Error generating image:", error)
        return NextResponse.json(
            {
                error: "Failed to generate try-on image",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}

