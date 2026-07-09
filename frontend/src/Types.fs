module MidnightLounge.Types

// ---------------------------------------------------------------------------
// Domain types — strongly-typed records and discriminated unions give us
// absolute compile-time safety across the whole storefront.
// ---------------------------------------------------------------------------

/// Product taxonomy — adding a case forces every match in the app to handle it.
type Category =
    | IntimateWellness
    | NightApparel
    | SensoryTech

module Category =
    let all = [ IntimateWellness; NightApparel; SensoryTech ]

    let label =
        function
        | IntimateWellness -> "Intimate Wellness"
        | NightApparel -> "Night Apparel"
        | SensoryTech -> "Sensory Tech"

    let slug =
        function
        | IntimateWellness -> "intimate-wellness"
        | NightApparel -> "night-apparel"
        | SensoryTech -> "sensory-tech"

type ProductId = ProductId of string

module ProductId =
    let value (ProductId id) = id

type Product =
    { Id: ProductId
      Name: string
      Category: Category
      Price: float
      Tagline: string
      ImageUrl: string }

/// A cart line item — quantity is always >= 1 by construction (see State).
type CartLine = { Product: Product; Quantity: int }

/// Which slice of the catalog is on display.
type CatalogFilter =
    | AllProducts
    | ByCategory of Category

// ---------------------------------------------------------------------------
// Elmish Model / Msg
// ---------------------------------------------------------------------------

type Model =
    { Catalog: Product list
      /// Cart keyed by product id — a Map guarantees one line per product.
      Cart: Map<string, CartLine>
      Filter: CatalogFilter
      IsCartOpen: bool }

type Msg =
    | SetFilter of CatalogFilter
    | AddToCart of ProductId
    | IncreaseQuantity of ProductId
    | DecreaseQuantity of ProductId
    | RemoveLine of ProductId
    | OpenCart
    | CloseCart
    | ScrollToProducts

// ---------------------------------------------------------------------------
// Pure selectors — derived data computed from the model, never stored.
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

    let formatPrice (price: float) = sprintf "$%0.2f" price
