# commands run for non-login shells

# environment variables are always sourced
source "${HOME}/.bash/variables.sh"

[ -z "$PS1" ] && return  # don't do anything else if non-interactive shell

# shell behavior related
source "${HOME}/.bash/shell.sh"

# setup the display of the prompt
source "${HOME}/.bash/prompt.sh"

# shell completion
for file in "${HOME}/.bash/completion/*"; do
    source $file
done

# new commands (aliases)
for file in "${HOME}/.bash/commands/*"; do
    source $file
done
