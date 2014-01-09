" use vim not vi
set nocompatible

" vundle prep
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" load plugins
Bundle 'gmarik/vundle'
Bundle 'wincent/Command-T'
Bundle 'hdima/python-syntax'
Bundle 'tpope/vim-fugitive'

" General behaviour and appearance
filetype plugin indent on " do file-type and language specific indenting etc.
set nobackup              " don't litter directories with backup files
set nowritebackup         " not even when saving (slows large file saves)
set vb                    " use visual bell
set ruler                 " display column position
set number                " show row numbers
set showcmd               " display incomplete commands
set incsearch             " do incremental searching
set showmatch             " show matching parens
set backspace=indent,eol,start " backspace over everything in insert mode
set textwidth=79          " wrap text and insert linebreaks after 79 chars
set tabstop=2             " tabs are displayed as 2 spaces
set softtabstop=2         " help editing too
set shiftwidth=2          " default to a 2 space indent
set expandtab             " convert tab keystroke into shiftwidth spaces
set history=50            " number of remembered command lines

" colour and term related
if &t_Co > 2
  set t_Co=256            " allow 256 color schemes (my term's all support it)
  syntax on               " do syntax highlighting
  set hlsearch            " highlight last search pattern
  colorscheme camo        " classic choice!
  " colorscheme zenburn     " muted colours
  " colorscheme wombat
  " colorscheme wombat256
  " colorscheme desert
  " colorscheme desert256
  " colorscheme anotherdark.vim
  " colorscheme adaryn.vim
endif

" custom mappings
let mapleader=","
"map gf :tabe <cfile><CR>   "open a filename under cursor.  Useful for wiki

" autocommands
if has("autocmd")
  autocmd BufRead,BufNewFile *.py set smartindent cinwords=if,elif,else,for,while,try,except,finally,def,class
endif

" spelling
if version >= 700
  set spelllang=en_us,en_ca
  "set spell     " enable it manually, since most of my work is code
endif

" miscellaneous
" set verbose=9           " useful for debugging
