# setup values for core environment variables

# default file creation permissions mask
umask 022

# don't generate core files
ulimit -c 0

# default text editor
export EDITOR="vim"

# default screen pager
export PAGER="less"
export LESS="FXMegQdRS"   # default options I like for less (R needed for color)
[ -x `type -P lesspipe` ] && eval "$(lesspipe)"

# path related
# initial sensible set
PATH="/sbin:/bin:usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin"
MANPATH="/usr/man:/usr/local/man:/usr/share/man"
LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/lib64:/usr/lib:/usr/local/lib64:/usr/local/lib"
# X related
PATH="$PATH:/usr/X11/bin"
MANPATH="$MANPATH:/usr/X11/man"
LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/X11/lib64:/usr/X11/lib"
# Personal stuff gets the highest precedence
PATH="$HOME/sbin:$HOME/bin:$PATH"
MANPATH="$HOME/man:$MANPATH"
LD_LIBRARY_PATH="$HOME/lib64:$HOME/lib:$LD_LIBRARY_PATH"
PKG_CONFIG_PATH="$HOME/lib/pkgconfig:$PKG_CONFIG_PATH"
CPPFLAGS="-I $HOME/include $CPPFLAGS"
export PATH
export MANPATH
export LD_LIBRARY_PATH
export PKG_CONFIG_PATH
export CPPFLAGS
