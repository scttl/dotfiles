# setup the display of the command prompt and window title

if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
    #we have color support, assume we want a color prompt
    color_prompt=yes
else
    color_prompt=
fi

if [ "$color_prompt" = yes ]; then
    #[light green user@host:light blue cwd]$
    PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$'
else
    #plain-vanilla [user@host:cwd]$
    PS1='[\u@\h:\w]$'
fi

case $TERM in 
xterm*|rxvt*)
    #xterm-like terminal, display user@host:cwd in title bar
    PS1="\[\033]0;\u@\h:\w\007\]$PS1"
    ;;
*)
    ;;
esac
        
export PS1
