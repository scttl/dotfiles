# commands/aliases related to SSH

#make use of ssh-agent so we don't have to enter keyphrases every time
#we ssh in the same session
SSH_ENV="$HOME/.ssh/${HOSTNAME}.environment"

function start_agent {
    echo "Initializing new SSH agent..."
    /usr/bin/ssh-agent | sed 's/^echo/#echo/' > "${SSH_ENV}"
    echo succeeded
    chmod 600 "${SSH_ENV}"
    . "${SSH_ENV}" > /dev/null
    /usr/bin/ssh-add;
}

function fix_ssh {
    eval $(tmux show-env \
        | sed -n 's/^\(SSH_[^=]*\)=\(.*\)/export \1="\2"/p')
}

if [ -f "${SSH_ENV}" ]; then
    . "${SSH_ENV}" > /dev/null
    ps -ef | grep ${SSH_AGENT_PID} | grep ssh-agent$ > /dev/null || {
        start_agent;
    }
else
    start_agent;
fi
