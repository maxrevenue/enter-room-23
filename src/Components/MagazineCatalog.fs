module Room23.Components.MagazineCatalog

open Feliz
open Room23.Types

// ---------------------------------------------------------------------------
// Huckberry-style premium archive layout — sidebar filters + search + sortable grid.
// ---------------------------------------------------------------------------

let private sidebarFilterLabel (label: string) (isActive: bool) (onClick: unit -> unit) (count: int) =
    Html.button [
        prop.className (if isActive then "archive-sidebar__item archive-sidebar__item--active" else "archive-sidebar__item")
        prop.onClick (fun _ -> onClick ())
        prop.children [
            Html.span [ prop.className "archive-sidebar__item-label"; prop.text label ]
            Html.span [ prop.className "archive-sidebar__item-count"; prop.text (sprintf "(%d)" count) ]
        ]
    ]

// ---------------------------------------------------------------------------
// Condition pill badge — subtle colour mapping
// ---------------------------------------------------------------------------
let private conditionBadge (condition: string) =
    let cssClass =
        match condition with
        | "Fine" -> "condition-pill condition-pill--fine"
        | "Very Good" -> "condition-pill condition-pill--verygood"
        | "Good" -> "condition-pill condition-pill--good"
        | _ -> "condition-pill"
    Html.span [
        prop.className cssClass
        prop.text condition
    ]

// ---------------------------------------------------------------------------
// Archive Verified badge — authenticity signal
// ---------------------------------------------------------------------------
let private archiveVerifiedBadge =
    Html.span [
        prop.className "archive-verified"
        prop.children [
            Html.span [ prop.className "archive-verified__icon"; prop.text "✓" ]
            Html.span [ prop.text "Archive Verified" ]
        ]
    ]

// ---------------------------------------------------------------------------
// Premium magazine card — underwriter-ready anatomy.
// Each card displays: thumbnail, SKU, brand/title, condition pill, price, Archive Verified badge.
// ---------------------------------------------------------------------------

