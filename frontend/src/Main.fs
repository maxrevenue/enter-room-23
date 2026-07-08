module MidnightLounge.Main

open Elmish
open Elmish.React
open Feliz

// ---- POC: minimal Elmish MVU proving the Fable 5 + Feliz + Vite toolchain ----

type Model = { Count: int }

type Msg =
    | Increment
    | Decrement

let init () : Model * Cmd<Msg> = { Count = 0 }, Cmd.none

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none

let view (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.style [
            style.minHeight (length.vh 100)
            style.display.flex
            style.flexDirection.column
            style.alignItems.center
            style.justifyContent.center
            style.backgroundColor "#121212"
            style.color "#FFFFFF"
            style.fontFamily "Inter, sans-serif"
        ]
        prop.children [
            Html.h1 [
                prop.testId "poc-title"
                prop.text "Midnight Lounge — Fable 5 POC"
            ]
            Html.p [
                prop.testId "poc-count"
                prop.style [ style.color "#FF2D55"; style.fontSize (length.px 32) ]
                prop.text (string model.Count)
            ]
            Html.div [
                prop.children [
                    Html.button [
                        prop.testId "poc-dec"
                        prop.text "-"
                        prop.onClick (fun _ -> dispatch Decrement)
                    ]
                    Html.button [
                        prop.testId "poc-inc"
                        prop.text "+"
                        prop.onClick (fun _ -> dispatch Increment)
                    ]
                ]
            ]
        ]
    ]

Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
