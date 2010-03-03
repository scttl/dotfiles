# Miscellaneous additional commands and aliases

# coloring
if [ -x /usr/bin/dircolors ]; then
    eval "`dircolors -b`"
    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
fi

# directory listing
alias lt='ls -alhrt'
alias l='ls -alh'

# compress cd, ls -l command sequence
function cl {
    if [ $# = 0 ]; then
        cd && lt
    else
        cd "$*" && lt
    fi
}

# make directory path and cd into it
function mc {
    mkdir -p "$*" && cd "$*" && pwd
}

# python related
alias p='python'