let private magazineCard (dispatch: Msg -> unit) (m: MagazineIssue) =
    Html.article [
        prop.className "archive-card"
        prop.testId "magazine-card"
        prop.key m.SKU
        prop.children [
            // ---- Image box ----
            Html.div [
                prop.className "archive-card__media"
                prop.onClick (fun _ -> dispatch (OpenProductDetails (MagazineIssue.toProduct m)))
                prop.children [
                    Html.img [
                        prop.className "archive-card__img"
                        prop.src m.ImageUrl
                        prop.alt (sprintf "%s — %s %d" (MagazineBrand.label m.Brand) m.MonthOrVolume m.Year)
                        prop.custom ("loading", "lazy")
                    ]
                    // Sold out overlay
                    if m.IsSoldOut then
                        Html.span [
                            prop.className "archive-card__soldout"
                            prop.text "Sold Out"
                        ]
                    else
                        Html.button [
                            prop.className "archive-card__quickadd"
                            prop.testId "magazine-quick-add-button"
                            prop.text "Quick Add"
                            prop.onClick (fun _ -> dispatch (AddToCart (ProductId m.SKU)))
                        ]
                ]
            ]
            // ---- Card body ----
            Html.div [
                prop.className "archive-card__body"
                prop.children [
                    // SKU code
                    Html.span [
                        prop.className "archive-card__sku"
                        prop.text m.SKU
                    ]
                    // Brand + Title
                    Html.div [
                        prop.className "archive-card__brand-row"
                        prop.children [
                            Html.span [
                                prop.className "archive-card__brand"
                                prop.text (MagazineBrand.label m.Brand)
                            ]
                        ]
                    ]
                    Html.h3 [
                        prop.className "archive-card__title"
                        prop.text (sprintf "%s %d" m.MonthOrVolume m.Year)
                    ]
                    // Meta row: condition pill + verified badge
                    Html.div [
                        prop.className "archive-card__meta"
                        prop.children [
                            conditionBadge m.Condition
                            archiveVerifiedBadge
                        ]
                    ]
                    // Price row
                    Html.div [
                        prop.className "archive-card__actions"
                        prop.children [
                            Html.span [
                                prop.className "archive-card__price"
                                prop.text (Selectors.formatPrice m.Price)
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]

// ---------------------------------------------------------------------------
// Search input — real-time filtering via SetSearchQuery
// ---------------------------------------------------------------------------
let private searchBar (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "archive-search"
        prop.children [
            Html.span [ prop.className "archive-search__icon"; prop.text "🔍" ]
            Html.input [
                prop.className "archive-search__input"
                prop.type' "search"
                prop.placeholder "Search by SKU, brand, title or keyword..."
                prop.value model.SearchQuery
                prop.onChange (fun (v: string) -> dispatch (SetSearchQuery v))
            ]
            if model.SearchQuery <> "" then
                Html.button [
                    prop.className "archive-search__clear"
                    prop.text "✕"
                    prop.onClick (fun _ -> dispatch (SetSearchQuery ""))
                ]
        ]
    ]

// ---------------------------------------------------------------------------
// Main view — sidebar + search + grid layout.
// ---------------------------------------------------------------------------

let view (model: Model) (dispatch: Msg -> unit) =
    let magazines = Selectors.sortedMagazines model
    let years = Selectors.magazineYears model
    let conditions = Selectors.magazineConditions model
    let count = List.length magazines

    Html.section [
        prop.className "l-section archive-catalog"
        prop.id "magazines"
        prop.children [
            Html.div [
                prop.className "l-container"
                prop.children [
                    // ---- Content grid: sidebar + main ----
                    Html.div [
                        prop.className "archive-layout"
                        prop.children [
                            // ============= SIDEBAR (1/4 width on desktop) =============
                            Html.aside [
                                prop.className "archive-sidebar"
                                prop.children [
                                    // Brand filter
                                    Html.div [
                                        prop.className "archive-sidebar__section"
                                        prop.children [
                                            Html.h4 [ prop.className "archive-sidebar__heading"; prop.text "BRANDS" ]
                                            sidebarFilterLabel "All Brands"
                                                (model.SelectedMagazineBrand = None)
                                                (fun () -> dispatch (SetMagazineBrand None))
                                                (List.length model.Magazines)
                                            for brand in MagazineBrand.all do
                                                let label = MagazineBrand.label brand
                                                let matching = model.Magazines |> List.filter (fun m -> m.Brand = brand) |> List.length
                                                sidebarFilterLabel label
                                                    (model.SelectedMagazineBrand = Some brand)
                                                    (fun () -> dispatch (SetMagazineBrand (Some brand)))
                                                    matching
                                        ]
                                    ]
                                    // Year filter
                                    Html.div [
                                        prop.className "archive-sidebar__section"
                                        prop.children [
                                            Html.h4 [ prop.className "archive-sidebar__heading"; prop.text "YEAR" ]
                                            sidebarFilterLabel "All Years"
                                                (model.SelectedMagazineYear = None)
                                                (fun () -> dispatch (SetMagazineYear None))
                                                (List.length model.Magazines)
                                            for year in years do
                                                let matching = model.Magazines |> List.filter (fun m -> m.Year = year) |> List.length
                                                sidebarFilterLabel (string year)
                                                    (model.SelectedMagazineYear = Some year)
                                                    (fun () -> dispatch (SetMagazineYear (Some year)))
                                                    matching
                                        ]
                                    ]
                                    // Condition filter
                                    Html.div [
                                        prop.className "archive-sidebar__section"
                                        prop.children [
                                            Html.h4 [ prop.className "archive-sidebar__heading"; prop.text "CONDITION" ]
                                            sidebarFilterLabel "Any Condition"
                                                (model.SelectedMagazineCondition = None)
                                                (fun () -> dispatch (SetMagazineCondition None))
                                                (List.length model.Magazines)
                                            for cond in conditions do
                                                let matching = model.Magazines |> List.filter (fun m -> m.Condition = cond) |> List.length
                                                sidebarFilterLabel cond
                                                    (model.SelectedMagazineCondition = Some cond)
                                                    (fun () -> dispatch (SetMagazineCondition (Some cond)))
                                                    matching
                                        ]
                                    ]
                                ]
                            ]

                            // ============= MAIN CONTENT (3/4 width on desktop) =============
                            Html.div [
                                prop.className "archive-main"
                                prop.children [
                                    // ---- Top bar: breadcrumbs + title + sort ----
                                    Html.div [
                                        prop.className "archive-topbar"
                                        prop.children [
                                            Html.div [
                                                prop.className "archive-topbar__left"
                                                prop.children [
                                                    Html.nav [
                                                        prop.className "archive-breadcrumbs"
                                                        prop.children [
                                                            Html.span [ prop.className "archive-breadcrumbs__crumb"; prop.text "Home" ]
                                                            Html.span [ prop.className "archive-breadcrumbs__sep"; prop.text "/" ]
                                                            Html.span [ prop.className "archive-breadcrumbs__crumb archive-breadcrumbs__crumb--current"; prop.text "Archive" ]
                                                        ]
                                                    ]
                                                    Html.div [
                                                        prop.className "archive-topbar__title-row"
                                                        prop.children [
                                                            Html.h1 [ prop.className "archive-topbar__title"; prop.text "Vintage Print Archive" ]
                                                            Html.span [ prop.className "archive-topbar__count"; prop.text (sprintf "%d items" count) ]
                                                        ]
                                                    ]
                                                ]
                                            ]
                                            // Sort dropdown
                                            Html.div [
                                                prop.className "archive-topbar__right"
                                                prop.children [
                                                    Html.select [
                                                        prop.className "archive-sort"
                                                        prop.value model.MagazineSort
                                                        prop.onChange (fun (v: string) -> dispatch (SetMagazineSort v))
                                                        prop.children [
                                                            Html.option [ prop.value "featured"; prop.text "Sort: Featured" ]
                                                            Html.option [ prop.value "newest"; prop.text "Sort: Newest" ]
                                                            Html.option [ prop.value "price-asc"; prop.text "Sort: Price: Low → High" ]
                                                            Html.option [ prop.value "price-desc"; prop.text "Sort: Price: High → Low" ]
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]

                                    // ---- Search bar ----
                                    searchBar model dispatch

                                    // ---- Product grid ----
                                    if List.length magazines = 0 && model.SearchQuery <> "" then
                                        Html.div [
                                            prop.className "archive-empty"
                                            prop.children [
                                                Html.p [ prop.className "archive-empty__text"; prop.text (sprintf "No results for \"%s\"" model.SearchQuery) ]
                                                Html.button [
                                                    prop.className "archive-empty__reset"
                                                    prop.text "Clear search"
                                                    prop.onClick (fun _ -> dispatch (SetSearchQuery ""))
                                                ]
                                            ]
                                        ]
                                    else
                                        Html.div [
                                            prop.className "archive-grid"
                                            prop.testId "magazine-grid"
                                            prop.children (magazines |> List.map (magazineCard dispatch))
                                        ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]