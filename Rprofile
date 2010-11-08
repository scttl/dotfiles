# default settings for the R programming language

# CRAN - use the main US site
options("repos" = c(CRAN = "http://cran.r-project.org/"))

#  override q() to not save by default -- doesn't handle ctrl-D :(
q <- function(save="no", ...) {
    quit(save=save, ...)
}

# useful aliases
s <- base::summary
h <- utils::head
n <- base::names
