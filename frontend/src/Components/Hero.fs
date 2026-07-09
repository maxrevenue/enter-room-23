module MidnightLounge.Components.Hero

open Feliz
open MidnightLounge.Types

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
                        prop.text "After-hours essentials"
                    ]
                    Html.h1 [
                        prop.className "hero__title"
                        prop.children [
                            Html.text "The night is "
                            Html.em [ prop.className "hero__title-accent"; prop.text "yours" ]
                            Html.text " to keep."
                        ]
                    ]
                    Html.p [
                        prop.className "hero__sub"
                        prop.text "A quietly curated edit of intimate wellness rituals, sleepwear cut from real silk, and sensory technology tuned for the small hours."
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
