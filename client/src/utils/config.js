const stripe_sky = 'pk_test_51Nk8Y4F0B89ncn3xWB6ZN3GsbVIVL7Jqfa3jxtIOpPkKHcleHZw4EMPJKd4cRwm34ZARBeYmAWwu3VxyYL1gb6OT00UKNSvfvb'

// Set mode to 'production'
const mode = 'production'

let app_url, api_url

if (mode === "production") {
    app_url = "https://multi-vendor-lake.vercel.app"     // Your frontend production URL
    api_url = "https://multi-vendor-5z5y.onrender.com"  // Your backend production URL
} else {
    app_url = 'http://localhost:3000'
    api_url = 'http://localhost:5000'
}

export {
    app_url,
    api_url,
    stripe_sky
}
