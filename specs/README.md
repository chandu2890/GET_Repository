# Sauce Demo Test Plan

## 1. Objective

Validate the critical shopping journey and the supporting account, catalog, cart,
checkout, navigation, and presentation behavior of https://www.saucedemo.com/.
The plan is based on exploratory coverage of the live site on 2026-09-08.

## 2. Scope

### In scope

- Login and account-specific behavior
- Product catalog, product details, sorting, and product data
- Add-to-cart, cart persistence, removal, and navigation
- Checkout validation, order totals, completion, and post-order actions
- Menu navigation and logout
- Accessibility, responsive layout, browser compatibility, and basic resilience

### Out of scope

- Real payment processing, inventory, shipping, or order persistence: the site
	uses a simulated SauceCard and simulated fulfillment.
- Backend API contract testing: no public API contract is part of this UI plan.
- Social media destinations beyond verifying that links are present and usable.

## 3. Observed application contract

| Area | Observed behavior |
| --- | --- |
| Login | Login page is titled `Swag Labs`; all documented users use `secret_sauce`. |
| Users | `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`. |
| Catalog | Six products are shown: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99), Fleece Jacket ($49.99), Onesie ($7.99), and Test.allTheThings() T-Shirt (Red) ($15.99). |
| Sorting | Name A-Z, Name Z-A, Price low-high, and Price high-low. |
| Cart | Cart badge reflects item count; product detail and catalog support adding items. |
| Checkout | Customer information requires first name, last name, and ZIP/postal code. |
| Overview | Shows item total, tax, total, payment `SauceCard #31337`, and shipping `Free Pony Express Delivery!`. |
| Completion | Shows `Thank you for your order!`, a Back Home action, and Generate PDF order. |
| Navigation | Authenticated menu includes inventory, about, logout, and reset-app-state actions. |

## 4. Test data

