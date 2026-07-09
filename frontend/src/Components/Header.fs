module Room23.Components.Header

open Feliz
open Room23.Types

let private navItem (label: string) (testId: string) (isActive: bool) (onClick: unit -> unit) =
    Html.button [
        prop.className (if isActive then "header__nav-link header__nav-link--active" else "header__nav-link")
        prop.testId testId
        prop.text label
        prop.onClick (fun _ -> onClick ())
    ]

let view (model: Model) (dispatch: Msg -> unit) =
    let count = Selectors.itemCount model

    let selectAndScroll filter =
        dispatch (SetFilter filter)
        dispatch ScrollToProducts

    Html.header [
        prop.className "header"
        prop.children [
            Html.div [
                prop.className "l-container header__inner"
                prop.children [
                    Html.a [
                        prop.className "header__logo"
                        prop.testId "header-logo-link"
                        prop.href "#"
                        prop.onClick (fun e ->
                            e.preventDefault ()
                            dispatch (SetFilter AllProducts))
                        prop.children [
                            Html.span [ prop.className "header__logo-mark"; prop.text "Room" ]
                            Html.span [ prop.className "header__logo-accent"; prop.text "23" ]
                        ]
                    ]

                    Html.nav [
                        prop.className "header__nav"
                        prop.ariaLabel "Categories"
                        prop.children [
                            navItem "All" "header-nav-all"
                                (model.Filter = AllProducts)
                                (fun () -> selectAndScroll AllProducts)
                            navItem "Intimate Wellness" "header-nav-intimate-wellness"
                                (model.Filter = ByCategory IntimateWellness)
                                (fun () -> selectAndScroll (ByCategory IntimateWellness))
                            navItem "Archive Essentials" "header-nav-archive-essentials"
                                (model.Filter = ByCategory ArchiveEssentials)
                                (fun () -> selectAndScroll (ByCategory ArchiveEssentials))
                            navItem "Archive" "header-nav-archive"
                                false
                                (fun () -> dispatch ScrollToMagazines)
                        ]
                    ]

                    Html.div [
                        prop.className "header__actions"
                        prop.children [
                            Html.button [
                                prop.className "header__cart-button"
                                prop.testId "header-cart-button"
                                prop.ariaLabel "Open cart"
                                prop.onClick (fun _ -> dispatch OpenCart)
                                prop.children [
                                    Svg.svg [
                                        svg.className "header__cart-icon"
                                        svg.viewBox (0, 0, 24, 24)
                                        svg.fill "none"
                                        svg.stroke "currentColor"
                                        svg.strokeWidth 1.6
                                        svg.children [
                                            Svg.path [ svg.d "M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" ]
                                            Svg.path [ svg.d "M9 9V6a3 3 0 0 1 6 0v3" ]
                                        ]
                                    ]
                                    Html.span [ prop.className "header__cart-label"; prop.text "Cart" ]
                                    if count > 0 then
                                        Html.span [
                                            prop.key (string count)
                                            prop.className "badge badge--count badge--pop"
                                            prop.testId "cart-item-count"
                                            prop.text (string count)
                                        ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]