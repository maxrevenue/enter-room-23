module Room23.Types

// ---------------------------------------------------------------------------
// Domain types — strongly-typed records and discriminated unions give us
// absolute compile-time safety across the whole storefront.
// ---------------------------------------------------------------------------

/// Product taxonomy for the original wellness/archive catalog.
type Category =
    | IntimateWellness
    | ArchiveEssentials

module Category =
    let all = [ IntimateWellness; ArchiveEssentials ]

    let label =
        function
        | IntimateWellness -> "Intimate Wellness"
        | ArchiveEssentials -> "Archive Essentials"

    let slug =
        function
        | IntimateWellness -> "intimate-wellness"
        | ArchiveEssentials -> "archive-essentials"

type ProductId = ProductId of string

module ProductId =
    let value (ProductId id) = id

type SupplySource =
    | InHouseArchive
    | WholesalePartner
    | PrivateLabel

module SupplySource =
    let label =
        function
        | InHouseArchive -> "Room 23 Print Archive"
        | WholesalePartner -> "Partner Goods"
        | PrivateLabel -> "Room 23 Private Label"

    let location =
        function
        | InHouseArchive -> "Discreetly shipping from Los Angeles, CA"
        | WholesalePartner -> "Shipping from Partner Distribution Center"
        | PrivateLabel -> "Shipping from Fulfillment Center"

    let assetFolder =
        function
        | InHouseArchive -> "archive"
        | WholesalePartner -> "wholesale"
        | PrivateLabel -> "private-label"

/// Resolves a product image path from SKU + SupplySource.
/// Place your production photos as {SKU}.jpg in public/assets/{folder}/.
let resolveImageUrl (sku: string) (supply: SupplySource) =
    let folder = SupplySource.assetFolder supply
    sprintf "/assets/%s/%s.jpg" folder sku

type Product =
    { Id: ProductId
      Name: string
      Category: Category
      Price: float
      Tagline: string
      ImageUrl: string
      StockCount: int
      Supply: SupplySource
      WholesaleCost: float }

    member p.GrossProfit = p.Price - p.WholesaleCost
    member p.MarginPercentage =
        if p.Price = 0.0 then 0.0
        else (p.GrossProfit / p.Price) * 100.0

/// A cart line item — quantity is always >= 1 by construction (see State).
type CartLine = { Product: Product; Quantity: int }

/// Which slice of the catalog is on display.
type CatalogFilter =
    | AllProducts
    | ByCategory of Category

// ---------------------------------------------------------------------------
// Magazine domain — vintage adult magazine inventory.
// Magazines are converted to Product via toProduct() when added to cart,
// so the existing Cart / Checkout pipeline works without modification.
// ---------------------------------------------------------------------------

type MagazineBrand =
    | Playboy
    | HustlerTaboo
    | BustOut
    | Novel
    | OtherMagazine

module MagazineBrand =
    let all = [ Playboy; HustlerTaboo; BustOut; Novel; OtherMagazine ]

    let label =
        function
        | Playboy -> "Playboy"
        | HustlerTaboo -> "Hustler's Taboo"
        | BustOut -> "Bust Out"
        | Novel -> "Novel"
        | OtherMagazine -> "Other"

    let slug =
        function
        | Playboy -> "playboy"
        | HustlerTaboo -> "hustlers-taboo"
        | BustOut -> "bust-out"
        | Novel -> "novel"
        | OtherMagazine -> "other"

type MagazineIssue =
    { SKU: string
      Brand: MagazineBrand
      Year: int
      MonthOrVolume: string
      CoverFeature: string option
      Price: float
      ImageUrl: string
      Condition: string
      StockCount: int
      Supply: SupplySource
      WholesaleCost: float }

    member m.IsSoldOut = m.StockCount <= 0

module MagazineIssue =
    /// Converts a magazine to a cart-compatible Product so AddToCart works seamlessly.
    let toProduct (m: MagazineIssue) : Product =
        { Id = ProductId m.SKU
          Name = sprintf "%s — %s %d" (MagazineBrand.label m.Brand) m.MonthOrVolume m.Year
          Category = ArchiveEssentials
          Price = m.Price
          Tagline =
              match m.CoverFeature with
              | Some f -> sprintf "Cover: %s · %s" f m.Condition
              | None -> sprintf "Condition: %s · Vintage collectible" m.Condition
          ImageUrl = m.ImageUrl
          StockCount = m.StockCount
          Supply = m.Supply
          WholesaleCost = m.WholesaleCost }

