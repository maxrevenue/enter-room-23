module Room23.Data

open Room23.Types

// ---------------------------------------------------------------------------
// Premium vintage archive, wholesale partner goods, and private label catalog.
// Image paths auto-resolve from SKU + SupplySource via resolveImageUrl.
// Drop photos as {SKU}.jpg into public/assets/{archive|wholesale|private-label}/
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

// ---- Room 23 catalog ----

let catalog: Product list =
    [ // ==================== Intimate Wellness (Wholesale Partner) ====================
      product "iw-001" "Ember Glow Massage Candle" IntimateWellness 58.0
          "Slow-melting apricot wax that pours as warm massage oil."
          12 WholesalePartner 22.0
      product "iw-002" "Velour Botanical Body Oil" IntimateWellness 46.0
          "Cold-pressed jojoba and black orchid, bottled in amber glass."
          8 WholesalePartner 18.0
      product "iw-003" "Room 23 Ritual Taper Set" IntimateWellness 34.0
          "Hand-dipped beeswax tapers for unhurried evenings."
          15 WholesalePartner 12.0
      product "iw-004" "Silk Recovery Eye Mask" IntimateWellness 42.0
          "22-momme mulberry silk, blackout-lined for deeper rest."
          20 WholesalePartner 16.0

      // ==================== Wholesale Partner Goods (Supersniffer) ====================
      product "SS-CLR-01" "Supersniffer — Premium Isobutyl Room Odorizer" IntimateWellness 18.0
          "Industrial-grade overhead video head cleaner. Citronella-based formula."
          48 WholesalePartner 6.50

      product "SS-CLR-02" "Supersniffer — Pro-Grade VCR Tape Path Solvent" IntimateWellness 22.0
          "High-evaporation cleaning fluid for magnetic media equipment."
          36 WholesalePartner 8.00

      // ==================== Room 23 Private Label ====================
      product "R23-LUB-01" "Room 23 — Signature Water-Based Lubricant" IntimateWellness 22.0
          "High-performance water-based formula. FDA-clear ingredients. Paraben-free."
          100 PrivateLabel 4.20

      product "R23-LUB-02" "Room 23 — Silk Hybrid Personal Lubricant" IntimateWellness 28.0
          "Silky hybrid formula. Long-lasting. Compatible with all materials."
          80 PrivateLabel 5.50

      // ==================== Archive Essentials (In-House) ====================
      product "ae-001" "Velvet Nocturne Robe" ArchiveEssentials 189.0
          "Heavyweight velvet with a silk-satin shawl collar."
          4 InHouseArchive 65.0
      product "ae-002" "Noir Silk Kimono" ArchiveEssentials 164.0
          "Washable charmeuse silk cut in a relaxed kimono line."
          3 InHouseArchive 55.0
      product "ae-003" "Eclipse Satin Slip" ArchiveEssentials 128.0
          "Bias-cut satin slip with hand-finished button placket."
          6 InHouseArchive 42.0
      product "ae-004" "Crimson Silk Pillowcase" ArchiveEssentials 76.0
          "Deep crimson mulberry silk, gentle on skin and hair."
          10 InHouseArchive 28.0

      // ==================== Archive Essentials Audio (Wholesale) ====================
      product "ae-005" "Aurora Over-Ear Headphones" ArchiveEssentials 349.0
          "Adaptive noise cancelling for immersive listening."
          5 WholesalePartner 180.0
      product "ae-006" "Pulse Portable Speaker" ArchiveEssentials 229.0
          "Room-filling low end with a warm crimson glow ring."
          7 WholesalePartner 110.0
      product "ae-007" "Nocturne Wireless Earbuds" ArchiveEssentials 179.0
          "Eight-hour buds with a soft-touch charging capsule."
          9 WholesalePartner 85.0
      product "ae-008" "Umbra Ambient Speaker" ArchiveEssentials 259.0
          "Sculptural bookshelf speaker voiced for intimate rooms."
          4 WholesalePartner 130.0 ]

// ---- Vintage magazine catalog (In-House collectibles) ----

let private makeMagazine sku brand year monthOrVol coverFeature price condition stock wholesaleCost =
    { SKU = sku
      Brand = brand
      Year = year
      MonthOrVolume = monthOrVol
      CoverFeature = coverFeature
      Price = price
      ImageUrl = resolveImageUrl sku InHouseArchive
      Condition = condition
      StockCount = stock
      Supply = InHouseArchive
      WholesaleCost = wholesaleCost }

let magazines: MagazineIssue list =
    [ // ==================== Playboy — Archive Collectibles ====================
      makeMagazine "PB-1980-01" Playboy 1980 "January"
          (Some "Special Anniversary Issue — Steve Martin interview, Alvin Toffler's future shock analysis, and vintage winter editorial lookbooks.")
          16.00 "Very Good" 1 3.00

      makeMagazine "PB-1981-02" Playboy 1981 "February"
          (Some "Classic Valentine-era edition — 'Imagine These Girls Next Door' feature, Tom Snyder interview, and retro electronics gaming retrospectives.")
          18.00 "Good" 1 4.00

      makeMagazine "PB-1985-03" Playboy 1985 "March"
          (Some "Mid-80s culture feature — '60 Minutes' investigative dive, Carl Lewis profile, and the legendary annual Playmates of the Year editorial.")
          18.00 "Very Good" 1 4.00

      // ==================== Bust Out! — 1990s Collectibles ====================
      makeMagazine "BO-1995-06" BustOut 1995 "June"
          (Some "Rare 90s vintage print collective — covergirl Buxom Brittany, Casey James profile, and specialized counter-culture modeling features.")
          24.00 "Good" 1 5.00

      makeMagazine "BO-1995-09" BustOut 1995 "September"
          (Some "Late-summer 1995 collectors issue — highly sought-after Crystal Storm cover spread and Lilli Xene retrospectives.")
          24.00 "Fine" 1 5.00

      makeMagazine "BO-1995-10" BustOut 1995 "October"
          (Some "Autumn 1995 high-end print collective — Marsha Mellons, Traci Teeze, and the annual layout playoffs.")
          24.00 "Very Good" 1 5.00 ]
