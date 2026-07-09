module Room23.State

open Elmish
open Browser
open Browser.Types
open Fable.Core.JsInterop
open Room23.Types

// ---------------------------------------------------------------------------
// init / update — the entire application state machine lives here.
// Every state transition is an explicit, exhaustive pattern match.
// ---------------------------------------------------------------------------

let init () : Model * Cmd<Msg> =
    let isAgeVerified =
        let stored = Browser.WebStorage.localStorage.getItem "room23_age_verified"
        stored = "true"
    { IsAgeVerified = isAgeVerified
      Catalog = Data.catalog
      Cart = Map.empty
      Filter = AllProducts
      IsCartOpen = false
      CurrentPage = if isAgeVerified then Storefront else NotYetVerified
      CheckoutForm = None
      OrderNumber = None
      Magazines = Data.magazines
      SelectedMagazineBrand = None
      SelectedMagazineYear = None
      SelectedMagazineCondition = None
      MagazineSort = "featured"
      SearchQuery = ""
      ActiveDetailProduct = None },
    Cmd.none

/// Lock/unlock body scroll (side effect).
let private setBodyLock (locked: bool) : Cmd<Msg> =
    Cmd.ofEffect (fun _ ->
        if locked then document.body.classList.add "is-locked"
        else document.body.classList.remove "is-locked")

let private scrollToProducts () : Cmd<Msg> =
    Cmd.ofEffect (fun _ ->
        let el = document.getElementById "products"
        if not (isNull el) then
            el?scrollIntoView (createObj [ "behavior" ==> "smooth"; "block" ==> "start" ]))

let private scrollToTop () : Cmd<Msg> =
    Cmd.ofEffect (fun _ -> window.scrollTo (0., 0.) |> ignore)

