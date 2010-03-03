# setup various shell options and bindings etc.

# command history.  Space is cheap so store everything
shopt -s histappend                 # append, don't overwrite the history file
export HISTFILESIZE=100000000       # num lines saved on file
export HISTSIZE=100000              # num lines in memory (per session)
export HISTCONTROL=ignoreboth       # don't save duplicates or space starts 
shopt -s cmdhist                    # attempt to save multi-line commands as 1

shopt -s progcomp                   # allow programmable completion
shopt -s checkwinsize               # update values of LINES and COLUMNS

set bell-style visible              # use visual bell if possible
set -o vi                           # do vi style command line editing

stty erase ^?                       # ensure backspace erases
