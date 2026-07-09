module MidnightLounge.App

open Feliz
open MidnightLounge.Types
open MidnightLounge.Components

// ---------------------------------------------------------------------------
// Root view — pure function of (Model, dispatch).
// ---------------------------------------------------------------------------

let view (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "app-shell"
        prop.children [
            Header.view model dispatch
            Html.main [
                prop.children [
                    Hero.view dispatch
                    ProductGrid.view model dispatch
                ]
            ]
            Footer.view
            CartDrawer.view model dispatch
        ]
    ]
