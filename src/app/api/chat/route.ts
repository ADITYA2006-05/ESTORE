import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 0 // Disable cache for real-time catalog search

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const query = message.toLowerCase().trim()
    let response = ''
    let productsMatched: Product[] = []

    // 1. ADMIN DASHBOARD & LOGIN INQUIRY
    if (
      query.includes('admin') || 
      query.includes('login') || 
      query.includes('credential') || 
      query.includes('password') || 
      query.includes('username') || 
      query.includes('sign in') || 
      query.includes('dashboard') ||
      query.includes('control panel')
    ) {
      response = `### 🔒 Admin Access Information

To manage the inventory of the e-store, you can log into the secure Admin Control Panel:

1. Click on the **user/avatar icon** located in the top-right corner of the navigation bar.
2. Select the **Administrator Gateway** link.
3. Log in with your secure, database-registered administrator credentials.

*Note: Pre-configured developer keys have been securely disabled. Administrator profiles can only be created by the website owner running the local administrative command-line utility: \`npm run create-admin\`.*

Once authenticated, you will be redirected to the **Product Database Dashboard** where you can:
- Add new custom products with titles, prices, descriptions, and categories.
- Instantly load high-quality Unsplash image templates using our **Quick Presets** (including Artisan Matcha, Premium Loungewear, or Minimalist Desk Charger).
- View live database inventory and delete items from the catalog in real-time.`
    }
    // 1.5 REGISTERED CUSTOMERS & ACTIVE SESSION LOOKUPS
    else if (
      query.includes('registered') || 
      query.includes('customer') && query.includes('list') ||
      query.includes('who is logged') ||
      query.includes('who am i') ||
      query.includes('list users') ||
      query.includes('my profile') ||
      query.includes('show users')
    ) {
      const dbUsers = await prisma.user.findMany()
      
      if (dbUsers.length > 0) {
        response = `### 👥 Registered Customer Registry

I have queried our SQLite user database and found **${dbUsers.length} registered customer account${dbUsers.length === 1 ? '' : 's'}**:

${dbUsers.map(u => `- **${u.name || 'Anonymous'}** (\`${u.email}\`) — Authenticated via \`${u.provider}\``).join('\n')}

*To test customer authentication, you can sign out and register a new account or log in instantly using our simulated **Google Single Sign-On** popup dialog on the [Login Portal](/login)!*`
      } else {
        response = `### 👥 Registered Customer Registry

I queried the SQLite database but **no customer accounts are currently registered**. 

You can become our very first customer! Head over to the [Customer Registration Portal](/login) and either create an email credentials account or select **Continue with Google** for instant authenticated entry!`
      }
    }
    // 2. SHIPPING, DISPATCH & RETURNS POLICIES
    else if (
      query.includes('shipping') || 
      query.includes('delivery') || 
      query.includes('dispatch') || 
      query.includes('return') || 
      query.includes('refund') || 
      query.includes('guarantee') || 
      query.includes('policy') || 
      query.includes('cost') && query.includes('ship')
    ) {
      response = `### 📦 Delivery & Tactile Guarantee

We aim for absolute ease and satisfaction in our delivery and ownership experience:

- **Free Worldwide Delivery**: All orders, regardless of size or destination, are packaged with meticulous care and dispatched globally with **zero shipping charges**.
- **Tactile Satisfaction Guarantee**: If a selected item does not fit harmoniously into your space or wardrobe, we offer a **30-day return policy**. 
- **Easy Refunds**: Simply contact our support to arrange a returned shipment. We will issue a prompt and complete refund with no restocking fees, honoring your search for the perfect design.`
    }
    // 3. BRAND PHILOSOPHY & FOUNDING CONCEPT
    else if (
      query.includes('about') || 
      query.includes('philosophy') || 
      query.includes('who are') || 
      query.includes('brand') || 
      query.includes('concept') || 
      query.includes('found') || 
      query.includes('origin') || 
      query.includes('creative') || 
      query.includes('purpose') ||
      query.includes('concept')
    ) {
      response = `### 🌿 Intentional Living & Premium Design

Founded in **2026**, our brand represents a rebellion against the clutter of mass consumerism. We focus on small-batch, ethically sourced, and exceptionally designed daily essentials.

Our catalog is built on three main pillars:
1. **Utility & Harmony**: Every item must solve a daily ritual while fitting cleanly into a contemporary aesthetic.
2. **Material Integrity**: We source durable, tactile materials—from washed flax linen and titanium to thick ceramics and high-grade silicones.
3. **Curated Simplicity**: We limit our inventory to beautiful essentials, helping you curate a balanced lifestyle rather than a crowded home.`
    }
    // 4. LIVE PRODUCT SEARCH & INVENTORY LOOKUP
    else if (
      query.includes('product') || 
      query.includes('item') || 
      query.includes('sell') || 
      query.includes('have') || 
      query.includes('buy') || 
      query.includes('shop') || 
      query.includes('catalog') ||
      query.includes('price') ||
      query.includes('apparel') || 
      query.includes('accessory') || 
      query.includes('accessories') || 
      query.includes('home') || 
      query.includes('food') || 
      query.includes('tea') || 
      query.includes('matcha') || 
      query.includes('wear') || 
      query.includes('sock') || 
      query.includes('electronic') || 
      query.includes('dock') || 
      query.includes('charger') ||
      query.includes('what do you')
    ) {
      // Fetch all products from DB
      const dbProducts = await prisma.product.findMany()

      // Define potential category search
      let targetCat = ''
      if (query.includes('apparel') || query.includes('clothing')) targetCat = 'Apparel'
      else if (query.includes('accessor')) targetCat = 'Accessories'
      else if (query.includes('home')) targetCat = 'Home'
      else if (query.includes('food') || query.includes('tea') || query.includes('matcha')) targetCat = 'Food'
      else if (query.includes('wear') || query.includes('sock') || query.includes('shoe')) targetCat = 'Daily Wear'
      else if (query.includes('electronic') || query.includes('charger') || query.includes('dock')) targetCat = 'Electronics'

      if (targetCat) {
        productsMatched = dbProducts.filter(p => p.category.toLowerCase() === targetCat.toLowerCase())
      } else {
        // Try to match search terms with names, descriptions or categories
        const searchTerms = query.split(/\s+/).filter((t: string) => t.length > 2 && !['and', 'the', 'for', 'you', 'are', 'sell', 'have', 'show', 'item', 'items', 'with'].includes(t))
        if (searchTerms.length > 0) {
          productsMatched = dbProducts.filter(p => 
            searchTerms.some((term: string) => 
              p.name.toLowerCase().includes(term) || 
              p.description.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term)
            )
          )
        } else {
          // Default to all products if they just asked generally for "products" or "items"
          productsMatched = dbProducts
        }
      }

      if (productsMatched.length > 0) {
        response = `### 🛍️ Curated Inventory Search

I have searched our active database and discovered **${productsMatched.length} matching item${productsMatched.length === 1 ? '' : 's'}** inside our catalog:

${productsMatched.map(p => `- **${p.name}** (\`${p.category}\`) — **$${p.price.toFixed(2)}**\n  *${p.description}*`).join('\n\n')}

*Would you like me to guide you to our [Full Catalog](/shop) or help you add something to your cart?*`
      } else {
        response = `### 🔍 Catalog Query

I searched our active inventory database but didn't find any items matching your exact search terms.

However, we currently offer premium items across **Apparel, Accessories, Home, Food, Daily Wear, and Electronics**. You can browse everything directly on our [Interactive Shop Catalog](/shop).

*Tip: If you are an Administrator, you can log in to the [Admin Panel](/admin) using your database-registered administrator credentials to instantly add new products to our database!*`
      }
    }
    // 5. DEFAULT CONCIERGE WELCOME / FALLBACK
    else {
      response = `### 👋 Hello! I am your E-Store AI Concierge.

I have full, real-time knowledge of our **minimalist brand philosophy, store policies, administrator guidelines, and live product database**.

How may I assist your journey through our curated space today?

- **🛍️ Search Live Catalog**: Ask *"Do you sell matcha tea?"* or *"Show me daily wear accessories"* to pull live items and price lists.
- **🔒 Administrator Portal**: Ask *"How do I login as admin?"* to see standard dashboards credentials.
- **📦 Shipping & Guarantees**: Ask *"What is your refund policy?"* or *"Do you charge for delivery?"*.
- **🌿 Our Creative Origin**: Ask *"What is your design philosophy?"* to read about our 2026 founding concept.`
    }

    return NextResponse.json({ response, productsMatched })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
