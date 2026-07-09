module Room23.App

open Feliz
open Room23.Types
open Room23.Components

// ---------------------------------------------------------------------------
// Root view — routes to the correct page based on model.CurrentPage.
// ---------------------------------------------------------------------------

let view (model: Model) (dispatch: Msg -> unit) =
    // Age gate — blocks entire site until verified
    if not model.IsAgeVerified then
        AgeGate.view dispatch
    else
        Html.div [
            prop.className "app-shell"
            prop.children [
                // Header is hidden on Confirmation and legal pages for a cleaner look
                if not (model.CurrentPage = Confirmation
                        || model.CurrentPage = TermsOfService
                        || model.CurrentPage = PrivacyPolicy
                        || model.CurrentPage = RefundPolicy) then
                    Header.view model dispatch

                // Page routing
                match model.CurrentPage with
                | NotYetVerified ->
                    AgeGate.view dispatch

                | Storefront ->
                    Html.main [
                        prop.children [
                            Hero.view dispatch
                            ProductGrid.view model dispatch
                            MagazineCatalog.view model dispatch
                        ]
                    ]

                | Checkout ->
                    Html.main [
                        prop.children [
                            Checkout.view model dispatch
                        ]
                    ]

                | Confirmation ->
                    Html.main [
                        prop.children [
                            Checkout.confirmationView model dispatch
                        ]
                    ]

                | TermsOfService ->
                    Html.main [
                        prop.children [ ComplianceViews.termsOfServiceView dispatch ]
                    ]

                | PrivacyPolicy ->
                    Html.main [
                        prop.children [ ComplianceViews.privacyPolicyView dispatch ]
                    ]

                | RefundPolicy ->
                    Html.main [
                        prop.children [ ComplianceViews.refundPolicyView dispatch ]
                    ]

                // Footer on all pages
                Footer.view dispatch

                // Cart drawer only on storefront
                if model.CurrentPage = Storefront then
                    CartDrawer.view model dispatch

                // Product detail modal (z-index above everything)
                ProductModal.view model dispatch
            ]
        ]
