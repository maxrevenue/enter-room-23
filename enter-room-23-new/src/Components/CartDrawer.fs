module Room23.Components.CartDrawer

open Feliz
open Room23.Types

let private lineItem (dispatch: Msg -> unit) (line: CartLine) =
    let p = line.Product
    Html.div [
        prop.className "cart-item"
        prop.testId "cart-line-item"
        prop.key (ProductId.value p.Id)
        prop.children [
            Html.img [
                prop.className "cart-item__thumb"
                prop.src p.ImageUrl
                prop.alt p.Name
            ]
            Html.div [
                prop.className "cart-item__info"
                prop.children [
                    Html.p [ prop.className "cart-item__name"; prop.text p.Name ]
                    Html.p [
                        prop.className "cart-item__meta"
                        prop.text (sprintf "%s · %s" (Category.label p.Category) (Selectors.formatPrice p.Price))
                    ]
                    Html.div [
                        prop.className "cart-item__controls"
                        prop.children [
                            Html.div [
                                prop.className "qty-stepper"
                                prop.children [
                                    Html.button [
                                        prop.className "qty-stepper__btn"
                                        prop.testId "cart-qty-decrease-button"
                                        prop.ariaLabel (sprintf "Decrease quantity of %s" p.Name)
                                        prop.text "−"
                                        prop.onClick (fun _ -> dispatch (DecreaseQuantity p.Id))
                                    ]
                                    Html.span [
                                        prop.className "qty-stepper__value"
                                        prop.testId "cart-qty-value"
                                        prop.text (string line.Quantity)
                                    ]
                                    Html.button [
                                        prop.className "qty-stepper__btn"
                                        prop.testId "cart-qty-increase-button"
                                        prop.ariaLabel (sprintf "Increase quantity of %s" p.Name)
                                        prop.text "+"
                                        prop.onClick (fun _ -> dispatch (IncreaseQuantity p.Id))
                                    ]
                                ]
                            ]
                            Html.button [
                                prop.className "cart-item__remove"
                                prop.testId "cart-remove-line-item-button"
                                prop.text "Remove"
                                prop.onClick (fun _ -> dispatch (RemoveLine p.Id))
                            ]
                        ]
                    ]
                ]
            ]
            Html.span [
                prop.className "cart-item__line-total"
                prop.testId "cart-line-total-text"
                prop.text (Selectors.formatPrice (p.Price * float line.Quantity))
            ]
        ]
    ]

let private emptyState =
    Html.div [
        prop.className "drawer__empty"
        prop.testId "cart-drawer-empty-state"
        prop.children [
            Html.div [ prop.className "drawer__empty-rule"; prop.ariaHidden true ]
            Html.p [ prop.className "drawer__empty-title"; prop.text "Your cart is still asleep." ]
            Html.p [
                prop.className "drawer__empty-sub"
                prop.text "Explore the collection and add something worth staying up for."
            ]
        ]
    ]

let view (model: Model) (dispatch: Msg -> unit) =
    let lines = Selectors.cartLines model
    let subtotal = Selectors.subtotal model
    let isOpen = model.IsCartOpen

    React.Fragment [
        Html.div [
            prop.className (if isOpen then "drawer-overlay is-open" else "drawer-overlay")
            prop.testId "cart-drawer-overlay"
            prop.onClick (fun _ -> dispatch CloseCart)
        ]

        Html.aside [
            prop.className (if isOpen then "drawer is-open" else "drawer")
            prop.testId "cart-drawer"
            prop.role "dialog"
            prop.custom ("aria-modal", "true")
            prop.ariaLabel "Shopping cart"
            prop.children [
                Html.div [
                    prop.className "drawer__header"
                    prop.children [
                        Html.h2 [ prop.className "drawer__title"; prop.text "Your Cart" ]
                        Html.button [
                            prop.className "drawer__close"
                            prop.testId "cart-drawer-close-button"
                            prop.ariaLabel "Close cart"
                            prop.text "×"
                            prop.onClick (fun _ -> dispatch CloseCart)
                        ]
                    ]
                ]

                Html.div [
                    prop.className "drawer__content"
                    prop.children [
                        if List.isEmpty lines then emptyState
                        else yield! (lines |> List.map (lineItem dispatch))
                    ]
                ]

                Html.div [
                    prop.className "drawer__footer"
                    prop.children [
                        Html.div [
                            prop.className "drawer__totals"
                            prop.children [
                                Html.div [
                                    prop.className "drawer__total-row"
                                    prop.children [
                                        Html.span [ prop.text "Subtotal" ]
                                        Html.span [
                                            prop.testId "cart-subtotal-text"
                                            prop.text (Selectors.formatPrice subtotal)
                                        ]
                                    ]
                                ]
                                Html.div [
                                    prop.className "drawer__total-row drawer__total-row--muted"
                                    prop.children [
                                        Html.span [ prop.text "Shipping" ]
                                        Html.span [ prop.text "Complimentary" ]
                                    ]
                                ]
                                Html.div [
                                    prop.className "drawer__total-row drawer__total-row--grand"
                                    prop.children [
                                        Html.span [ prop.text "Total" ]
                                        Html.span [
                                            prop.testId "cart-total-text"
                                            prop.text (Selectors.formatPrice subtotal)
                                        ]
                                    ]
                                ]
                            ]
                        ]
                        Html.button [
                            prop.className "btn btn--checkout"
                            prop.testId "cart-checkout-button"
                            prop.disabled (List.isEmpty lines)
                            prop.text "Proceed to Checkout"
                            prop.onClick (fun _ -> dispatch ProceedToCheckout)
                        ]
                    ]
                ]
            ]
        ]
    ]
