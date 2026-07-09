module MidnightLounge.Data

open MidnightLounge.Types

// ---------------------------------------------------------------------------
// The catalog — strongly typed, embedded in the client for V1.
// Swap this for a remote API call (Cmd.OfPromise) when a backend arrives.
// ---------------------------------------------------------------------------

let private product id name category price tagline imageUrl =
    { Id = ProductId id
      Name = name
      Category = category
      Price = price
      Tagline = tagline
      ImageUrl = imageUrl }

let private img url = url + "?auto=format&fit=crop&w=900&q=75"

let catalog: Product list =
    [ // -------------------- Intimate Wellness --------------------
      product "iw-001" "Ember Glow Massage Candle" IntimateWellness 58.0
          "Slow-melting apricot wax that pours as warm massage oil."
          (img "https://images.unsplash.com/photo-1668954443518-34de30690425")
      product "iw-002" "Velour Botanical Body Oil" IntimateWellness 46.0
          "Cold-pressed jojoba and black orchid, bottled in amber glass."
          (img "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108")
      product "iw-003" "Midnight Ritual Taper Set" IntimateWellness 34.0
          "Hand-dipped beeswax tapers for unhurried evenings."
          (img "https://images.unsplash.com/photo-1732716465680-90ee380d29c3")
      product "iw-004" "Silk Recovery Eye Mask" IntimateWellness 42.0
          "22-momme mulberry silk, blackout-lined for deeper rest."
          (img "https://images.unsplash.com/photo-1617897903246-719242758050")

      // -------------------- Night Apparel --------------------
      product "na-001" "Velvet Nocturne Robe" NightApparel 189.0
          "Heavyweight velvet with a silk-satin shawl collar."
          (img "https://images.unsplash.com/photo-1759229874871-1dd3fb8c4619")
      product "na-002" "Noir Silk Kimono" NightApparel 164.0
          "Washable charmeuse silk cut in a relaxed kimono line."
          (img "https://images.unsplash.com/photo-1646388456472-489570b90714")
      product "na-003" "Eclipse Satin Slip" NightApparel 128.0
          "Bias-cut satin slip with hand-finished button placket."
          (img "https://images.unsplash.com/photo-1632070149653-36ab4e55e3d1")
      product "na-004" "Crimson Silk Pillowcase" NightApparel 76.0
          "Deep crimson mulberry silk, gentle on skin and hair."
          (img "https://images.unsplash.com/photo-1631679706909-1844bbd07221")

      // -------------------- Sensory Tech --------------------
      product "st-001" "Aurora Over-Ear Headphones" SensoryTech 349.0
          "Adaptive noise cancelling tuned for late-night listening."
          (img "https://images.unsplash.com/photo-1605170876472-db58e15c430e")
      product "st-002" "Pulse Portable Speaker" SensoryTech 229.0
          "Room-filling low end with a warm crimson glow ring."
          (img "https://images.unsplash.com/photo-1558537348-c0f8e733989d")
      product "st-003" "Nocturne Wireless Earbuds" SensoryTech 179.0
          "Eight-hour buds with a soft-touch charging capsule."
          (img "https://images.unsplash.com/photo-1640901821270-6e9c47fbdc07")
      product "st-004" "Umbra Ambient Speaker" SensoryTech 259.0
          "Sculptural bookshelf speaker voiced for intimate rooms."
          (img "https://images.unsplash.com/photo-1545454675-3531b543be5d") ]
