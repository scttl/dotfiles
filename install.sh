#!/bin/bash

echo "Installing dotfiles..."
for name in *; do
    # ensure we don't copy items that aren't .files
    case "$name" in
        "install.sh"|"README")
            continue;;
    esac
    target="$HOME/.$name"
    # backup non-symlinks
    if [ -e "$target" -a ! -L "$target" ]; then
        backup="$target.`stat -c %y $target | cut -c 1-10`"
        echo "Backing up $target --> $backup"
        mv "$target" "$backup"
    fi
    # link to the repository version
    echo "Creating $target"
    ln -snfv "$PWD/$name" "$target"
done
echo

# extract encrypted local files
if [ -x `type -P bcrypt` ]; then
    echo "Decrypting local files..."
    for name in $PWD/bash/local/*.bfe; do
        while true; do
            read -p "Attempt to decrypt: `basename $name`?" yn
            case $yn in
                [Yy]* ) bcrypt -r $name; break;;
                [Nn]* ) break;;
                * ) echo "Please answer yes or no.";;
            esac
        done
    done
fi

# setup Vundle for vim plugin managment
if [ -x `type -P git` -a ! -d "${HOME}/.vim/bundle/vundle" ]; then
    echo "Cloning Vundle (vim plugin manager)..."
    git clone https://github.com/gmarik/vundle.git "${HOME}/.vim/bundle/vundle"
fi

# setup task client certs for syncing
read -p "Setup task syncing?" yn
case $yn in
  [Yy]* ) 
    for f in scottl.cert scottl.key ca.cert; do
      if [ -x `type -P scp` -a ! -f "${HOME}/.task/${f}.pem" ]; then
        echo "Copying task sync client ${f} (ensure ssh keys setup!)..."
        mkdir -p "${HOME}/.task"
        scp scottl@mini.sct.tl:/Users/scottl/.task/${f}.pem \
            "${HOME}/.task/${f}.pem"
        chmod 600 "${HOME}/.task/${f}.pem"
      fi
    done
    ;;
  [Nn]* ) ;;
  * ) echo "Please answer yes or no.";;
esac

# setup alternate gitconfig
read -p "Setup Nervana gitconfig?" yn
case $yn in
  [Yy]* )
    cp $PWD/bash/local/nrv_gitconfig $PWD/gitconfig
    ;;
  [Nn]* ) ;;
  * ) echo "Please answer yes or no.";;
esac