| Data | Value | Use |
| --- | --- | --- |
| Valid user | `standard_user` | Baseline functional journey |
| Locked user | `locked_out_user` | Login negative path |
| Other documented users | `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | Persona regression checks |
| Password | `secret_sauce` | All documented users |
| Customer | `Ada Lovelace`, ZIP `12345` | Checkout happy path |
| Invalid login | Unknown username or incorrect password | Authentication validation |
| Boundary text | Empty, whitespace, long strings, punctuation, Unicode, and numeric ZIP variants | Form validation and robustness |

## 5. Priority and execution model

- **P0:** Blocks login, catalog access, cart, checkout, or order completion.
- **P1:** Breaks an important supported feature but leaves the primary journey usable.
- **P2:** Presentation, compatibility, accessibility, or lower-risk edge coverage.

Run P0 smoke tests on every change and against all configured browsers. Run the
full P0/P1 suite on pull requests. Run P2, visual, responsive, and special-user
coverage on a scheduled or release validation run.

## 6. Test cases

### Authentication and session

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| AUTH-001 | P0 | Log in as `standard_user` with `secret_sauce`. | Redirects to `/inventory.html`; Products heading and six products are visible. |
| AUTH-002 | P0 | Submit an empty login form. | Login is blocked and a required-field error is shown. |
| AUTH-003 | P0 | Submit an unknown username with the valid password. | Login is blocked with a clear authentication error; no protected page is exposed. |
| AUTH-004 | P0 | Submit a valid username with an incorrect password. | Login is blocked with a clear authentication error. |
| AUTH-005 | P0 | Log in as `locked_out_user`. | Remains on login and shows `Epic sadface: Sorry, this user has been locked out.` |
| AUTH-006 | P1 | Log in with leading/trailing spaces and case variants. | Behavior is intentional and consistent; invalid credentials do not grant access. |
| AUTH-007 | P0 | Use menu Logout after authenticating. | Session ends and the login page is displayed; protected routes cannot be used as an authenticated user. |
| AUTH-008 | P1 | Refresh and use browser back/forward across login and inventory. | Session and route guards behave consistently without exposing stale protected content. |
| AUTH-009 | P1 | Exercise each documented non-standard user. | Each known persona's behavior is captured as an expected, stable regression contract; timing and visible data remain usable. |

### Catalog and product details

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| CAT-001 | P0 | Load inventory as `standard_user`. | Six unique products, names, descriptions, prices, images, and Add to cart actions render. |
| CAT-002 | P1 | Select each of the four sort options. | Names or prices are ordered correctly; equal-price products remain valid and no item disappears. |
| CAT-003 | P1 | Open each product from its name and image link. | Detail route identifies the same product, description, price, image, and Add to cart action. |
| CAT-004 | P1 | Add an item from the catalog. | Button changes to Remove, cart badge increments once, and the selected item appears in cart. |
| CAT-005 | P1 | Add every product, then remove each product. | Badge and cart contents stay synchronized through all additions and removals. |
| CAT-006 | P1 | Add from product detail, then use Back to products. | Item remains in cart and catalog state is correct after returning. |
| CAT-007 | P2 | Refresh catalog after sorting and after adding an item. | Selected sort and cart state follow the product's intended persistence rules. |
| CAT-008 | P2 | Verify image alt text, link names, prices, and buttons with an accessibility snapshot. | Interactive controls have meaningful accessible names and images have meaningful alternatives. |

### Cart

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| CART-001 | P0 | Open cart with no items. | Cart page loads, shows an empty state, and does not show stale products or an incorrect badge. |
| CART-002 | P0 | Add one product and open cart. | Correct product, quantity `1`, description, and price are shown. |
| CART-003 | P1 | Add multiple different products. | Each line is unique, quantities are correct, and cart badge matches the intended count. |
| CART-004 | P1 | Remove a product in the cart. | Product disappears and badge/count update without affecting remaining items. |
| CART-005 | P1 | Select Continue Shopping from cart. | Returns to inventory while preserving cart contents. |
| CART-006 | P1 | Select a product name from cart. | Opens the matching product detail page without losing cart state. |
| CART-007 | P1 | Refresh cart and navigate away/back. | Cart persistence follows the application contract and never shows stale line items. |

### Checkout and order completion

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| CHK-001 | P0 | Start checkout from a non-empty cart. | Checkout information page displays first name, last name, ZIP/postal code, Cancel, and Continue. |
| CHK-002 | P0 | Continue with all fields empty. | Remains on step one and shows `Error: First Name is required`. |
| CHK-003 | P1 | Submit one missing field at a time. | Correct field-specific validation is shown and no overview is reached. |
| CHK-004 | P1 | Submit whitespace, long, special-character, Unicode, and numeric ZIP inputs. | Accepted formats and validation behavior are consistent with product requirements; no crash or truncation occurs. |
| CHK-005 | P0 | Complete checkout with one backpack. | Overview contains the backpack, quantity `1`, payment, shipping, item total `$29.99`, tax `$2.40`, and total `$32.39`. |
| CHK-006 | P1 | Complete checkout with multiple products. | Item total equals the sum of line prices; tax and grand total are arithmetically correct and formatted consistently. |
| CHK-007 | P1 | Cancel from step one and from overview. | Returns to the expected prior page and does not place an order. |
| CHK-008 | P0 | Select Finish from a valid overview. | Completion page shows `Thank you for your order!` and fulfillment confirmation. |
| CHK-009 | P1 | Select Back Home after completion. | Returns to inventory in a clean, intentional post-order state. |
| CHK-010 | P2 | Select Generate PDF order. | A readable PDF is generated/downloaded with the expected order information, or a clear supported-browser limitation is documented. |

### Menu, reset, and external links

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| NAV-001 | P1 | Open and close the hamburger menu. | Menu is operable by mouse and keyboard, has visible focus, and does not obscure or trap the page incorrectly. |
| NAV-002 | P1 | Select All Items from a non-inventory page. | Navigates to inventory and preserves only the intended session/cart state. |
| NAV-003 | P1 | Select About. | Opens the Sauce Labs destination in the expected tab/context and does not corrupt the current session. |
| NAV-004 | P1 | Select Reset App State with products in cart. | Cart, badge, and item button states reset according to the control's purpose. |
| NAV-005 | P2 | Follow footer Twitter, Facebook, and LinkedIn links. | Each link has a meaningful name, valid destination, and expected new-tab behavior. |

### Accessibility, responsive, compatibility, and resilience

| ID | Pri | Scenario | Expected result |
| --- | --- | --- | --- |
| UX-001 | P2 | Run keyboard-only login, catalog, cart, and checkout flows. | Logical tab order, visible focus, operable controls, and no keyboard traps. |
| UX-002 | P2 | Inspect each page with an accessibility snapshot. | Headings, form labels, buttons, links, error messages, and status/badge content are exposed meaningfully. |
| UX-003 | P2 | Run at desktop, tablet, and mobile viewport sizes. | No clipped controls, overlapping text, unusable menu, horizontal overflow, or inaccessible checkout action. |
| UX-004 | P2 | Run P0/P1 tests in Chromium, Firefox, and WebKit. | Functional behavior and critical layout are consistent; browser-specific issues are recorded. |
| UX-005 | P2 | Reload during inventory, cart, each checkout step, and completion. | App either restores the supported state or redirects safely with no misleading confirmation. |
| UX-006 | P2 | Observe console errors and failed network requests during P0 flows. | No unexpected application errors; known third-party or environment failures are separated from product defects. |
| UX-007 | P2 | Exercise slow-loading and delayed-response personas. | Loading indicators, controls, and navigation remain usable without duplicate cart additions or duplicate orders. |

## 7. Recommended Playwright organization

Split implementation into focused specs so failures identify the product area:

- `tests/auth.spec.ts`: AUTH-001 through AUTH-009
- `tests/catalog.spec.ts`: CAT-001 through CAT-008
- `tests/cart.spec.ts`: CART-001 through CART-007
- `tests/checkout.spec.ts`: CHK-001 through CHK-010
- `tests/navigation.spec.ts`: NAV-001 through NAV-005
- `tests/ux.spec.ts`: UX-001 through UX-007

Use a fixture or helper for login, `test.step` for business actions, role/name
locators where available, and `data-test` locators for stable app-specific
elements. Assert URL, visible headings, accessible names, cart badge, product
identity, and calculated totals. Keep each test isolated by starting a fresh
context and use the menu reset action where a scenario intentionally begins with
an authenticated session.

## 8. Exit criteria and reporting

- All P0 tests pass in Chromium, Firefox, and WebKit.
- No open blocker or critical defect remains for login, catalog, cart, checkout,
	or order completion.
- P1 tests pass or have an accepted defect with reproduction steps and evidence.
- P2 results include viewport/browser coverage and any accessibility or console
	findings.
- Test reports retain screenshots, traces, and downloads for failures.

Report each failure with test ID, browser/viewport, account, URL, reproduction
steps, expected result, actual result, screenshot/trace, and whether the issue
is deterministic.
