const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash("error", "You have to log in first")
    res.redirect("/login")
  }
}

module.exports = isLoggedIn
