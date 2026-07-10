module Room23.Components.ComplianceViews

open Feliz
open Room23.Types

// ---------------------------------------------------------------------------
// Shared layout wrapper for legal pages
// ---------------------------------------------------------------------------

let private legalShell (dispatch: Msg -> unit) (title: string) (children: ReactElement list) =
    Html.div [
        prop.className "legal-shell"
        prop.children [
            // Top bar
            Html.div [
                prop.className "legal__topbar"
                prop.children [
                    Html.div [
                        prop.className "l-container legal__topbar-inner"
                        prop.children [
                            Html.button [
                                prop.className "legal__back-link"
                                prop.testId "legal-back-to-store-button"
                                prop.text "← Back to Room 23"
                                prop.onClick (fun _ -> dispatch (NavigateToPage Storefront))
                            ]
                        ]
                    ]
                ]
            ]
            // Content
            Html.div [
                prop.className "l-container legal__content"
                prop.children [
                    Html.div [
                        prop.className "legal__header"
                        prop.children [
                            Html.div [ prop.className "legal__rule"; prop.ariaHidden true ]
                            Html.h1 [ prop.className "legal__title"; prop.text title ]
                        ]
                    ]
                    Html.div [
                        prop.className "legal__body"
                        prop.children children
                    ]
                ]
            ]
        ]
    ]

let private p (text: string) = Html.p [ prop.className "legal__p"; prop.text text ]
let private h2 (text: string) = Html.h2 [ prop.className "legal__h2"; prop.text text ]
let private h3 (text: string) = Html.h3 [ prop.className "legal__h3"; prop.text text ]
let private emphasis (text: string) = Html.strong [ prop.className "legal__emphasis"; prop.text text ]

// ---------------------------------------------------------------------------
// DISCREET DELIVERY GUARANTEE (injected across all policies)
// ---------------------------------------------------------------------------

let private discreetShippingBlock =
    Html.div [
        prop.className "legal__discreet-block"
        prop.children [
            Html.div [ prop.className "legal__discreet-rule"; prop.ariaHidden true ]
            h2 "Discreet Delivery Guarantee"
            p "To protect your privacy, all orders are shipped in secure, unmarked packaging with no external brand indicators."
            p "Financial transactions will appear discreetly on your statement under our corporate processing name: AW Holdings LLC."
        ]
    ]

// ---------------------------------------------------------------------------
// TERMS OF SERVICE
// ---------------------------------------------------------------------------

let termsOfServiceView (dispatch: Msg -> unit) =
    legalShell dispatch "Terms of Service" [
        p "Last updated: April 2026. These Terms of Service govern your use of the Room 23 digital storefront."

        h2 "1. Acceptance of Terms"
        p "By accessing or using Room 23, you agree to be bound by these Terms. If you do not agree, you must not use the service."

        h2 "2. User Eligibility"
        emphasis "Room 23 is strictly for individuals aged 18 years or older."
        p "By creating an account, placing an order, or browsing this site, you certify that you are of legal adult age in your jurisdiction. We reserve the right to request proof of age and to refuse service to anyone unable to verify their eligibility."

        h2 "3. Intellectual Property"
        p "All content on this site — including but not limited to product photography, editorial copy, archive descriptions, and site design — is the exclusive intellectual property of Room 23 and its licensors. Reproduction, distribution, or scraping of any content without express written permission is strictly prohibited."

        h2 "4. Limitation of Liability"
        p "Room 23 shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this site or the purchase of any products. Our total liability is limited to the purchase price of the specific item at issue."

        h2 "5. Governing Law"
        p "These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved in the courts of New Castle County, Delaware."

        h2 "6. Changes to Terms"
        p "We reserve the right to modify these Terms at any time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms."

        discreetShippingBlock
    ]

// ---------------------------------------------------------------------------
// PRIVACY POLICY
// ---------------------------------------------------------------------------

let privacyPolicyView (dispatch: Msg -> unit) =
    legalShell dispatch "Privacy Policy" [
        p "Last updated: April 2026. Room 23 is committed to protecting your privacy."

        h2 "1. Information We Collect"
        p "We collect only the information necessary to process your order: name, shipping address, email, and payment details. Payment information is processed through our secure, PCI-compliant payment processor and is never stored on our servers."

        h2 "2. How We Use Your Data"
        p "We use your information solely to fulfill your orders, communicate order status, and comply with legal obligations. We may send occasional promotional emails with your consent, from which you may unsubscribe at any time."

        h2 "3. Data Protection"
        emphasis "We do not sell, rent, or trade user data."
        p "All transactional data is heavily encrypted using industry-standard SSL/TLS protocols. We maintain administrative, technical, and physical safeguards to protect your personal information."

        h2 "4. Cookies"
        p "Room 23 uses essential cookies for cart state persistence and session management. We do not use tracking cookies for advertising purposes. You may disable cookies in your browser, but some site features may not function."

        h2 "5. Your Rights (GDPR / CCPA)"
        p "If you reside in the European Economic Area or California, you have the right to access, correct, delete, or port your personal data. To exercise these rights, contact us at privacy@room23.test."

        h2 "6. Third-Party Services"
        p "We employ third-party payment processors and shipping carriers who may receive your data solely to complete your transaction. These partners are contractually bound to maintain the confidentiality and security of your information."

        h2 "7. Children's Privacy"
        p "Room 23 does not knowingly collect information from individuals under 18. By using this site, you certify you are of legal age."

        discreetShippingBlock
    ]

// ---------------------------------------------------------------------------
// REFUND & RETURN POLICY
// ---------------------------------------------------------------------------

let refundPolicyView (dispatch: Msg -> unit) =
    legalShell dispatch "Refund & Return Policy" [
        p "Last updated: April 2026. Our policy reflects the unique nature of our inventory."

        h2 "1. Vintage Media & Print Archives"
        emphasis "Due to the rare, vintage, and collectible nature of our print archive, all magazine sales are final."
        p "We make every effort to accurately describe each issue's condition (graded Fine, Very Good, Good, or Fair). If we ship an incorrect SKU — meaning you received a different issue than the one you ordered — we will issue a full refund or exchange upon return of the incorrect item. Please contact us within 7 days of delivery."

        h2 "2. Wellness Products"
        p "For hygiene and safety reasons, all wellness and intimate products are final sale once factory seals are broken. If you receive a damaged or defective item with seals intact, we will issue a full refund or exchange within 14 days of delivery."

        h2 "3. Apparel & Essentials"
        p "Unworn, unwashed apparel and essentials may be returned within 14 days of delivery for a refund or exchange. Items must have all original tags attached. Return shipping is the responsibility of the customer unless the return is due to our error."

        h2 "4. Return Process"
        p "To initiate a return, contact us at returns@room23.test with your order number and a brief description of the issue. We will provide a return authorization and shipping instructions. Refunds are processed within 5-10 business days of receiving the returned item."

        h2 "5. Damaged Shipments"
        p "If your order arrives damaged, please photograph the packaging and item(s) before opening and contact us within 48 hours. We will file a claim with the carrier and arrange a replacement or refund."

        discreetShippingBlock
    ]