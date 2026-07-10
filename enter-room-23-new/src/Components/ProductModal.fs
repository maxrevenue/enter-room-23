module Room23.Components.ProductModal

open Feliz
open Room23.Types

let view (model: Model) (dispatch: Msg -> unit) =
    match model.ActiveDetailProduct with
    | None -> Html.none
    | Some product ->
        let isSoldOut = product.StockCount <= 0
        let categoryLabel = Category.label product.Category
        let fulfillmentLabel = SupplySource.label product.Supply

        Html.div [
            prop.className "productmodal-overlay"
            prop.testId "product-detail-modal"
            prop.onClick (fun _ -> dispatch CloseProductDetails)
            prop.children [
                // Backdrop click → close
                Html.div [ prop.className "productmodal__backdrop"; prop.ariaHidden true ]

                // Modal card — stop propagation so inner clicks don't close
                Html.div [
                    prop.className "productmodal__card"
                    prop.onClick (fun e -> e.stopPropagation ())
                    prop.children [
                        // Close button
                        Html.button [
                            prop.className "productmodal__close"
                            prop.testId "product-detail-close-button"
                            prop.ariaLabel "Close details"
                            prop.text "×"
                            prop.onClick (fun _ -> dispatch CloseProductDetails)
                        ]

                        // ---- Content grid ----
                        Html.div [
                            prop.className "productmodal__grid"
                            prop.children [
                                // Left: Image
                                Html.div [
                                    prop.className "productmodal__media"
                                    prop.children [
                                        Html.img [
                                            prop.className "productmodal__img"
                                            prop.src product.ImageUrl
                                            prop.alt product.Name
                                        ]
                                    ]
                                ]

                                // Right: Details
                                Html.div [
                                    prop.className "productmodal__info"
                                    prop.children [
                                        // Category tag
                                        Html.span [
                                            prop.className "productmodal__tag"
                                            prop.text categoryLabel
                                        ]

                                        // Title
                                        Html.h2 [
                                            prop.className "productmodal__title"
                                            prop.text product.Name
                                        ]

                                        // Description
                                        Html.p [
                                            prop.className "productmodal__description"
                                            prop.text product.Tagline
                                        ]

                                        // Fulfillment badge
                                        Html.span [
                                            prop.className "productmodal__fulfillment"
                                            prop.text fulfillmentLabel
                                        ]

                                        // Stock status
                                        Html.div [
                                            prop.className "productmodal__stock"
                                            prop.children [
                                                Html.span [ prop.className "productmodal__stock-label"; prop.text "Availability:" ]
                                                if isSoldOut then
                                                    Html.span [
                                                        prop.className "productmodal__stock-value productmodal__stock-value--soldout"
                                                        prop.text "Sold Out"
                                                    ]
                                                else if product.StockCount <= 3 then
                                                    Html.span [
                                                        prop.className "productmodal__stock-value productmodal__stock-value--low"
                                                        prop.text (sprintf "Only %d left" product.StockCount)
                                                    ]
                                                else
                                                    Html.span [
                                                        prop.className "productmodal__stock-value"
                                                        prop.text (sprintf "%d in stock" product.StockCount)
                                                    ]
                                            ]
                                        ]

                                        // Price + action
                                        Html.div [
                                            prop.className "productmodal__actions"
                                            prop.children [
                                                Html.span [
                                                    prop.className "productmodal__price"
                                                    prop.text (Selectors.formatPrice product.Price)
                                                ]
                                                if isSoldOut then
                                                    Html.span [
                                                        prop.className "productmodal__soldout-btn"
                                                        prop.text "Sold Out"
                                                    ]
                                                else
                                                    Html.button [
                                                        prop.className "btn btn--checkout"
                                                        prop.testId "product-detail-add-to-cart-button"
                                                        prop.text "Add to Cart"
                                                        prop.onClick (fun _ ->
                                                            dispatch (AddToCart product.Id)
                                                            dispatch CloseProductDetails)
                                                    ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]