let private updateLine (pid: ProductId) (f: CartLine option -> CartLine option) (cart: Map<string, CartLine>) =
    let key = ProductId.value pid
    match f (Map.tryFind key cart) with
    | Some line -> Map.add key line cart
    | None -> Map.remove key cart

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | SetFilter filter ->
        { model with Filter = filter }, Cmd.none

    | AddToCart pid ->
        let findProduct () =
            model.Catalog
            |> List.tryFind (fun p -> p.Id = pid)
            |> Option.map (fun p -> p)
            |> Option.orElseWith (fun () ->
                model.Magazines
                |> List.tryFind (fun m -> ProductId.value (ProductId m.SKU) = ProductId.value pid)
                |> Option.map MagazineIssue.toProduct)

        match findProduct () with
        | None -> model, Cmd.none
        | Some p when p.StockCount <= 0 -> model, Cmd.none
        | Some p ->
            let cart =
                model.Cart
                |> updateLine pid (function
                    | Some line ->
                        if line.Quantity + 1 > p.StockCount then Some line  // don't exceed stock
                        else Some { line with Quantity = line.Quantity + 1 }
                    | None ->
                        Some { Product = p; Quantity = 1 })
            { model with Cart = cart }, Cmd.none

    | IncreaseQuantity pid ->
        let cart =
            model.Cart
            |> updateLine pid (Option.map (fun line -> { line with Quantity = line.Quantity + 1 }))
        { model with Cart = cart }, Cmd.none

    | DecreaseQuantity pid ->
        let cart =
            model.Cart
            |> updateLine pid (Option.bind (fun line ->
                if line.Quantity <= 1 then None
                else Some { line with Quantity = line.Quantity - 1 }))
        { model with Cart = cart }, Cmd.none

    | RemoveLine pid ->
        { model with Cart = model.Cart |> Map.remove (ProductId.value pid) }, Cmd.none

    | OpenCart ->
        { model with IsCartOpen = true }, setBodyLock true

    | CloseCart ->
        { model with IsCartOpen = false }, setBodyLock false

    | ScrollToProducts ->
        model, scrollToProducts ()

    | ScrollToMagazines ->
        Cmd.ofEffect (fun _ ->
            let el = document.getElementById "magazines"
            if not (isNull el) then
                el?scrollIntoView (createObj [ "behavior" ==> "smooth"; "block" ==> "start" ]))
        |> fun cmd -> model, cmd

    // ---- Magazine filters ----

    | SetMagazineBrand brand ->
        { model with
            SelectedMagazineBrand = brand
            SelectedMagazineYear = None },
        Cmd.none

    | SetMagazineYear year ->
        { model with SelectedMagazineYear = year }, Cmd.none

    | SetMagazineCondition condition ->
        { model with SelectedMagazineCondition = condition }, Cmd.none

    | SetMagazineSort sort ->
        { model with MagazineSort = sort }, Cmd.none

    | SetSearchQuery query ->
        { model with SearchQuery = query }, Cmd.none

    // ---- Age gate ----

    | VerifyAge true ->
        let cmd =
            Cmd.ofEffect (fun _ ->
                Browser.WebStorage.localStorage.setItem ("room23_age_verified", "true"))
        { model with
            IsAgeVerified = true
            CurrentPage = Storefront },
        cmd

    | VerifyAge false ->
        let cmd =
            Cmd.ofEffect (fun _ ->
                Browser.Dom.window.location.href <- "https://en.wikipedia.org/wiki/Age_verification")
        model, cmd

    // ---- Checkout navigation ----

    | NavigateToPage page ->
        match page with
        | Storefront ->
            { model with
                CurrentPage = Storefront
                IsCartOpen = false
                CheckoutForm = None
                OrderNumber = None },
            Cmd.batch [ setBodyLock false; scrollToTop () ]
        | Checkout ->
            { model with
                CurrentPage = Checkout
                IsCartOpen = false
                CheckoutForm = Some CheckoutForm.sandbox },
            Cmd.batch [ setBodyLock false; scrollToTop () ]
        | NotYetVerified
        | Confirmation ->
            model, Cmd.none
        | TermsOfService
        | PrivacyPolicy
        | RefundPolicy ->
            { model with CurrentPage = page }, scrollToTop ()

    | ProceedToCheckout ->
        if Map.isEmpty model.Cart then
            model, Cmd.none
        else
            { model with
                CurrentPage = Checkout
                IsCartOpen = false
                CheckoutForm = Some CheckoutForm.sandbox },
            Cmd.batch [ setBodyLock false; scrollToTop () ]

    | UpdateCheckoutField (field, value) ->
        match model.CheckoutForm with
        | None -> model, Cmd.none
        | Some form ->
            let updated =
                match field with
                | FirstName -> { form with FirstName = value }
                | LastName -> { form with LastName = value }
                | Email -> { form with Email = value }
                | Phone -> { form with Phone = value }
                | Address1 -> { form with Address1 = value }
                | Address2 -> { form with Address2 = value }
                | City -> { form with City = value }
                | State -> { form with State = value }
                | ZipCode -> { form with ZipCode = value }
                | Country -> { form with Country = value }
                | CardNumber -> { form with CardNumber = value }
                | CardExpiry -> { form with CardExpiry = value }
                | CardCvc -> { form with CardCvc = value }
                | CardName -> { form with CardName = value }
            { model with CheckoutForm = Some updated }, Cmd.none

    | PlaceOrder ->
        match model.CheckoutForm with
        | None -> model, Cmd.none
        | Some form ->
            if not (Selectors.isCheckoutValid form) then
                model, Cmd.none
            else
                let orderNumber = Selectors.generateOrderNumber ()
                // Decrement stock for each item in the cart
                let decrementedCatalog =
                    model.Catalog
                    |> List.map (fun p ->
                        match Map.tryFind (ProductId.value p.Id) model.Cart with
                        | None -> p
                        | Some line ->
                            { p with StockCount = max 0 (p.StockCount - line.Quantity) })
                let decrementedMagazines =
                    model.Magazines
                    |> List.map (fun m ->
                        match Map.tryFind m.SKU model.Cart with
                        | None -> m
                        | Some line ->
                            { m with StockCount = max 0 (m.StockCount - line.Quantity) })
                { model with
                    CurrentPage = Confirmation
                    IsCartOpen = false
                    OrderNumber = Some orderNumber
                    CheckoutForm = Some form
                    Catalog = decrementedCatalog
                    Magazines = decrementedMagazines },
                scrollToTop ()

    // ---- Product detail modal ----
    | OpenProductDetails product ->
        { model with ActiveDetailProduct = Some product }, setBodyLock true

    | CloseProductDetails ->
        { model with ActiveDetailProduct = None }, setBodyLock false

    | ReturnToStore ->
        { model with
            CurrentPage = Storefront
            IsCartOpen = false
            CheckoutForm = None
            OrderNumber = None
            Cart = Map.empty },
        scrollToTop ()

// ---------------------------------------------------------------------------
// Subscriptions — Escape key handling adapts to current page.
// ---------------------------------------------------------------------------

let subscribe (model: Model) : Sub<Msg> =
    let escListener (dispatch: Msg -> unit) : System.IDisposable =
        let handler (ev: Event) =
            let ke = ev :?> KeyboardEvent
            if ke.key = "Escape" then
                match model.CurrentPage with
                | NotYetVerified -> ()
                | Storefront -> dispatch CloseCart
                | Checkout -> dispatch (NavigateToPage Storefront)
                | Confirmation -> dispatch ReturnToStore
                | TermsOfService
                | PrivacyPolicy
                | RefundPolicy -> dispatch (NavigateToPage Storefront)
        window.addEventListener ("keydown", handler)
        { new System.IDisposable with
            member _.Dispose() = window.removeEventListener ("keydown", handler) }

    [ [ "escape-key-handler" ], escListener ]