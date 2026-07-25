module Room23.Types

// ---------------------------------------------------------------------------
// Domain types - strongly-typed records and discriminated unions give us
// absolute compile-time safety across the whole storefront.
// ---------------------------------------------------------------------------

/// Product taxonomy for the lubricant and intimate wellness catalog.
type Category =
    | IntimateWellness

module Category =
    let all = [ IntimateWellness ]

    let label =
        function
        | IntimateWellness -> "Intimate Wellness"

    let slug =
        function
        | IntimateWellness -> "intimate-wellness"

type ProductId = ProductId of string

module ProductId =
    let value (ProductId id) = id

type SupplySource =
    | WholesalePartner
    | PrivateLabel

module SupplySource =
    let label =
        function
        | WholesalePartner -> "Partner Goods"
        | PrivateLabel -> "Room 23 Private Label"

    let location =
        function
        | WholesalePartner -> "Shipping from Partner Distribution Center"
        | PrivateLabel -> "Shipping from Fulfillment Center"

    let assetFolder =
        function
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

/// A cart line item - quantity is always >= 1 by construction (see State).
type CartLine = { Product: Product; Quantity: int }

/// Which slice of the catalog is on display.
type CatalogFilter =
    | AllProducts
    | ByCategory of Category

// ---------------------------------------------------------------------------
// Checkout domain - immutable form state, never touches the wire directly.
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

/// Sandbox payment mode - test credentials hardcoded for underwriting review.
type PaymentMode =
    | SandboxTest

module CheckoutDefaults =
    /// Underwriter test card - always succeeds in sandbox.
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
          Email = "compliance@room23.net"
          Phone = "(555) 010-0000"
          Address1 = "1 Compliance Plaza - Suite 400"
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
      /// Cart keyed by product id - a Map guarantees one line per product.
      Cart: Map<string, CartLine>
      Filter: CatalogFilter
      IsCartOpen: bool
      /// Navigation state - drives which view the root renders.
      CurrentPage: Page
      /// Checkout form data - None while on Storefront, Some once entering checkout.
      CheckoutForm: CheckoutForm option
      /// Auto-generated on confirmation.
      OrderNumber: string option
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
    // ---- Checkout navigation ----
    | NavigateToPage of Page
    | ProceedToCheckout
    | PlaceOrder
    | ReturnToStore
    | UpdateCheckoutField of CheckoutField * string
    // ---- Age gate ----
    | VerifyAge of bool
    // ---- Product detail modal ----
    | OpenProductDetails of Product
    | CloseProductDetails

// ---------------------------------------------------------------------------
// Pure selectors - derived data computed from the model, never stored.
// ---------------------------------------------------------------------------

module Selectors =
    let visibleProducts (model: Model) =
        match model.Filter with
        | AllProducts -> model.Catalog
        | ByCategory category ->
            model.Catalog |> List.filter (fun p -> p.Category = category)

    let cartLines (model: Model) =
        model.Cart |> Map.toList |> List.map snd

    let itemCount (model: Model) =
        model.Cart |> Map.fold (fun acc _ line -> acc + line.Quantity) 0

    let subtotal (model: Model) =
        model.Cart
        |> Map.fold (fun acc _ line -> acc + (line.Product.Price * float line.Quantity)) 0.0

    /// Estimated tax (placeholder - real tax calculated server-side).
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
        |> List.sortBy (fun (s, _) -> match s with WholesalePartner -> 0 | PrivateLabel -> 1)

    /// Generate a deterministic order number for sandbox testing.
    let generateOrderNumber () =
        let ticks = System.DateTime.UtcNow.Ticks % 1000000L
        sprintf "R23-%06d-SBX" ticks