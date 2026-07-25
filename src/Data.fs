module Room23.Data

open Room23.Types

// ---------------------------------------------------------------------------
// Room 23 product catalog - white-label lubricants, aromas, toys.
// Image paths auto-resolve from SKU + SupplySource via resolveImageUrl.
// Drop real photos as {SKU}.jpg into public/assets/{wholesale|private-label}/
// All products that lack images will show the CSS fallback "Product Image Coming Soon"
// ---------------------------------------------------------------------------

let private product id name category price tagline stock supply wholesaleCost =
    { Id = ProductId id
      Name = name
      Category = category
      Price = price
      Tagline = tagline
      ImageUrl = resolveImageUrl id supply
      StockCount = stock
      Supply = supply
      WholesaleCost = wholesaleCost }

let catalog: Product list =
    [ // ---- White-Label Water-Based Lubricants ----
      product "R23-LUB-WB-01" "Room 23 - Signature Water-Based Lubricant" IntimateWellness 22.00
          "High-performance water-based formula. FDA-clear ingredients. Paraben-free. 8 oz pump bottle."
          100 PrivateLabel 4.20
      product "R23-LUB-WB-02" "Room 23 - Natural Aloe Personal Lubricant" IntimateWellness 24.00
          "Organic aloe vera base with vitamin E. Hypoallergenic and glycerin-free. 6 oz tube."
          80 PrivateLabel 5.00
      product "R23-LUB-WB-03" "Room 23 - Cooling Mint Water-Based Lubricant" IntimateWellness 22.00
          "Refreshing cooling sensation. Water-based, toy-friendly, and stain-free. 8 oz pump."
          90 PrivateLabel 4.20

      // ---- White-Label Silicone & Hybrid ----
      product "R23-LUB-SL-01" "Room 23 - Platinum Silicone Lubricant" IntimateWellness 28.00
          "Ultra-concentrated silicone formula. A single drop lasts. Waterproof and condom-safe. 4 oz."
          75 PrivateLabel 6.00
      product "R23-LUB-HY-01" "Room 23 - Silk Hybrid Personal Lubricant" IntimateWellness 28.00
          "Silky hybrid water-silicone blend. Long-lasting. Compatible with all materials. 6 oz."
          80 PrivateLabel 5.50
      product "R23-LUB-AN-01" "Room 23 - Hemp-Infused Personal Lubricant" IntimateWellness 26.00
          "Broad-spectrum CBD isolate blended with organic coconut MCT oil. 4 oz pump."
          65 PrivateLabel 5.20

      // ---- Brand-Name Lubricants ----
      product "BN-LUB-01" "Pjur Original Silicone Glide - 100ml" IntimateWellness 34.00
          "Industry gold standard. Ultra-pure medical-grade silicone. Perfume-free and preservative-free."
          60 WholesalePartner 18.00
      product "BN-LUB-02" "Wicked Sensual Care - Aqua Lubricant 4oz" IntimateWellness 16.00
          "Hypoallergenic, pH-balanced water-based formula infused with olive leaf extract."
          50 WholesalePartner 8.00
      product "BN-LUB-03" "Sliquid Naturals - H2O Original 4.2oz" IntimateWellness 14.00
          "100% vegan, glycerin-free, and paraben-free. pH-balanced for sensitive skin."
          55 WholesalePartner 6.00

      // ---- Poppers / Aromas ----
      product "AR-001" "Rush - Original Liquid Incense 10ml" IntimateWellness 28.00
          "The classic. Isopropyl nitrite formula in signature yellow bottle. Fast-acting room aroma."
          40 WholesalePartner 12.00
      product "AR-002" "Jungle Juice - Platinum Aroma 10ml" IntimateWellness 30.00
          "Premium isobutyl nitrite aroma. Smooth head change with minimal after-effects."
          35 WholesalePartner 14.00
      product "AR-003" "Blue Boy - Ultra-Strength Room Aroma 10ml" IntimateWellness 26.00
          "Potent amyl-based formula. Long-lasting scent profile. Deep amber bottle for UV protection."
          30 WholesalePartner 11.00
      product "AR-004" "Amsterdam - Gold Label Liquid Aroma 10ml" IntimateWellness 32.00
          "Imported European formula. Pentyl nitrite blend. Smooth, warm character."
          25 WholesalePartner 15.00
      product "AR-005" "Iron Fist - Maximum Impact Aroma 10ml" IntimateWellness 34.00
          "Pentyl nitrite formula for experienced users. Intense, long-lasting aroma profile."
          20 WholesalePartner 16.00

      // ---- Adult Toys ----
      product "TOY-001" "Satisfyer Pro 2 - Generation 3 Air Pulse" IntimateWellness 79.00
          "Pressure-wave stimulation with 11 intensities. Whisper-quiet motor. USB magnetic charging."
          30 WholesalePartner 42.00
      product "TOY-002" "We-Vibe Chorus - Couples Vibrator" IntimateWellness 149.00
          "App-controlled C-shape couples toy. 10 vibration modes. Squeeze remote included."
          20 WholesalePartner 88.00
      product "TOY-003" "Lelo Hugo - Remote-Controlled Massager" IntimateWellness 129.00
          "Luxury silicone prostate massager. SenseMotion remote. 2 motors, 6 patterns."
          15 WholesalePartner 72.00
      product "TOY-004" "njoy Pure Wand - Stainless Steel Massager" IntimateWellness 139.00
          "Polished medical-grade stainless steel. Temperature-responsive. Double-ended design for G-spot and P-spot stimulation."
          12 WholesalePartner 78.00
      product "TOY-005" "Magic Wand Rechargeable - Cordless Massager" IntimateWellness 129.00
          "The legendary plug-in wand, now cordless. 4 intensity levels, 4 patterns. Silicone head."
          18 WholesalePartner 68.00 ]