// ---------------------------------------------------------------------------
// Checkout domain — immutable form state, never touches the wire directly.
// All processor credentials live exclusively in the backend; the frontend
// only submits sanitized payloads to POST /api/checkout.
// ---------------------------------------------------------------------------

type Page =
    | NotYetVerified
    | Storefront
    | Checkout
    | Confirmation
    | TermsOfService
    | PrivacyPolicy
    | RefundPolicy

type CheckoutField =
    | FirstName
    | LastName
    | Email
    | Phone
    | Address1
    | Address2
    | City
    | State
    | ZipCode
    | Country
    | CardNumber
    | CardExpiry
    | CardCvc
    | CardName

/// Sandbox payment mode — test credentials hardcoded for underwriting review.
type PaymentMode =
    | SandboxTest

module CheckoutDefaults =
    /// Underwriter test card — always succeeds in sandbox.
    let sandboxCardNumber = "4242 4242 4242 4242"
    let sandboxExpiry = "12 / 29"
    let sandboxCvc = "123"
    let sandboxCardName = "UNDERWRITER TEST"

type CheckoutForm =
    { FirstName: string
      LastName: string
      Email: string
      Phone: string
      Address1: string
      Address2: string
      City: string
      State: string
      ZipCode: string
      Country: string
      CardNumber: string
      CardExpiry: string
      CardCvc: string
      CardName: string
      PaymentMode: PaymentMode }

module CheckoutForm =
    let empty =
        { FirstName = ""
          LastName = ""
          Email = ""
          Phone = ""
          Address1 = ""
          Address2 = ""
          City = ""
          State = ""
          ZipCode = ""
          Country = "US"
          CardNumber = ""
          CardExpiry = ""
          CardCvc = ""
          CardName = ""
          PaymentMode = SandboxTest }

    /// Pre-fill with underwriter sandbox credentials for a one-click test transaction.
    let sandbox =
        { FirstName = "Morgan"
          LastName = "Underwood"
          Email = "compliance@room23.test"
          Phone = "(555) 010-0000"
          Address1 = "1 Compliance Plaza — Suite 400"
          Address2 = "Attn: Merchant Underwriting Dept."
          City = "Minneapolis"
          State = "MN"
          ZipCode = "55401"
          Country = "US"
          CardNumber = CheckoutDefaults.sandboxCardNumber
          CardExpiry = CheckoutDefaults.sandboxExpiry
          CardCvc = CheckoutDefaults.sandboxCvc
          CardName = CheckoutDefaults.sandboxCardName
          PaymentMode = SandboxTest }

// ---------------------------------------------------------------------------
// Elmish Model / Msg
// ---------------------------------------------------------------------------

type Model =
    { /// Whether the user has passed the 18+ age gate.
      IsAgeVerified: bool
      Catalog: Product list
      /// Cart keyed by product id — a Map guarantees one line per product.
      Cart: Map<string, CartLine>
      Filter: CatalogFilter
      IsCartOpen: bool
      /// Navigation state — drives which view the root renders.
      CurrentPage: Page
      /// Checkout form data — None while on Storefront, Some once entering checkout.
      CheckoutForm: CheckoutForm option
      /// Auto-generated on confirmation.
      OrderNumber: string option
      // ---- Magazine filters ----
      Magazines: MagazineIssue list
      SelectedMagazineBrand: MagazineBrand option
      SelectedMagazineYear: int option
      SelectedMagazineCondition: string option
      MagazineSort: string
      SearchQuery: string
      // ---- Product detail modal ----
      ActiveDetailProduct: Product option }

type Msg =
    | SetFilter of CatalogFilter
    | AddToCart of ProductId
    | IncreaseQuantity of ProductId
    | DecreaseQuantity of ProductId
    | RemoveLine of ProductId
    | OpenCart
    | CloseCart
    | ScrollToProducts
    | ScrollToMagazines
    // ---- Checkout navigation ----
    | NavigateToPage of Page
    | ProceedToCheckout
    | PlaceOrder
    | ReturnToStore
    | UpdateCheckoutField of CheckoutField * string
    // ---- Magazine filtering ----
    | SetMagazineBrand of MagazineBrand option
    | SetMagazineYear of int option
    | SetMagazineCondition of string option
    | SetMagazineSort of string
    | SetSearchQuery of string
    // ---- Age gate ----
    | VerifyAge of bool
    // ---- Product detail modal ----
    | OpenProductDetails of Product
    | CloseProductDetails

