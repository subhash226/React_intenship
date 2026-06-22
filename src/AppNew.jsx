import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import smLogo from "./assets/hero.png";
import ProductDetails from "./ProductDetails";

const heroSlides = [
  {
    title: "SM Nexus Premium Store",
    description: "Browse flagship tech, accessories and travel gear with premium design and details.",
    badge: "New Arrivals",
    theme: "Smart Picks"
  },
  {
    title: "Secure Checkout & Order Tracking",
    description: "Choose UPI, credit/debit or cash on delivery and track every order from your profile.",
    badge: "Fast Pay",
    theme: "Trusted Delivery"
  },
  {
    title: "AI Product Recommendations",
    description: "Get intelligent product suggestions, stock alerts and order history in one place.",
    badge: "Recommended",
    theme: "Personalized"
  }
];

const navTabs = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "account", icon: "👤", label: "Profile" },
  { id: "support", icon: "💬", label: "Support" },
  { id: "cart", icon: "🛒", label: "Cart" }
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentDetails, setPaymentDetails] = useState({ upiId: "", cardNumber: "", cardName: "", cvv: "" });
  const [prevView, setPrevView] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hi! I’m your SM Nexus assistant. Ask me about products, stock or orders." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  const playNotificationSound = () => {
    const audio = new Audio("/not.mpeg");
    audio.volume = 0.35;
    audio.play().catch(() => {
      const fallback = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
      fallback.volume = 0.4;
      fallback.play().catch(() => {});
    });
  };

  const showNotification = (message) => {
    setNotification(message);
    playNotificationSound();
    setTimeout(() => setNotification(""), 3200);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        showNotification("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      showNotification(`Searching: ${transcript}`);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setVoiceSupported(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

    const handleScroll = () => {
      setShowBackTop(window.scrollY > 220);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      console.warn("Service worker registration failed.");
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((item) => item.category)))];
  const qualities = ["All", ...Array.from(new Set(products.map((item) => item.quality)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesQuality = qualityFilter === "All" || product.quality === qualityFilter;
    const matchesRating = product.rating >= Number(minRating);
    const matchesMinPrice = minPrice === "" || product.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || product.price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesQuality && matchesRating && matchesMinPrice && matchesMaxPrice;
  });

  const recommendedProducts = products.filter((product) => product.rating >= 4.7 && product.stock > 0).slice(0, 4);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product, quantity = 1) => {
    if (product.stock === 0) {
      showNotification("Product is out of stock.");
      return;
    }

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      showNotification("Quantity updated in cart.");
    } else {
      setCart([...cart, { ...product, quantity }]);
      showNotification("Added to cart.");
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    showNotification("Item removed from cart.");
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCart(cart.map((item) => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const addWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      showNotification("Already in wishlist.");
      return;
    }
    setWishlist([...wishlist, product]);
    showNotification("Added to wishlist.");
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      showNotification("Please enter email and password.");
      return;
    }
    if (authMode === "signup" && !authForm.name) {
      showNotification("Please enter a name to sign up.");
      return;
    }
    setUser({ name: authForm.name || "SM Nexus Shopper", email: authForm.email });
    setAuthForm({ name: "", email: "", password: "" });
    showNotification(authMode === "signup" ? "Account created." : "Logged in successfully.");
    setActiveTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("home");
    showNotification("Logged out.");
  };

  const submitChatMessage = (message) => {
    if (!message.trim()) return;
    setChatMessages((current) => [...current, { sender: "user", text: message }]);
    setChatInput("");

    const lower = message.toLowerCase();
    let reply = "I’m here to help with product choices, payments, and orders.";

    if (lower.includes("recommend")) {
      reply = "Check the recommendations in the right sidebar for top-rated picks.";
    } else if (lower.includes("track")) {
      reply = orders.length > 0 ? `Your latest order #${orders[0].id} is ${orders[0].status}.` : "You have no orders yet.";
    } else if (lower.includes("stock")) {
      reply = "Stock status is visible on every product card and detail page.";
    }

    setTimeout(() => {
      setChatMessages((current) => [...current, { sender: "bot", text: reply }]);
    }, 800);
  };

  const handleCheckoutConfirm = () => {
    if (!cart.length && !selectedProduct) {
      showNotification("Your cart is empty.");
      return;
    }
    if (paymentMethod === "UPI" && (!paymentDetails.upiId || !paymentDetails.upiId.includes("@"))) {
      showNotification("Enter a valid UPI ID.");
      return;
    }
    if (paymentMethod === "Card" && (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, "").length < 12)) {
      showNotification("Enter a valid card number.");
      return;
    }
    if (paymentMethod === "Card" && (!paymentDetails.cvv || paymentDetails.cvv.length < 3)) {
      showNotification("Enter a valid CVV.");
      return;
    }
    const orderId = Math.floor(Math.random() * 900000 + 100000);
    const checkoutItems = cart.length ? cart : [{ ...selectedProduct, quantity: 1 }];
    const orderTotal = totalPrice || selectedProduct?.price || 0;
    const newOrder = {
      id: orderId,
      items: checkoutItems,
      total: orderTotal,
      paymentMethod,
      status: "Confirmed",
      placedAt: new Date().toLocaleString()
    };
    setOrders((current) => [newOrder, ...current]);
    setProducts((current) => current.map((product) => {
      const purchased = checkoutItems.find((item) => item.id === product.id);
      return purchased ? { ...product, stock: Math.max(0, product.stock - purchased.quantity) } : product;
    }));
    setCart([]);
    setSelectedProduct(null);
    setShowCheckout(false);
    setPaymentDetails({ upiId: "", cardNumber: "", cardName: "", cvv: "" });
    showNotification(`Order #${orderId} confirmed.`);
  };

  const renderHeroSlider = () => (
    <div className="hero-slider">
      {heroSlides.map((slide, idx) => (
        <div key={slide.title} className={`hero-slide ${idx === heroSlideIndex ? "active" : ""}`}>
          <div className="hero-copy">
            <span className="product-badge">{slide.badge}</span>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <div className="hero-tags">
              <span>{slide.theme}</span>
              <span>Fast delivery</span>
              <span>Safe payments</span>
            </div>
          </div>
        </div>
      ))}
      <div className="slider-controls">
        {heroSlides.map((_, idx) => (
          <button key={idx} className={idx === heroSlideIndex ? "active" : ""} onClick={() => setHeroSlideIndex(idx)} />
        ))}
      </div>
    </div>
  );

  const renderAuthSection = () => (
    <div className="page-panel centered-page">
      <div className="dashboard-card auth-card">
        <div className="auth-switch">
          <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Login</button>
          <button className={authMode === "signup" ? "active" : ""} onClick={() => setAuthMode("signup")}>Sign Up</button>
        </div>
        <form className="auth-form" onSubmit={handleAuthSubmit}>
          {authMode === "signup" && (
            <input placeholder="Your Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
          )}
          <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
          <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
          <button className="checkout" type="submit">{authMode === "signup" ? "Create Account" : "Login"}</button>
        </form>
      </div>
    </div>
  );

  const renderHomePage = () => (
    <div className="page-panel">
      {renderHeroSlider()}
      <div className="filter-panel">
        <div className="filter-row">
          <input type="search" placeholder="Search SM Nexus products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className={`voice-btn ${listening ? "listening" : ""}`} onClick={() => {
            if (!voiceSupported) {
              showNotification("Voice search not supported.");
              return;
            }
            if (listening) {
              recognitionRef.current.stop();
              setListening(false);
            } else {
              recognitionRef.current.start();
              setListening(true);
            }
          }}>{listening ? "Listening..." : "Voice Search"}</button>
        </div>
        <div className="filter-grid">
          <div><label>Category</label><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label>Quality</label><select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)}>{qualities.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label>Min Price</label><input type="number" placeholder="₹0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} /></div>
          <div><label>Max Price</label><input type="number" placeholder="₹99999" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></div>
          <div><label>Rating</label><select value={minRating} onChange={(e) => setMinRating(e.target.value)}><option value="0">All</option><option value="4">4 ★+</option><option value="4.5">4.5 ★+</option><option value="5">5 ★</option></select></div>
        </div>
      </div>
      <div className="main-content">
        <div className="left-column">
          <section className="section">
            <h2>Featured Products</h2>
            {loading ? (
              <div className="skeleton-grid">{Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="card skeleton-card"></div>)}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state"><p>No products match your filters.</p></div>
            ) : (
              <div className="products">{filteredProducts.map((product) => (
                <div className="card" key={product.id}>
                  {product.stock === 0 && <span className="premium-ribbon">Out of stock</span>}
                  <img src={product.image} alt={product.name} />
                  <div className="card-info">
                    <h3>{product.name}</h3>
                    <p className="card-category">{product.category} • {product.quality}</p>
                    <p className="card-price">₹{product.price}</p>
                    <div className="rating-row"><span>⭐ {product.rating}</span><span>{product.stock} left</span></div>
                    <div className="card-actions">
                      <button className="details-btn" onClick={() => setSelectedProduct(product)}>View Details</button>
                      <button className="buy-now" disabled={product.stock === 0} onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                    <button className="wish" onClick={() => addWishlist(product)}>❤ Wishlist</button>
                  </div>
                </div>
              ))}</div>
            )}
          </section>
        </div>
        <aside className="right-column sidebar-section">
          <div className="section">
            <h2>Cart Summary</h2>
            {cart.length === 0 ? (
              <p>Add items to see the total instantly.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}><div><strong>{item.name}</strong><span>Qty {item.quantity}</span></div><div>₹{item.price * item.quantity}</div></div>
                ))}
                <div className="cart-total"><span>Total</span><strong>₹{totalPrice}</strong></div>
                <button className="checkout" onClick={() => { setPrevView('home'); setShowCheckout(true); }}>Checkout Now</button>
              </>
            )}
          </div>
          <div className="section">
            <h2>Top Recommendations</h2>
            {recommendedProducts.map((product) => (
              <div className="recommendation-card" key={product.id}><div><strong>{product.name}</strong><p>{product.category}</p></div><span>⭐ {product.rating}</span></div>
            ))}
          </div>
          <div className="section tracking">
            <h2>Support & Stock</h2>
            <p>Live chat is available for product advice, stock updates and order help.</p>
            <button className="checkout" onClick={() => setChatOpen(true)}>Open Chat</button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderOrdersPage = () => (
    <div className="page-panel">
      <div className="section">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <div className="empty-state"><p>No orders yet.</p></div>
        ) : (
          <div className="order-history">{orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header"><strong>Order #{order.id}</strong><span className="order-status-pill">{order.status}</span></div>
              <p>{order.placedAt}</p>
              <div className="order-card-items">{order.items.map((item) => <span key={item.id}>{item.name} ×{item.quantity}</span>)}</div>
              <div className="order-card-footer"><span>Total ₹{order.total}</span><strong>{order.paymentMethod}</strong></div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );

  const renderAccountPage = () => {
    if (!user) return renderAuthSection();
    return (
      <div className="page-panel account-panel-main">
        <div className="profile-card">
          <div><h2>Hello, {user.name}</h2><p>Manage your orders, wishlist and account.</p></div>
          <div className="profile-stats">
            <div className="profile-stat"><strong>{orders.length}</strong><span>Orders</span></div>
            <div className="profile-stat"><strong>{wishlist.length}</strong><span>Wishlist</span></div>
            <div className="profile-stat"><strong>{cart.length}</strong><span>Cart</span></div>
          </div>
        </div>
        <div className="account-panels">
          <div className="account-panel-card"><h3>Profile</h3><p>{user.email}</p><button className="checkout" onClick={handleLogout}>Logout</button></div>
          <div className="account-panel-card"><h3>Latest Order</h3>{orders.length === 0 ? <p>No orders yet.</p> : <p>Order #{orders[0].id} is {orders[0].status}.</p>}</div>
        </div>
      </div>
    );
  };

  const renderSupportPage = () => (
    <div className="page-panel support-panel">
      <div className="section">
        <h2>Live Chat Support</h2>
        <p>Ask product questions, payment help, and real-time stock updates.</p>
        <button className="checkout" onClick={() => setChatOpen(true)}>Open Chat</button>
      </div>
      {chatOpen && (
        <div className="chat-widget">
          <div className="chat-header"><div><strong>SM Nexus Support</strong><p>Online</p></div><button className="modal-close" onClick={() => setChatOpen(false)}>✕</button></div>
          <div className="chat-body">{chatMessages.map((message, idx) => (<div key={idx} className={`chat-bubble ${message.sender}`}>{message.text}</div>))}</div>
          <div className="chat-input-row"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Send a message..." onKeyDown={(e) => { if (e.key === "Enter") submitChatMessage(chatInput); }} /><button onClick={() => submitChatMessage(chatInput)}>Send</button></div>
        </div>
      )}
    </div>
  );

  const renderCartPage = () => (
    <div className="page-panel">
      <div className="cart-page">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <div className="empty-state"><p>Your cart is empty.</p></div>
        ) : (
          <div className="cart-list">{cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info"><strong>{item.name}</strong><span>₹{item.price} × {item.quantity}</span></div>
              <div className="cart-item-controls"><button onClick={() => decreaseQty(item.id)}>-</button><span>{item.quantity}</span><button onClick={() => increaseQty(item.id)}>+</button></div>
              <div className="cart-item-price">₹{item.price * item.quantity}</div>
              <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}<div className="cart-total"><span>Subtotal</span><strong>₹{totalPrice}</strong></div><button className="checkout" onClick={() => { setPrevView('cart'); setShowCheckout(true); }}>Proceed to Checkout</button></div>
        )}
      </div>
    </div>
  );

  const renderPage = () => {
    if (activeTab === "home") return renderHomePage();
    if (activeTab === "orders") return renderOrdersPage();
    if (activeTab === "account") return renderAccountPage();
    if (activeTab === "support") return renderSupportPage();
    if (activeTab === "cart") return renderCartPage();
    return renderHomePage();
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {notification && <div className="notification">{notification}</div>}
      <header>
        <div className="header-brand-container"><img src={smLogo} alt="SM Nexus" className="header-shop-logo" /><div><h1>SM Nexus</h1><p className="header-subtitle">Premium tech shopping with live support and profile tracking.</p></div></div>
        <div className="top-right-summary"><div className="cart-summary"><span>🛒 {cart.length}</span></div><div className="wishlist-summary"><span>❤ {wishlist.length}</span></div></div>
        <button className="dark-btn" onClick={() => setDarkMode((current) => !current)}>{darkMode ? "☀ Light" : "🌙 Dark"}</button>
      </header>
      <section className="service-row"><button className="service-pill active">SM Nexus</button><button className="service-pill">Premium Tech</button><button className="service-pill">Smart Living</button></section>
      <main className="main-content">{renderPage()}</main>
      <nav className="bottom-nav">{navTabs.map((tab) => (<button key={tab.id} className={activeTab === tab.id ? "nav-tab active" : "nav-tab"} onClick={() => setActiveTab(tab.id)}><span>{tab.icon}</span><small>{tab.label}</small></button>))}</nav>
      {selectedProduct && (<div className="modal-overlay"><div className="modal product-modal"><ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} addToCart={addToCart} addWishlist={addWishlist} openCheckout={() => { setPrevView('product'); setShowCheckout(true); }} /></div></div>)}
      {showCheckout && (<div className="modal-overlay"><div className="modal"><div className="checkout-header"><button className="back-btn" onClick={() => { setShowCheckout(false); if (prevView !== 'product') setSelectedProduct(null); }}>← Back</button><button className="modal-close" onClick={() => setShowCheckout(false)}>✕</button></div><div className="checkout-card"><h2>Checkout</h2><div className="checkout-item"><img src={cart[0]?.image || selectedProduct?.image} alt={cart[0]?.name || selectedProduct?.name} /><div className="checkout-info"><h3>{cart.length ? cart[0].name : selectedProduct?.name || 'Your Cart'}</h3><p className="checkout-category">{cart.length ? cart[0].category : selectedProduct?.category || ''}</p><div className="checkout-price-row"><strong>₹{totalPrice || selectedProduct?.price || 0}</strong></div></div></div><div className="checkout-summary"><div><span>Items</span><strong>{cart.length || (selectedProduct ? 1 : 0)}</strong></div><div><span>Subtotal</span><strong>₹{totalPrice || selectedProduct?.price || 0}</strong></div></div><div className="payment-methods"><label>Payment Method</label><div className="payment-options"><label><input type="radio" name="pm" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} /> UPI</label><label><input type="radio" name="pm" value="Card" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} /> Card / Debit</label><label><input type="radio" name="pm" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /> Cash on Delivery</label></div></div>{paymentMethod === 'UPI' && (<div className="payment-inputs"><input placeholder="UPI ID (e.g. name@bank)" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })} /></div>)}{paymentMethod === 'Card' && (<div className="payment-inputs"><input placeholder="Card Number" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} /><input placeholder="Name on Card" value={paymentDetails.cardName} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })} /><input placeholder="CVV" value={paymentDetails.cvv} onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} /></div>)}<div className="checkout-action-row"><button className="checkout-action" onClick={handleCheckoutConfirm}>Confirm & Pay</button></div></div></div></div>)}
      {showBackTop && (<button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Back to top</button>)}
    </div>
  );
}

export default App;
