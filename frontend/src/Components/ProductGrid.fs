module MidnightLounge.Components.ProductGrid

open Feliz
open MidnightLounge.Types

let private filterChip (label: string) (testId: string) (isActive: bool) (onClick: unit -> unit) =
    Html.button [
        prop.className (if isActive then "chip chip--active" else "chip")
        prop.testId testId
        prop.text label
        prop.onClick (fun _ -> onClick ())
    ]

let private productCard (dispatch: Msg -> unit) (p: Product) =
    Html.article [
        prop.className "product-card"
        prop.testId "product-card"
        prop.key (ProductId.value p.Id)
        prop.children [
            Html.div [
                prop.className "product-card__media"
                prop.children [
                    Html.img [
                        prop.className "product-card__img"
                        prop.src p.ImageUrl
                        prop.alt p.Name
                        prop.loading.lazy'
                    ]
                ]
            ]
            Html.div [
                prop.className "product-card__body"
                prop.children [
                    Html.span [
                        prop.className "product-card__tag"
                        prop.testId "product-category-tag"
                        prop.text (Category.label p.Category)
                    ]
                    Html.h3 [ prop.className "product-card__title"; prop.text p.Name ]
                    Html.p [ prop.className "product-card__tagline"; prop.text p.Tagline ]
                    Html.div [
                        prop.className "product-card__actions"
                        prop.children [
                            Html.span [
                                prop.className "product-card__price"
                                prop.testId "product-price-text"
                                prop.text (Selectors.formatPrice p.Price)
                            ]
                            Html.button [
                                prop.className "btn btn--card"
                                prop.testId "product-add-to-cart-button"
                                prop.text "Add to Cart"
                                prop.onClick (fun _ -> dispatch (AddToCart p.Id))
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]

let view (model: Model) (dispatch: Msg -> unit) =
    let products = Selectors.visibleProducts model

    Html.section [
        prop.className "l-section catalog"
        prop.id "products"
        prop.children [
            Html.div [
                prop.className "l-container"
                prop.children [
                    Html.div [
                        prop.className "catalog__heading"
                        prop.children [
                            Html.h2 [ prop.className "catalog__title"; prop.text "The Collection" ]
                            Html.p [
                                prop.className "catalog__count"
                                prop.testId "catalog-count-text"
                                prop.text (sprintf "%d pieces" (List.length products))
                            ]
                        ]
                    ]

                    Html.div [
                        prop.className "chip-row"
                        prop.children [
                            filterChip "All" "category-filter-all"
                                (model.Filter = AllProducts)
                                (fun () -> dispatch (SetFilter AllProducts))
                            filterChip "Intimate Wellness" "category-filter-intimate-wellness"
                                (model.Filter = ByCategory IntimateWellness)
                                (fun () -> dispatch (SetFilter (ByCategory IntimateWellness)))
                            filterChip "Night Apparel" "category-filter-night-apparel"
                                (model.Filter = ByCategory NightApparel)
                                (fun () -> dispatch (SetFilter (ByCategory NightApparel)))
                            filterChip "Sensory Tech" "category-filter-sensory-tech"
                                (model.Filter = ByCategory SensoryTech)
                                (fun () -> dispatch (SetFilter (ByCategory SensoryTech)))
                        ]
                    ]

                    Html.div [
                        prop.className "product-grid"
                        prop.testId "product-grid"
                        prop.children (products |> List.map (productCard dispatch))
                    ]
                ]
            ]
        ]
    ]