// ---------------------------------------------------------------------------
// Pure selectors — derived data computed from the model, never stored.
// ---------------------------------------------------------------------------

module Selectors =
    let visibleProducts (model: Model) =
        match model.Filter with
        | AllProducts -> model.Catalog
        | ByCategory category ->
            model.Catalog |> List.filter (fun p -> p.Category = category)

    /// Filtered magazine list combining brand + year filters.
    let visibleMagazines (model: Model) =
        model.Magazines
        |> List.filter (fun m ->
            (match model.SelectedMagazineBrand with
             | None -> true
             | Some b -> m.Brand = b)
            &&
            (match model.SelectedMagazineYear with
             | None -> true
             | Some y -> m.Year = y))

    /// All unique years present in the magazine catalog, descending.
    let magazineYears (model: Model) =
        model.Magazines
        |> List.map (fun m -> m.Year)
        |> List.distinct
        |> List.sortDescending

    /// All unique conditions in the magazine catalog.
    let magazineConditions (model: Model) =
        model.Magazines
        |> List.map (fun m -> m.Condition)
        |> List.distinct
        |> List.sort

    /// Sorted + filtered magazine list.
    let sortedMagazines (model: Model) =
        let query = model.SearchQuery.Trim().ToLowerInvariant()
        let filtered =
            model.Magazines
            |> List.filter (fun m ->
                (match model.SelectedMagazineBrand with
                 | None -> true
                 | Some b -> m.Brand = b)
                &&
                (match model.SelectedMagazineYear with
                 | None -> true
                 | Some y -> m.Year = y)
                &&
                (match model.SelectedMagazineCondition with
                 | None -> true
                 | Some c -> m.Condition = c)
                &&
                (if query = "" then true
                 else
                     m.SKU.ToLowerInvariant().Contains(query)
                     || (MagazineBrand.label m.Brand).ToLowerInvariant().Contains(query)
                     || (match m.CoverFeature with Some f -> f.ToLowerInvariant().Contains(query) | None -> false)
                     || sprintf "%s %d" m.MonthOrVolume m.Year |> fun s -> s.ToLowerInvariant().Contains(query)
                ))
        match model.MagazineSort with
        | "price-asc" -> filtered |> List.sortBy (fun m -> m.Price)
        | "price-desc" -> filtered |> List.sortByDescending (fun m -> m.Price)
        | "newest" -> filtered |> List.sortByDescending (fun m -> m.Year)
        | _ -> filtered  // "featured" — default order

    let cartLines (model: Model) =
        model.Cart |> Map.toList |> List.map snd

    let itemCount (model: Model) =
        model.Cart |> Map.fold (fun acc _ line -> acc + line.Quantity) 0

    let subtotal (model: Model) =
        model.Cart
        |> Map.fold (fun acc _ line -> acc + (line.Product.Price * float line.Quantity)) 0.0

    /// Estimated tax (placeholder — real tax calculated server-side).
    let tax (model: Model) = subtotal model * 0.0875

    /// Shipping is complimentary on all orders.
    let shipping (_model: Model) = 0.0

    let total (model: Model) = subtotal model + tax model + shipping model

    let formatPrice (price: float) = sprintf "$%0.2f" price

    let hasItems (model: Model) = not (Map.isEmpty model.Cart)

    let isCheckoutValid (form: CheckoutForm) =
        form.FirstName <> ""
        && form.LastName <> ""
        && form.Email <> ""
        && form.Address1 <> ""
        && form.City <> ""
        && form.State <> ""
        && form.ZipCode <> ""
        && form.CardNumber <> ""
        && form.CardExpiry <> ""
        && form.CardCvc <> ""

    /// Groups cart lines by fulfillment type for split-shipment display.
    let fulfillmentGroups (model: Model) =
        cartLines model
        |> List.groupBy (fun line -> line.Product.Supply)
        |> List.sortBy (fun (s, _) -> match s with InHouseArchive -> 0 | WholesalePartner -> 1 | PrivateLabel -> 2)

    /// Generate a deterministic order number for sandbox testing.
    let generateOrderNumber () =
        let ticks = System.DateTime.UtcNow.Ticks % 1000000L
        sprintf "R23-%06d-SBX" ticks