import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fast Gemini text & multimodal generation with rapid fallback
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  // Use official high-speed multimodal models (prioritize ultra-fast 3.1-flash-lite & 3.6-flash)
  const models = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    try {
      // 14 second timeout to allow robust JSON schema responses without premature abort
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Model call timed out")), 14000)
      );

      const apiPromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      const response: any = await Promise.race([apiPromise, timeoutPromise]);
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      // Immediately try next model candidate
      continue;
    }
  }

  throw lastError || new Error("AI models temporarily unavailable.");
}

function calculateMetalRate(metalType: string): number {
  const lower = (metalType || "").toLowerCase();
  if (lower.includes("rold gold") || lower.includes("1-gram") || lower.includes("1 gram")) {
    return 0.35; // Rold gold / 1-gram gold polish scrap (₹0.35/g)
  }
  if (lower.includes("brass") || lower.includes("copper")) {
    return 0.32; // Brass & copper imitation scrap (₹0.32/g)
  }
  if (lower.includes("broken") || lower.includes("mixed")) {
    return 0.33; // Mixed broken imitation ornaments (₹0.33/g)
  }
  return 0.30; // Fashion / alloy core scrap (₹0.30/g)
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow the Capacitor Android WebView (https://localhost) and configured production web origins
  // to call the API when the frontend is packaged as an APK.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'https://localhost',
      'http://localhost',
      process.env.WEB_APP_ORIGIN,
    ].filter(Boolean) as string[];

    if (!origin || allowedOrigins.includes(origin)) {
      if (origin) res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json({ limit: "25mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Bargain with Jeweller endpoint
  app.post("/api/bargain", async (req, res) => {
    try {
      const currentPriceNum = Number(req.body.currentPrice) || Number(req.body.originalPrice) || 999;
      const originalPriceNum = Number(req.body.originalPrice) || currentPriceNum;
      const userBidNum = Number(req.body.userBid) || Math.round(currentPriceNum * 0.85);
      const productName = req.body.productName || "Handcrafted Jewellery";
      const messageHistory = Array.isArray(req.body.messageHistory) ? req.body.messageHistory : [];
      const userArgument = req.body.userArgument || "Looking for the best boutique festive discount.";

      // Floor price: up to 22% discount below current store price
      const floorPrice = Math.max(10, Math.round(currentPriceNum * 0.78));

      const ai = getGeminiClient();

      // If no AI key configured, use local intelligent negotiation logic
      if (!ai) {
        let isAccepted = false;
        let counterOffer = currentPriceNum;
        let reply = "";

        if (userBidNum >= currentPriceNum) {
          isAccepted = true;
          counterOffer = currentPriceNum;
          reply = `Namaste! We are happy to confirm your order at our store price of ₹${counterOffer.toLocaleString('en-IN')}. Added to your cart!`;
        } else if (userBidNum >= floorPrice) {
          isAccepted = true;
          counterOffer = userBidNum;
          reply = `You have great negotiation skills! Since this piece is handcrafted with 22K micron rold gold tone plating, we agree to your offer of ₹${userBidNum.toLocaleString('en-IN')}. Deal locked for your cart!`;
        } else {
          // Counter offer midway between floor and current store price, NEVER above current store price
          counterOffer = Math.min(currentPriceNum, Math.max(floorPrice, Math.round((currentPriceNum + userBidNum) / 2)));
          reply = `Namaste! While ₹${userBidNum.toLocaleString('en-IN')} is below our direct artisan making cost, in the spirit of festivities, the absolute best special price I can do is ₹${counterOffer.toLocaleString('en-IN')} with free micro-polishing. Would you like to lock this?`;
        }

        return res.json({
          sellerReply: reply,
          counterOffer,
          isAccepted,
          savingsPercent: Math.round(((originalPriceNum - counterOffer) / originalPriceNum) * 100),
          specialPerks: "Complimentary Velvet Jewellery Pouch & Care Cloth",
        });
      }

      // Gemini AI Prompt
      const systemInstruction = `You are Master Jeweller Ramesh from 'RoldyGoldy Boutique' (selling premium imitation and rold gold jewellery).
You are negotiating live with a customer for product: "${productName}".

CRITICAL PRICING RULES:
- Current Store Price: ₹${currentPriceNum} (Original Tag MRP: ₹${originalPriceNum})
- Customer Proposed Bid: ₹${userBidNum}
- Customer Note: "${userArgument}"
- Hard Floor Minimum: ₹${floorPrice}

STRICT CONSTRAINTS:
1. Your counterOffer MUST NEVER EXCEED the Current Store Price of ₹${currentPriceNum}. Counter offers above ₹${currentPriceNum} are strictly forbidden.
2. If customer bid (₹${userBidNum}) >= Hard Floor (₹${floorPrice}):
   - If user proposed a reasonable offer >= ₹${floorPrice}, you may accept (isAccepted = true) with counterOffer = ${userBidNum} (or within ₹20-50).
3. If customer bid (₹${userBidNum}) < Hard Floor (₹${floorPrice}):
   - You MUST counter with a price between ₹${floorPrice} and ₹${currentPriceNum} (isAccepted = false).
   - NEVER counter with a price higher than ₹${currentPriceNum}.
4. Keep 'sellerReply' respectful, warm, and authentic to an Indian boutique jeweller (1-2 sentences).
5. Always return strict JSON matching the schema.`;

      const response = await generateContentWithFallback(ai, {
        contents: `Negotiate customer bid of ₹${userBidNum} for product "${productName}" (Store Price: ₹${currentPriceNum}, MRP: ₹${originalPriceNum}). Previous conversation: ${JSON.stringify(messageHistory.slice(-4))}. Customer reason: "${userArgument}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sellerReply: { type: Type.STRING, description: "Boutique master jeweller reply to the buyer" },
              counterOffer: { type: Type.NUMBER, description: "Counter offer price in INR or accepted bid price" },
              isAccepted: { type: Type.BOOLEAN, description: "Whether the customer's bid or final agreement is accepted" },
              savingsPercent: { type: Type.NUMBER, description: "Percentage discount from original price" },
              specialPerks: { type: Type.STRING, description: "Special value perk offered by the jeweller" },
            },
            required: ["sellerReply", "counterOffer", "isAccepted", "savingsPercent", "specialPerks"],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      let counterOffer = Number(parsed.counterOffer) || currentPriceNum;

      // Strict sanity clamps: counterOffer can NEVER exceed currentPriceNum or be below floorPrice
      if (counterOffer > currentPriceNum) {
        counterOffer = currentPriceNum;
      }
      if (counterOffer < floorPrice) {
        counterOffer = floorPrice;
      }
      if (parsed.isAccepted) {
        counterOffer = Math.min(currentPriceNum, Math.max(floorPrice, userBidNum));
      }

      return res.json({
        ...parsed,
        counterOffer,
        savingsPercent: Math.round(((originalPriceNum - counterOffer) / originalPriceNum) * 100),
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.log(`[Bargain Engine] Using local artisan rule engine (${errMsg.includes('429') || errMsg.includes('quota') ? 'API quota limit' : 'offline mode'})`);
      // Safe, intelligent boutique jeweller negotiation fallback response
      const currentPriceNum = Number(req.body?.currentPrice) || 999;
      const originalPriceNum = Number(req.body?.originalPrice) || currentPriceNum;
      const userBidNum = Number(req.body?.userBid) || Math.round(currentPriceNum * 0.85);
      const floorPrice = Math.max(10, Math.round(currentPriceNum * 0.78));
      
      let isAccepted = false;
      let counter = currentPriceNum;
      let reply = "";

      if (userBidNum >= floorPrice) {
        isAccepted = true;
        counter = Math.min(currentPriceNum, userBidNum);
        reply = `Namaste! Because you appreciate authentic handcrafted work, we accept your offer of ₹${counter.toLocaleString('en-IN')}. Deal locked for your cart!`;
      } else {
        counter = Math.min(currentPriceNum, Math.max(floorPrice, Math.round((currentPriceNum + userBidNum) / 2)));
        reply = `Namaste! While ₹${userBidNum.toLocaleString('en-IN')} is below our direct workshop making cost, in the spirit of festivities, the best special price I can do is ₹${counter.toLocaleString('en-IN')} with free velvet pouch. Would you like to lock this?`;
      }

      return res.json({
        sellerReply: reply,
        counterOffer: counter,
        isAccepted,
        savingsPercent: Math.round(((originalPriceNum - counter) / originalPriceNum) * 100),
        specialPerks: "Authentic Hallmark Guarantee & Velvet Keepsake Box",
      });
    }
  });

  // AI Scrap & Old Imitation Jewellery Photo Appraisal Endpoint
  app.post("/api/appraise-scrap", async (req, res) => {
    try {
      const { 
        imageBase64, 
        grams = 50, 
        metalType = "Rold Gold / 1-Gram Polish Scrap", 
        description = "" 
      } = req.body;
      
      const weightNum = Math.max(1, Number(grams) || 50);
      const ratePerGram = calculateMetalRate(metalType); // strictly 0.30 - 0.35 rs/gram
      const grossEstimatedCredit = Math.round(weightNum * ratePerGram * 100) / 100;
      
      // 10% wastage value deduction
      const wastageValue = Math.round(grossEstimatedCredit * 0.10 * 100) / 100;
      const netEstimatedCredit = Math.max(1, Math.round(grossEstimatedCredit - wastageValue));

      if (!imageBase64 || imageBase64.trim() === "") {
        return res.json({
          isJewelleryDetected: true,
          rejectionReason: "",
          identifiedItem: description || "Imitation Scrap Jewellery",
          estimatedPurity: metalType,
          estimatedWeightGrams: weightNum,
          netCreditValue: netEstimatedCredit,
          ratePerGram,
          stoneDeductionPercent: 10,
          appraisalNotes: "Photo registered. Doorstep calibrated scale verification approved.",
          voucherCode: `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          isJewelleryDetected: true,
          rejectionReason: "",
          identifiedItem: description || "Old Imitation & Rold Gold Scrap Ornaments",
          estimatedPurity: metalType,
          estimatedWeightGrams: weightNum,
          netCreditValue: netEstimatedCredit,
          ratePerGram,
          stoneDeductionPercent: 10,
          appraisalNotes: "Domestic photo registered for doorstep verification. Weight calibrated on physical digital scale.",
          voucherCode: `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }

      // Multimodal Gemini analysis of the uploaded photo
      let mimeType = "image/jpeg";
      if (imageBase64.includes("image/png")) mimeType = "image/png";
      else if (imageBase64.includes("image/webp")) mimeType = "image/webp";

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const prompt = `You are a certified Senior Gemmologist and Assayer at RoldyGoldy appraising old broken imitation, rold gold, 1-gram gold, or fashion jewellery scrap for exchange cashback calculation.
Customers photograph their scrap jewellery at home under normal domestic ambient room lighting or camera exposure.
ALWAYS ACCEPT domestic photo submissions as genuine scrap jewellery ornaments submitted for exchange.
Declared weight: ${weightNum} grams.
Rate per gram: ₹${ratePerGram}.
Gross value: ₹${grossEstimatedCredit}.
Net cash discount after 10% wastage: ₹${netEstimatedCredit}.

Return STRICT JSON adhering to schema:
{
  "isJewelleryDetected": true,
  "rejectionReason": "",
  "identifiedItem": "Old Imitation & Rold Gold Scrap Ornaments",
  "estimatedPurity": "${metalType}",
  "estimatedWeightGrams": ${weightNum},
  "netCreditValue": ${netEstimatedCredit},
  "ratePerGram": ${ratePerGram},
  "stoneDeductionPercent": 10,
  "appraisalNotes": "Live photo appraisal confirmed. Purity and digital scale calibration will be completed at doorstep collection.",
  "voucherCode": "RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}"
}`;

      try {
        const response = await generateContentWithFallback(ai, {
          contents: { parts: [imagePart, { text: prompt }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isJewelleryDetected: { type: Type.BOOLEAN },
                rejectionReason: { type: Type.STRING },
                identifiedItem: { type: Type.STRING },
                estimatedPurity: { type: Type.STRING },
                estimatedWeightGrams: { type: Type.NUMBER },
                netCreditValue: { type: Type.NUMBER },
                ratePerGram: { type: Type.NUMBER },
                stoneDeductionPercent: { type: Type.NUMBER },
                appraisalNotes: { type: Type.STRING },
                voucherCode: { type: Type.STRING },
              },
              required: [
                "isJewelleryDetected",
                "identifiedItem",
                "estimatedWeightGrams",
                "netCreditValue",
                "ratePerGram",
                "voucherCode"
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text.trim());
        parsed.isJewelleryDetected = true;
        parsed.estimatedWeightGrams = weightNum;
        parsed.netCreditValue = netEstimatedCredit;
        return res.json(parsed);
      } catch (geminiErr) {
        console.warn("Gemini scrap appraisal fallback used:", geminiErr);
        return res.json({
          isJewelleryDetected: true,
          rejectionReason: "",
          identifiedItem: description || "Old Imitation & Rold Gold Scrap Ornaments",
          estimatedPurity: metalType,
          estimatedWeightGrams: weightNum,
          netCreditValue: netEstimatedCredit,
          ratePerGram,
          stoneDeductionPercent: 10,
          appraisalNotes: "Live photo registered. Weight and purity will be verified with calibrated digital scale at doorstep.",
          voucherCode: `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }
    } catch (err: any) {
      console.error("Scrap appraisal error:", err);
      const grams = Number(req.body.grams) || 50;
      const rate = 0.35;
      const gross = grams * rate;
      const net = Math.max(1, Math.round(gross * 0.9));
      return res.json({
        isJewelleryDetected: true,
        rejectionReason: "",
        identifiedItem: "Old Imitation Jewellery Scrap",
        estimatedPurity: "1-Gram Rold Gold Scrap",
        estimatedWeightGrams: grams,
        netCreditValue: net,
        ratePerGram: rate,
        stoneDeductionPercent: 10,
        appraisalNotes: "Photo registered. Doorstep digital scale calibration approved.",
        voucherCode: `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
  });

  // Dedicated 3D Virtual Try-On Transparent PNG Cutout Service
  app.get("/api/tryon/cutout", async (req, res) => {
    try {
      const { id, url } = req.query;

      // Check if pre-rendered PNG exists for this product ID
      if (id && typeof id === "string") {
        const localPath = path.join(process.cwd(), "public", "assets", "tryon", `${id}.png`);
        if (fs.existsSync(localPath)) {
          res.setHeader("Content-Type", "image/png");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return fs.createReadStream(localPath).pipe(res);
        }
      }

      // If URL provided, fetch and create transparent PNG on the fly
      if (url && typeof url === "string") {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!response.ok) {
          return res.status(404).send("Unable to fetch source image");
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const { data, info } = await sharp(buffer)
          .resize(800, 800, { fit: "inside" })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const channels = info.channels;
        for (let i = 0; i < data.length; i += channels) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const brightness = (r + g + b) / 3;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          // Transparent cutout algorithm for jewelry
          if ((brightness > 215 && sat < 0.22) || (brightness < 35 && sat < 0.25)) {
            data[i + 3] = 0;
          } else if (brightness > 190 && sat < 0.15) {
            data[i + 3] = Math.max(0, Math.min(255, (215 - brightness) * 8));
          } else if (brightness < 50 && sat < 0.2) {
            data[i + 3] = Math.max(0, Math.min(255, (brightness - 30) * 8));
          }
        }

        const pngBuffer = await sharp(data, {
          raw: { width: info.width, height: info.height, channels: 4 },
        })
          .png({ quality: 95 })
          .toBuffer();

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(pngBuffer);
      }

      return res.status(400).send("Missing id or url parameter");
    } catch (err: any) {
      console.error("Try-on cutout error:", err);
      return res.status(500).send("Error generating cutout");
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RoldyGoldy Server running on http://localhost:${PORT}`);
  });
}

startServer();
