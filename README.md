# ThighSupply

A direct-to-consumer ecommerce site for a sustainably sourced unisex
short-shorts brand (5–6" inseam). For every 10 pairs sold, the brand donates
a pair to a partnered shelter network.

## Stack

Plain HTML, CSS, and vanilla JavaScript. No build step, no framework, no
backend — cart state is persisted to `localStorage`. Drop the folder behind
any static file server (or open `index.html` directly).

## Pages

- `index.html` — homepage with hero, brand pillars, featured products, impact band
- `shop.html` — full collection with style + material filters
- `product.html?id=…` — product detail with size selection and add-to-cart
- `cart.html` — line items, qty controls, donation progress callout
- `checkout.html` — demo checkout form and order confirmation
- `about.html` — sourcing, factory list, and 1-for-10 donation program

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```
index.html       shop.html      product.html
cart.html        checkout.html  about.html
styles.css       script.js
```

`script.js` defines the product catalog, renders shared header/footer,
manages cart state, and contains per-page renderers that no-op when their
DOM hooks aren't present — so a single bundle serves every page.
