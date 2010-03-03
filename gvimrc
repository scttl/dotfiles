" set the X11 font to use
" set guifont=Monaco:h15.00  "OSX
" set guifont=-misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-1
" set guifont=-misc-fixed-medium-r-semicondensed-*-*-120-*-*-c-*-iso8859-1

set guioptions=acgiM
set lines=55            " Make the window fairly long

set ch=2		" Make command line two lines high

set mousehide		" Hide the mouse when typing text

" Make shift-insert work like in Xterm
map <S-Insert> <MiddleMouse>
map! <S-Insert> <MiddleMouse>

" I like highlighting strings inside C comments
let c_comment_strings=1

" Switch on syntax highlighting if it wasn't on yet.
if !exists("syntax_on")
  syntax on
endif

" Switch on search pattern highlighting.
set hlsearch

" Set nice colors
colorscheme camo
