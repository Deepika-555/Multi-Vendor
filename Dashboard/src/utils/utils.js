import io from 'socket.io-client'

const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: "center"
}

// Use environment variable or NODE_ENV for mode
const mode = process.env.REACT_APP_MODE || process.env.NODE_ENV || 'development'

let app_url, api_url

if (mode === "production") {
    app_url = "https://multi-vendor-dashboard-seven.vercel.app"
    api_url = "https://multi-vendor-5z5y.onrender.com"
} else {
    app_url = 'http://localhost:3001'
    api_url = 'http://localhost:5000'
}

const socket = io(api_url)

export {
    socket,
    app_url,
    api_url,
    overrideStyle,
    mode
}
