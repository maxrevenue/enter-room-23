module MidnightLounge.State

open Elmish
open Browser
open Browser.Types
open Fable.Core.JsInterop
open MidnightLounge.Types

// ---------------------------------------------------------------------------
// init / update — the entire application state machine lives here.
// Every state transition is an explicit, exhaustive pattern match.
// ---------------------------------------------------------------------------

let init () : Model * Cmd<Msg> =
    { Catalog = Data.catalog
      Cart = Map.empty
      Filter = AllProducts
      IsCartOpen = false },
    Cmd.none

/// Lock/unlock body scroll while the drawer is open (side effect).
let private setBodyLock (locked: bool) : Cmd<Msg> =
    Cmd.ofEffect (fun _ ->
        if locked then document.body.classList.add "is-locked"
        else document.body.classList.remove "is-locked")

let private scrollToProducts () : Cmd<Msg> =
    Cmd.ofEffect (fun _ ->
        let el = document.getElementById "products"
        if not (isNull el) then
            el?scrollIntoView (createObj [ "behavior" ==> "smooth"; "block" ==> "start" ]))

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
        let cart =
            model.Cart
            |> updateLine pid (function
                | Some line -> Some { line with Quantity = line.Quantity + 1 }
                | None ->
                    model.Catalog
                    |> List.tryFind (fun p -> p.Id = pid)
                    |> Option.map (fun p -> { Product = p; Quantity = 1 }))
        { model with Cart = cart }, Cmd.none

    | IncreaseQuantity pid ->
        let cart =
            model.Cart
            |> updateLine pid (Option.map (fun line -> { line with Quantity = line.Quantity + 1 }))
        { model with Cart = cart }, Cmd.none

    | DecreaseQuantity pid ->
        // Quantity can never fall below 1 — dropping to zero removes the line.
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

// ---------------------------------------------------------------------------
// Subscriptions — close the drawer with the Escape key.
// ---------------------------------------------------------------------------

let subscribe (_model: Model) : Sub<Msg> =
    let escListener (dispatch: Msg -> unit) : System.IDisposable =
        let handler (ev: Event) =
            let ke = ev :?> KeyboardEvent
            if ke.key = "Escape" then dispatch CloseCart
        window.addEventListener ("keydown", handler)
        { new System.IDisposable with
            member _.Dispose() = window.removeEventListener ("keydown", handler) }

    [ [ "escape-closes-cart" ], escListener ]
