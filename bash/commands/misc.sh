# Miscellaneous additional commands and aliases

# coloring
if [ -x `type -P dircolors` ]; then
    eval "`dircolors -b`"
    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
fi
# shell color listing
function shell_colors {
    if [ $# = 0 ]; then
        T="tSt"
    else
        T="$*"
    fi
    echo -e "\n                 40m     41m     42m     43m\
     44m     45m     46m     47m";
    for FGs in '    m' '   1m' '  30m' '1;30m' '  31m' '1;31m' '  32m' \
               '1;32m' '  33m' '1;33m' '  34m' '1;34m' '  35m' '1;35m' \
               '  36m' '1;36m' '  37m' '1;37m';
        do FG=${FGs// /}
        echo -en " $FGs \033[$FG  $T  "
        for BG in 40m 41m 42m 43m 44m 45m 46m 47m;
            do echo -en "$EINS \033[$FG\033[$BG  $T  \033[0m";
        done
        echo;
    done
    echo
}

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
alias p3='python3'
alias web='python -m SimpleHTTPServer'

# taskwarrior related
alias t='task'
