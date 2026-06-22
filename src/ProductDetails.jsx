import React from "react";

function ProductDetails({ product, onBack, addToCart, addWishlist, openCheckout }) {
  return (
    <div className="product-details-page">
      <div className="details-top">
        <button className="back" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="details-card">
        <img
          src={product.image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = product.fallbackImage;
          }}
        />
        <div className="details-info">
          <h2>{product.name}</h2>
          <div className="rating-row">
            <span>Premium</span>
            <span>4.8 rating</span>
          </div>
          <div className="price-row">
            <strong>Rs.{product.price.toLocaleString("en-IN")}</strong>
            <span className="mrp">Rs.{Math.round(product.price * 1.12).toLocaleString("en-IN")}</span>
          </div>
          <div className="discount">12% off</div>
          <p>Category: {product.category}</p>
          <p className="product-description">
            Premium product detail with portrait image, wishlist, cart and fast checkout.
          </p>
          <div className="details-actions">
            <button className="buy-now" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            <button onClick={openCheckout}>Checkout Now</button>
            <button className="wish" onClick={() => addWishlist(product)}>
              Wishlist
            </button>
          </div>
          <div className="payment-summary">
            <h3>Payment options</h3>
            <p>UPI, card and cash on delivery are available at checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
