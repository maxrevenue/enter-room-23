module Room23.Components.Hero

open Feliz
open Room23.Types

let view (dispatch: Msg -> unit) =
    Html.section [
        prop.className "hero"
        prop.children [
            Html.div [
                prop.className "hero__glow"
                prop.ariaHidden true
            ]
            Html.div [
                prop.className "l-container hero__inner"
                prop.children [
                    Html.p [
                        prop.className "hero__kicker"
                        prop.text "A premium vintage archive and wellness collective"
                    ]
                    Html.h1 [
                        prop.className "hero__title"
                        prop.children [
                            Html.text "Welcome to "
                            Html.em [ prop.className "hero__title-accent"; prop.text "Room 23" ]
                            Html.text "."
                        ]
                    ]
                    Html.p [
                        prop.className "hero__sub"
                        prop.text "A premium lifestyle collective featuring rare heritage print, high-performance wellness essentials, and curated sensory artifacts."
                    ]
                    Html.div [
                        prop.className "hero__cta-row"
                        prop.children [
                            Html.button [
                                prop.className "btn btn--primary"
                                prop.testId "hero-scroll-to-products-button"
                                prop.text "Explore the collection"
                                prop.onClick (fun _ -> dispatch ScrollToProducts)
                            ]
                            Html.span [
                                prop.className "hero__note"
                                prop.text "Discreet packaging · Complimentary shipping"
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]