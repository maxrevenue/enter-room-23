module MidnightLounge.Components.Footer

open Feliz

let view =
    Html.footer [
        prop.className "footer"
        prop.testId "site-footer"
        prop.children [
            Html.div [
                prop.className "l-container footer__inner"
                prop.children [
                    Html.div [
                        prop.className "footer__brand"
                        prop.children [
                            Html.span [ prop.className "footer__logo"; prop.text "Midnight Lounge" ]
                            Html.p [
                                prop.className "footer__fineprint"
                                prop.text "Crafted with F#, Fable 5, Elmish & Feliz. Type-safe from model to pixel."
                            ]
                        ]
                    ]
                    Html.div [
                        prop.className "footer__links"
                        prop.children [
                            Html.span [ prop.className "footer__link"; prop.text "Discreet shipping" ]
                            Html.span [ prop.className "footer__link"; prop.text "30-night returns" ]
                            Html.span [ prop.className "footer__link"; prop.text "Concierge · open late" ]
                        ]
                    ]
                ]
            ]
        ]
    ]
