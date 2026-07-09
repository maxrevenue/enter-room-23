module Room23.Components.Checkout

open Feliz
open Room23.Types

// ---------------------------------------------------------------------------
// Reusable form helpers
// ---------------------------------------------------------------------------

let private sectionTitle (title: string) =
    Html.h3 [
        prop.className "checkout__section-title"
        prop.text title
    ]

let private textField
    (label: string)
    (fieldType: string)
    (placeholder: string)
    (value: string)
    (autocomplete: string)
    (field: CheckoutField)
    (dispatch: Msg -> unit)
    (required: bool)
    =
    Html.div [
        prop.className "checkout__field"
        prop.children [
            Html.label [
                prop.className "checkout__label"
                prop.children [
                    Html.text label
                    if required then
                        Html.span [ prop.className "checkout__required"; prop.text " *" ]
                ]
            ]
            Html.input [
                prop.className "checkout__input"
                prop.type' fieldType
                prop.placeholder placeholder
                prop.value value
                prop.autoComplete autocomplete
                prop.required required
                prop.onChange (fun (v: string) -> dispatch (UpdateCheckoutField (field, v)))
            ]
        ]
    ]

// ---------------------------------------------------------------------------
// Checkout view
// ---------------------------------------------------------------------------

let view (model: Model) (dispatch: Msg -> unit) =
    let form = model.CheckoutForm |> Option.defaultValue CheckoutForm.empty
    let isValid = Selectors.isCheckoutValid form
    let subtotal = Selectors.subtotal model
    let tax = Selectors.tax model
    let shipping = Selectors.shipping model
    let total = Selectors.total model
    let lines = Selectors.cartLines model

    Html.div [
        prop.className "checkout-shell"
        prop.testId "checkout-page"
        prop.children [
            Html.div [
                prop.className "checkout__topbar"
                prop.children [
                    Html.div [
                        prop.className "l-container checkout__topbar-inner"
                        prop.children [
                            Html.button [ prop.className "checkout__back-link"; prop.testId "checkout-back-to-store-button"; prop.text "← Back to Store"; prop.onClick (fun _ -> dispatch (NavigateToPage Storefront)) ]
                            Html.span [ prop.className "checkout__step-indicator"; prop.text "Step 1 of 2 — Shipping & Payment" ]
                        ]
                    ]
                ]
            ]

            Html.div [
                prop.className "l-container checkout__grid"
                prop.children [
                    Html.div [
                        prop.className "checkout__main"
                        prop.children [
                            Html.section [
                                prop.className "checkout__section"
                                prop.children [
                                    sectionTitle "Shipping Information"
                                    Html.div [ prop.className "checkout__row"; prop.children [ textField "First Name" "text" "Morgan" form.FirstName "given-name" FirstName dispatch true; textField "Last Name" "text" "Underwood" form.LastName "family-name" LastName dispatch true ] ]
                                    textField "Email Address" "email" "compliance@room23.test" form.Email "email" Email dispatch true
                                    textField "Phone" "tel" "(555) 010-0000" form.Phone "tel" Phone dispatch false
                                    textField "Address Line 1" "text" "1 Compliance Plaza — Suite 400" form.Address1 "address-line1" Address1 dispatch true
                                    textField "Address Line 2" "text" "Attn: Merchant Underwriting Dept." form.Address2 "address-line2" Address2 dispatch false
                                    Html.div [ prop.className "checkout__row checkout__row--3col"; prop.children [ textField "City" "text" "Minneapolis" form.City "address-level2" City dispatch true; textField "State" "text" "MN" form.State "address-level1" State dispatch true; textField "ZIP Code" "text" "55401" form.ZipCode "postal-code" ZipCode dispatch true ] ]
                                    textField "Country" "text" "US" form.Country "country" Country dispatch true
                                ]
                            ]

                            Html.section [
                                prop.className "checkout__section"
                                prop.children [
                                    Html.div [ prop.className "checkout__section-header"; prop.children [ sectionTitle "Payment Method"; Html.span [ prop.className "checkout__sandbox-badge"; prop.testId "checkout-sandbox-badge"; prop.text "SANDBOX TEST MODE" ] ] ]
                                    Html.p [ prop.className "checkout__sandbox-note"; prop.children [ Html.text "Underwriting review — use test card "; Html.code [ prop.className "checkout__code"; prop.text CheckoutDefaults.sandboxCardNumber ]; Html.text " or your own sandbox credentials. No real charges are processed." ] ]
                                    textField "Name on Card" "text" CheckoutDefaults.sandboxCardName form.CardName "cc-name" CardName dispatch true
                                    textField "Card Number" "text" CheckoutDefaults.sandboxCardNumber form.CardNumber "cc-number" CardNumber dispatch true
                                    Html.div [ prop.className "checkout__row"; prop.children [ textField "Expiry (MM / YY)" "text" CheckoutDefaults.sandboxExpiry form.CardExpiry "cc-exp" CardExpiry dispatch true; textField "CVC" "text" CheckoutDefaults.sandboxCvc form.CardCvc "cc-csc" CardCvc dispatch true ] ]
                                ]
                            ]

                            Html.div [
                                prop.className "checkout__compliance"
                                prop.children [
                                    Html.p [ prop.className "checkout__compliance-text"; prop.children [ Html.span [ prop.className "checkout__compliance-icon"; prop.text "🔒" ]; Html.text " All transactions are fully encrypted. Orders are fulfilled and shipped in 100% discreet packaging with no external brand marking." ] ]
                                    Html.p [ prop.className "checkout__compliance-links"; prop.children [ Html.text "By placing this order you confirm you are "; Html.strong [ prop.text "18 years or older" ]; Html.text " and agree to our "; Html.span [ prop.className "checkout__inline-link"; prop.text "Terms of Service" ]; Html.text ", "; Html.span [ prop.className "checkout__inline-link"; prop.text "Privacy Policy" ]; Html.text ", and "; Html.span [ prop.className "checkout__inline-link"; prop.text "Refund & Return Policy" ]; Html.text "." ] ]
                                ]
                            ]

                            Html.button [
                                prop.className "btn btn--checkout btn--checkout-large"
                                prop.testId "checkout-place-order-button"
                                prop.disabled (not isValid)
                                prop.onClick (fun _ -> dispatch PlaceOrder)
                                prop.children [ Html.text (if isValid then "Place Order — " + Selectors.formatPrice total else "Complete all required fields") ]
                            ]
                        ]
                    ]

                    Html.aside [
                        prop.className "checkout__sidebar"
                        prop.children [
                            Html.div [
                                prop.className "checkout__summary-card"
                                prop.children [
                                    Html.h3 [ prop.className "checkout__summary-title"; prop.text "Order Summary" ]
                                    Html.div [
                                        prop.className "checkout__summary-items"; prop.testId "checkout-order-summary-list"
                                        prop.children [
                                            for line in lines do
                                                Html.div [
                                                    prop.className "checkout__summary-item"; prop.key (ProductId.value line.Product.Id)
                                                    prop.children [
                                                        Html.img [ prop.className "checkout__summary-thumb"; prop.src line.Product.ImageUrl; prop.alt line.Product.Name ]
                                                        Html.div [ prop.className "checkout__summary-item-info"; prop.children [ Html.span [ prop.className "checkout__summary-item-name"; prop.text line.Product.Name ]; Html.span [ prop.className "checkout__summary-item-meta"; prop.text (sprintf "Qty %d · %s" line.Quantity (Selectors.formatPrice (line.Product.Price * float line.Quantity))) ] ] ]
                                                    ]
                                                ]
                                        ]
                                    ]
                                    Html.div [
                                        prop.className "checkout__summary-totals"
                                        prop.children [
                                            Html.div [ prop.className "checkout__summary-row"; prop.children [ Html.span [ prop.text "Subtotal" ]; Html.span [ prop.text (Selectors.formatPrice subtotal) ] ] ]
                                            Html.div [ prop.className "checkout__summary-row"; prop.children [ Html.span [ prop.text "Tax (est. 8.75%)" ]; Html.span [ prop.text (Selectors.formatPrice tax) ] ] ]
                                            Html.div [ prop.className "checkout__summary-row checkout__summary-row--shipping"; prop.children [ Html.span [ prop.text "Shipping" ]; Html.span [ prop.text "Complimentary" ] ] ]
                                            Html.div [ prop.className "checkout__summary-row checkout__summary-row--total"; prop.testId "checkout-order-total-text"; prop.children [ Html.span [ prop.text "Total" ]; Html.span [ prop.text (Selectors.formatPrice total) ] ] ]
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

// ---------------------------------------------------------------------------
// Confirmation view — renders split-fulfillment shipping blocks
// ---------------------------------------------------------------------------

let confirmationView (model: Model) (dispatch: Msg -> unit) =
    let orderNumber = model.OrderNumber |> Option.defaultValue "R23-000000-SBX"
    let form = model.CheckoutForm |> Option.defaultValue CheckoutForm.empty
    let total = Selectors.total model
    let lines = Selectors.cartLines model
    let itemCount = Selectors.itemCount model
    let groups = Selectors.fulfillmentGroups model
    let hasSplit = List.length groups > 1

    Html.div [
        prop.className "confirmation-shell"
        prop.testId "order-confirmation-page"
        prop.children [
            Html.div [
                prop.className "l-container confirmation__inner"
                prop.children [
                    Html.div [
                        prop.className "confirmation__success"
                        prop.children [
                            Html.div [ prop.className "confirmation__checkmark"; prop.ariaHidden true; prop.children [ Html.text "✓" ] ]
                            Html.h1 [ prop.className "confirmation__heading"; prop.text "Order Confirmed" ]
                            Html.p [ prop.className "confirmation__sub"; prop.text "Your sandbox test transaction has been processed successfully. This order will not result in a real charge." ]
                        ]
                    ]

                    Html.div [
                        prop.className "confirmation__order-number"; prop.testId "order-confirmation-number"
                        prop.children [
                            Html.span [ prop.className "confirmation__order-label"; prop.text "Order Number" ]
                            Html.span [ prop.className "confirmation__order-value"; prop.text orderNumber ]
                        ]
                    ]

                    Html.div [
                        prop.className "confirmation__details"
                        prop.children [
                            Html.div [
                                prop.className "confirmation__section"
                                prop.children [
                                    Html.h3 [ prop.className "confirmation__section-title"; prop.text "Items Ordered" ]
                                    Html.div [
                                        prop.className "confirmation__item-list"; prop.testId "order-summary-list"
                                        prop.children [
                                            for line in lines do
                                                Html.div [
                                                    prop.className "confirmation__item"; prop.key (ProductId.value line.Product.Id)
                                                    prop.children [
                                                        Html.span [ prop.className "confirmation__item-name"; prop.text line.Product.Name ]
                                                        Html.span [ prop.className "confirmation__item-qty"; prop.text (sprintf "Qty %d × %s" line.Quantity (Selectors.formatPrice line.Product.Price)) ]
                                                    ]
                                                ]
                                        ]
                                    ]
                                    Html.div [
                                        prop.className "confirmation__totals"
                                        prop.children [
                                            Html.div [ prop.className "confirmation__total-row"; prop.children [ Html.span [ prop.text (sprintf "Subtotal (%d items)" itemCount) ]; Html.span [ prop.text (Selectors.formatPrice (Selectors.subtotal model)) ] ] ]
                                            Html.div [ prop.className "confirmation__total-row"; prop.children [ Html.span [ prop.text "Tax" ]; Html.span [ prop.text (Selectors.formatPrice (Selectors.tax model)) ] ] ]
                                            Html.div [ prop.className "confirmation__total-row"; prop.children [ Html.span [ prop.text "Shipping" ]; Html.span [ prop.text "Complimentary" ] ] ]
                                            Html.div [ prop.className "confirmation__total-row confirmation__total-row--grand"; prop.children [ Html.span [ prop.text "Total Charged (Sandbox)" ]; Html.span [ prop.text (Selectors.formatPrice total) ] ] ]
                                        ]
                                    ]
                                ]
                            ]

                            // ---- Split-fulfillment shipping blocks ----
                            Html.div [
                                prop.className "confirmation__section"
                                prop.children [
                                    Html.h3 [ prop.className "confirmation__section-title"; prop.text "Shipping & Fulfillment" ]
                                    for index, (fulfillment, groupLines) in groups |> List.indexed do
                                        let shipmentLabel =
                                            if hasSplit then sprintf "Shipment %d: %s" (index + 1) (SupplySource.label fulfillment)
                                            else SupplySource.label fulfillment
                                        let location = SupplySource.location fulfillment
                                        Html.div [
                                            prop.className "confirmation__shipment"; prop.key (string index)
                                            prop.children [
                                                Html.div [ prop.className "confirmation__shipment-rule"; prop.ariaHidden true ]
                                                Html.h4 [ prop.className "confirmation__shipment-title"; prop.text shipmentLabel ]
                                                Html.p [ prop.className "confirmation__shipment-location"; prop.text location ]
                                                Html.p [ prop.className "confirmation__shipment-tracking"; prop.text "Tracking: Pending Fulfillment" ]
                                                Html.div [
                                                    prop.className "confirmation__shipment-items"
                                                    prop.children [
                                                        for line in groupLines do
                                                            Html.div [
                                                                prop.className "confirmation__shipment-item"; prop.key (ProductId.value line.Product.Id)
                                                                prop.children [
                                                                    Html.span [ prop.text line.Product.Name ]
                                                                    Html.span [ prop.className "confirmation__item-qty"; prop.text (sprintf "Qty %d" line.Quantity) ]
                                                                ]
                                                            ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                ]
                            ]

                            Html.div [
                                prop.className "confirmation__section"
                                prop.children [
                                    Html.h3 [ prop.className "confirmation__section-title"; prop.text "Shipping To" ]
                                    Html.div [
                                        prop.className "confirmation__address"
                                        prop.children [
                                            Html.p [ prop.text (form.FirstName + " " + form.LastName) ]
                                            Html.p [ prop.text form.Address1 ]
                                            if form.Address2 <> "" then Html.p [ prop.text form.Address2 ]
                                            Html.p [ prop.text (form.City + ", " + form.State + " " + form.ZipCode) ]
                                            Html.p [ prop.text form.Country ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]

                    Html.div [
                        prop.className "confirmation__underwriting"
                        prop.children [
                            Html.div [ prop.className "confirmation__underwriting-rule"; prop.ariaHidden true ]
                            Html.p [
                                prop.className "confirmation__underwriting-text"
                                prop.children [
                                    Html.strong [ prop.text "UNDERWRITING AUDIT NOTE: " ]
                                    Html.text "This test transaction was processed in sandbox mode. No funds were transferred. In production, payment data is tokenized server-side. All orders ship in discreet packaging. Customer must be 18+."
                                ]
                            ]
                        ]
                    ]

                    Html.button [
                        prop.className "btn btn--primary confirmation__return-btn"
                        prop.testId "checkout-return-to-store-button"
                        prop.text "Return to Storefront"
                        prop.onClick (fun _ -> dispatch ReturnToStore)
                    ]
                ]
            ]
        ]
    ]