module Room23.Components.Footer

open Feliz
open Room23.Types

let view (dispatch: Msg -> unit) =
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
                            Html.span [ prop.className "footer__logo"; prop.text "Room 23" ]
                            Html.p [
                                prop.className "footer__fineprint"
                                prop.text "A premium vintage archive and wellness collective. Built with F#, Fable 5, Elmish & Feliz."
                            ]
                        ]
                    ]
                    Html.div [
                        prop.className "footer__links"
                        prop.children [
                            Html.button [
                                prop.className "footer__link"
                                prop.text "Terms of Service"
                                prop.onClick (fun _ -> dispatch (NavigateToPage TermsOfService))
                            ]
                            Html.button [
                                prop.className "footer__link"
                                prop.text "Privacy Policy"
                                prop.onClick (fun _ -> dispatch (NavigateToPage PrivacyPolicy))
                            ]
                            Html.button [
                                prop.className "footer__link"
                                prop.text "Refund & Returns"
                                prop.onClick (fun _ -> dispatch (NavigateToPage RefundPolicy))
                            ]
                        ]
                    ]
                ]
            ]
            Html.div [
                prop.className "l-container"
                prop.children [
                    Html.div [
                        prop.className "footer__compliance"
                        prop.children [
                            Html.span [ prop.className "footer__compliance-text"; prop.text "Operated by AW Holdings LLC | Contact: support@room23.test" ]
                        ]
                    ]
                ]
            ]
        ]
    ]