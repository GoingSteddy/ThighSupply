// ----------------------------------------------------------------------------
// ThighSupply — storefront script
// Vanilla JS, no build step. Cart persists to localStorage.
// ----------------------------------------------------------------------------

const PRODUCTS = [
  {
    id: "everyday-olive",
    name: "The Everyday",
    color: "Olive",
    swatch: "#6b7a5a",
    inseam: '5"',
    price: 68,
    style: "everyday",
    material: "hemp",
    tag: "Bestseller",
    materialLabel: "55% hemp / 45% organic cotton",
    description:
      "Our flagship cut. A 5\" inseam unisex short in a hemp-cotton twill that softens with every wash. Side pockets, single back pocket with corozo button, drawstring waist with a flat woven cord that doesn't curl.",
  },
  {
    id: "everyday-sand",
    name: "The Everyday",
    color: "Sand",
    swatch: "#c9b78f",
    inseam: '5"',
    price: 68,
    style: "everyday",
    material: "hemp",
    materialLabel: "55% hemp / 45% organic cotton",
    description:
      "The Everyday in a sun-warmed sand. Same hemp-cotton twill, same unisex pattern, just a lighter palette for hot months.",
  },
  {
    id: "everyday-charcoal",
    name: "The Everyday",
    color: "Charcoal",
    swatch: "#3a3a36",
    inseam: '5"',
    price: 68,
    style: "everyday",
    material: "organic-cotton",
    materialLabel: "100% GOTS-certified organic cotton",
    description:
      "An all-cotton variant of the Everyday for warmer climates. Heavier hand than the hemp blend, with the same construction.",
  },
  {
    id: "trail-rust",
    name: "The Trail",
    color: "Rust",
    swatch: "#b85c3c",
    inseam: '6"',
    price: 84,
    style: "trail",
    material: "recycled",
    tag: "New",
    materialLabel: "100% ECONYL® regenerated nylon",
    description:
      "A 6\" inseam technical short for hiking and travel. Quick-drying ECONYL® regenerated nylon, zippered back pocket, gusseted crotch, no PFAS-based water repellent — we use a plant-based alternative.",
  },
  {
    id: "trail-moss",
    name: "The Trail",
    color: "Moss",
    swatch: "#4a5740",
    inseam: '6"',
    price: 84,
    style: "trail",
    material: "recycled",
    materialLabel: "100% ECONYL® regenerated nylon",
    description:
      "The Trail in a deep moss green. Same gusseted, quick-drying construction, same zippered back pocket.",
  },
  {
    id: "swim-cream",
    name: "The Swim",
    color: "Cream",
    swatch: "#ebe4d4",
    inseam: '5"',
    price: 76,
    style: "swim",
    material: "recycled",
    materialLabel: "92% recycled polyester / 8% elastane",
    description:
      "A 5\" inseam unisex swim short in recycled polyester from post-consumer bottles. Mesh-free liner option, drains fast, holds shape after years of saltwater.",
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ----------------------------------------------------------------------------
// Header / footer partials (injected so we don't repeat markup across pages)
// ----------------------------------------------------------------------------

function renderHeader(el) {
  el.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html">ThighSupply<span class="dot" aria-hidden="true"></span></a>
      <nav class="nav">
        <a href="shop.html">Shop</a>
        <a href="about.html">Mission</a>
      </nav>
      <a class="cart-link" href="cart.html" aria-label="Cart">
        Cart <span class="cart-badge" id="cart-badge" hidden>0</span>
      </a>
    </div>`;
}

function renderFooter(el) {
  el.innerHTML = `
    <div class="footer-inner">
      <div>
        <h4>ThighSupply</h4>
        <p>Sustainably sourced, ethically made short shorts. 1-for-10 donations, every month.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="shop.html">All shorts</a>
        <a href="shop.html">The Everyday</a>
        <a href="shop.html">The Trail</a>
        <a href="shop.html">The Swim</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="about.html">Mission</a>
        <a href="about.html">Transparency report</a>
        <a href="about.html">Factory list</a>
      </div>
      <div>
        <h4>Help</h4>
        <a href="#">Sizing & fit</a>
        <a href="#">Returns</a>
        <a href="#">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">© ${new Date().getFullYear()} ThighSupply Co-op. Made in Portugal & Tamil Nadu.</div>`;
}

// ----------------------------------------------------------------------------
// Cart store (localStorage)
// ----------------------------------------------------------------------------

const CART_KEY = "thighsupply.cart.v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartCount() {
  return loadCart().reduce((n, item) => n + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const n = cartCount();
  if (n > 0) {
    badge.textContent = String(n);
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

function addToCart(productId, size, qty = 1) {
  const cart = loadCart();
  const key = `${productId}::${size}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, productId, size, qty });
  }
  saveCart(cart);
}

function setQty(key, qty) {
  let cart = loadCart();
  if (qty <= 0) {
    cart = cart.filter((i) => i.key !== key);
  } else {
    const item = cart.find((i) => i.key === key);
    if (item) item.qty = qty;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// ----------------------------------------------------------------------------
// Renderers
// ----------------------------------------------------------------------------

function productCardHTML(p) {
  const tag = p.tag ? `<span class="tag">${p.tag}</span>` : "";
  return `
    <a class="product-card" href="product.html?id=${p.id}">
      <div class="swatch" style="background:${p.swatch}">
        ${tag}
        ${p.color}
      </div>
      <div class="meta">
        <p class="name">${p.name} — ${p.color}</p>
        <p class="sub">${p.inseam} inseam · Unisex</p>
        <p class="price">$${p.price}</p>
      </div>
    </a>`;
}

function renderFeaturedGrid() {
  const el = document.getElementById("featured-grid");
  if (!el) return;
  const featured = PRODUCTS.slice(0, 4);
  el.innerHTML = featured.map(productCardHTML).join("");
}

function renderShopGrid() {
  const el = document.getElementById("shop-grid");
  if (!el) return;

  const checked = (name) =>
    Array.from(
      document.querySelectorAll(`input[data-filter="${name}"]:checked`)
    ).map((i) => i.value);

  const draw = () => {
    const styles = checked("style");
    const materials = checked("material");
    const filtered = PRODUCTS.filter((p) => {
      if (styles.length && !styles.includes(p.style)) return false;
      if (materials.length && !materials.includes(p.material)) return false;
      return true;
    });
    el.innerHTML = filtered.length
      ? filtered.map(productCardHTML).join("")
      : `<p>No shorts match those filters. <a class="link" href="#" id="clear-inline">Clear filters</a></p>`;
    const inline = document.getElementById("clear-inline");
    if (inline)
      inline.addEventListener("click", (e) => {
        e.preventDefault();
        clearAll();
      });
  };

  const clearAll = () => {
    document
      .querySelectorAll('input[data-filter]')
      .forEach((i) => (i.checked = false));
    draw();
  };

  document
    .querySelectorAll("input[data-filter]")
    .forEach((i) => i.addEventListener("change", draw));
  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) clearBtn.addEventListener("click", clearAll);

  draw();
}

function renderProductDetail() {
  const el = document.getElementById("product-detail");
  if (!el) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const p = findProduct(id);
  if (!p) {
    el.innerHTML = `<p>Product not found. <a class="link" href="shop.html">Back to shop →</a></p>`;
    return;
  }
  document.title = `${p.name} ${p.color} — ThighSupply`;

  el.innerHTML = `
    <div class="gallery" style="background:${p.swatch}">${p.color}</div>
    <div class="pd-info">
      <p class="eyebrow">${p.style.charAt(0).toUpperCase() + p.style.slice(1)} · Unisex</p>
      <h1>${p.name} — ${p.color}</h1>
      <p class="pd-price">$${p.price}</p>
      <p class="pd-desc">${p.description}</p>

      <div class="size-row">
        <p class="label">Size</p>
        <div class="size-options" id="size-options">
          ${SIZES.map((s) => `<button class="size-btn" data-size="${s}" type="button">${s}</button>`).join("")}
        </div>
      </div>

      <button class="btn btn-primary" id="add-btn" disabled>Select a size</button>

      <dl class="specs">
        <dt>Inseam</dt><dd>${p.inseam} (unisex)</dd>
        <dt>Material</dt><dd>${p.materialLabel}</dd>
        <dt>Made in</dt><dd>${p.material === "recycled" ? "Vila Nova de Famalicão, Portugal" : "Tiruppur, Tamil Nadu, India"}</dd>
        <dt>Care</dt><dd>Cold wash, line dry. No fabric softener.</dd>
        <dt>Donation impact</dt><dd>One in ten of these triggers a donated pair to our shelter partners.</dd>
      </dl>
    </div>`;

  let selectedSize = null;
  const addBtn = document.getElementById("add-btn");

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
      addBtn.disabled = false;
      addBtn.textContent = `Add to cart — $${p.price}`;
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selectedSize) return;
    addToCart(p.id, selectedSize, 1);
    addBtn.textContent = "Added ✓";
    setTimeout(() => {
      addBtn.textContent = `Add to cart — $${p.price}`;
    }, 1400);
  });
}

function renderCart() {
  const el = document.getElementById("cart-view");
  if (!el) return;

  const cart = loadCart();
  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <h2>Nothing in the cart yet.</h2>
        <p>Find a pair you like — every tenth one shipped puts a pair on someone who needs it.</p>
        <a class="btn btn-primary" href="shop.html">Shop the collection</a>
      </div>`;
    return;
  }

  const rows = cart
    .map((item) => {
      const p = findProduct(item.productId);
      if (!p) return "";
      const lineTotal = (p.price * item.qty).toFixed(2);
      return `
        <div class="cart-row">
          <div class="swatch" style="background:${p.swatch}">${p.color[0]}</div>
          <div>
            <p class="name">${p.name} — ${p.color}</p>
            <p class="sub">Size ${item.size} · ${p.inseam} inseam</p>
          </div>
          <div class="qty">
            <button data-act="dec" data-key="${item.key}" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-key="${item.key}" aria-label="Increase">+</button>
          </div>
          <div>$${lineTotal}</div>
          <button class="remove-btn" data-act="remove" data-key="${item.key}">Remove</button>
        </div>`;
    })
    .join("");

  const subtotal = cart.reduce((sum, i) => {
    const p = findProduct(i.productId);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
  const totalItems = cart.reduce((n, i) => n + i.qty, 0);
  const shipping = subtotal >= 100 ? 0 : 8;
  const total = subtotal + shipping;

  const donationNote =
    totalItems >= 10
      ? `This order alone triggers <strong>${Math.floor(totalItems / 10)}</strong> donated pair${Math.floor(totalItems / 10) > 1 ? "s" : ""}.`
      : `${10 - (totalItems % 10)} more pair${10 - (totalItems % 10) === 1 ? "" : "s"} until the next donation.`;

  el.innerHTML = `
    <div class="cart-table">${rows}</div>
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      <div class="donation-callout">${donationNote}</div>
      <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end">
        <a class="btn btn-ghost btn-small" href="shop.html">Keep shopping</a>
        <a class="btn btn-primary" href="checkout.html">Checkout</a>
      </div>
    </div>`;

  el.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const act = btn.dataset.act;
      const cart = loadCart();
      const item = cart.find((i) => i.key === key);
      if (!item) return;
      if (act === "inc") setQty(key, item.qty + 1);
      else if (act === "dec") setQty(key, item.qty - 1);
      else if (act === "remove") setQty(key, 0);
      renderCart();
    });
  });
}

function renderCheckout() {
  const el = document.getElementById("checkout-view");
  if (!el) return;

  const cart = loadCart();
  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty.</h2>
        <a class="btn btn-primary" href="shop.html">Shop the collection</a>
      </div>`;
    return;
  }

  const summaryRows = cart
    .map((item) => {
      const p = findProduct(item.productId);
      if (!p) return "";
      return `
        <div class="summary-row">
          <span>${p.name} — ${p.color} · ${item.size} × ${item.qty}</span>
          <span>$${(p.price * item.qty).toFixed(2)}</span>
        </div>`;
    })
    .join("");

  const subtotal = cart.reduce((sum, i) => {
    const p = findProduct(i.productId);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
  const shipping = subtotal >= 100 ? 0 : 8;
  const total = subtotal + shipping;

  el.innerHTML = `
    <div class="checkout-grid">
      <form class="checkout-form" id="checkout-form" novalidate>
        <fieldset>
          <legend>Contact</legend>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" required placeholder="you@example.com" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Shipping address</legend>
          <div class="row-2">
            <div class="field">
              <label for="first">First name</label>
              <input id="first" required />
            </div>
            <div class="field">
              <label for="last">Last name</label>
              <input id="last" required />
            </div>
          </div>
          <div class="field">
            <label for="addr">Address</label>
            <input id="addr" required />
          </div>
          <div class="row-2">
            <div class="field">
              <label for="city">City</label>
              <input id="city" required />
            </div>
            <div class="field">
              <label for="zip">ZIP / Postal code</label>
              <input id="zip" required />
            </div>
          </div>
          <div class="field">
            <label for="country">Country</label>
            <select id="country">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Portugal</option>
              <option>Germany</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Payment (demo)</legend>
          <div class="field">
            <label for="card">Card number</label>
            <input id="card" placeholder="4242 4242 4242 4242" inputmode="numeric" />
          </div>
          <div class="row-2">
            <div class="field">
              <label for="exp">Expiry</label>
              <input id="exp" placeholder="MM / YY" />
            </div>
            <div class="field">
              <label for="cvc">CVC</label>
              <input id="cvc" placeholder="123" inputmode="numeric" />
            </div>
          </div>
        </fieldset>

        <button class="btn btn-primary" type="submit">Place order — $${total.toFixed(2)}</button>
      </form>

      <aside class="order-summary">
        <h3>Order summary</h3>
        ${summaryRows}
        <div class="summary-row" style="margin-top:12px"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span></div>
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </aside>
    </div>`;

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const orderId = "TS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const totalItems = cart.reduce((n, i) => n + i.qty, 0);
    clearCart();
    document.querySelector("main.container").innerHTML = `
      <section class="page-head">
        <h1>Thanks — your order is in.</h1>
      </section>
      <div class="confirmation">
        <div class="check">✓</div>
        <h2>Order ${orderId}</h2>
        <p>We sent a confirmation to your email. Your shorts ship within 3 business days from the workshop closest to you.</p>
        <p style="margin-top:24px;color:var(--sage-dark)">
          <strong>Your impact:</strong> this purchase contributes ${totalItems} pair${totalItems === 1 ? "" : "s"} toward the next donation tally.
        </p>
        <a class="btn btn-primary" href="shop.html" style="margin-top:24px">Keep shopping</a>
      </div>`;
  });
}

// ----------------------------------------------------------------------------
// Boot
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector('[data-include="header"]');
  if (headerEl) renderHeader(headerEl);
  const footerEl = document.querySelector('[data-include="footer"]');
  if (footerEl) renderFooter(footerEl);

  updateCartBadge();
  renderFeaturedGrid();
  renderShopGrid();
  renderProductDetail();
  renderCart();
  renderCheckout();
});
