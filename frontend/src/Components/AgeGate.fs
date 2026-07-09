module Room23.Components.AgeGate

open Feliz
open Room23.Types

let view (dispatch: Msg -> unit) =
    Html.div [
        prop.className "agegate-overlay"
        prop.testId "age-gate-overlay"
        prop.children [
            Html.div [
                prop.className "agegate__backdrop"
                prop.ariaHidden true
            ]
            Html.div [
                prop.className "agegate__dialog"
                prop.children [
                    // Logo mark
                    Html.div [
                        prop.className "agegate__logo"
                        prop.children [
                            Html.span [ prop.className "agegate__logo-mark"; prop.text "Room" ]
                            Html.span [ prop.className "agegate__logo-accent"; prop.text "23" ]
                        ]
                    ]

                    // Divider accent line
                    Html.div [
                        prop.className "agegate__rule"
                        prop.ariaHidden true
                    ]

                    // Heading
                    Html.h1 [
                        prop.className "agegate__heading"
                        prop.text "ARCHIVE ACCESS"
                    ]

                    // Body
                    Html.p [
                        prop.className "agegate__body"
                        prop.text "This digital archive contains historical, mature, and collectible print media. You must be 18 years of age or older to enter."
                    ]

                    // Actions
                    Html.div [
                        prop.className "agegate__actions"
                        prop.children [
                            Html.button [
                                prop.className "agegate__btn agegate__btn--enter"
                                prop.testId "age-gate-enter-button"
                                prop.text "I AM 18 OR OLDER — ENTER"
                                prop.onClick (fun _ -> dispatch (VerifyAge true))
                            ]
                            Html.button [
                                prop.className "agegate__btn agegate__btn--exit"
                                prop.testId "age-gate-exit-button"
                                prop.text "EXIT"
                                prop.onClick (fun _ -> dispatch (VerifyAge false))
                            ]
                        ]
                    ]

                    // Footer
                    Html.p [
                        prop.className "agegate__footer"
                        prop.text "By entering, you confirm you meet the legal age requirements in your jurisdiction."
                    ]
                ]
            ]
        ]
    ]