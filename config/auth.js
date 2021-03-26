const callbackUrl = "http://localhost:3000/";

module.exports = {
    'facebookAuth': {
        'clientID': '3096793217211481',
        'clientSecret': 'bfbd740931922b95f1f13633451ad8b0',
        'callbackURL': 'http://localhost:5000/api/auth/facebook/callback'
    },
    //clientID: "443028773086-r2s66717t8b0gg6ilmveqsvl8de62bal.apps.googleusercontent.com",
    //clientSecret: "pffo2vvvAGWrPRXu4ZI0ZyKA",
    'googleAuth': {
        'clientID': '831311355741-o7gf1etvebaap3ahc447m3g8af6m5hsv.apps.googleusercontent.com',
        'clientSecret': 'd4q6kqKhqsQLGoYlBBCKb-S6',
        'callbackURL': 'http://localhost:5000/api/auth/google/callback'
    }
}
