// Phoenix OSX Window Manager Config
// See: <https://github.com/sdegutis/Phoenix>
// adapted from: https://github.com/NsLib/phoenix-conf


var mNone = [],
  mCmd = ['cmd'],
  mAlt = ['alt'],
  mShift = ['shift'],
  mShiftCmd = ['shift', 'cmd'],
  mShiftAlt = ['shift', 'alt'],
  nudgePixels = 10,
  padding = 0,
  previousSizes = {};

var APPNAMES = {
  Term: 'Terminal',
  FileManager: 'Finder',
  Browser: 'Google Chrome',
  TextEditor: 'MacVim',
  Preview: 'Preview',
  Chat: 'Slack',
};

var LAYOUTS = {
  left: [0, 0, 0.5, 1],
  right: [0.5, 0, 0.5, 1],
  full: [0, 0, 1, 1],

  left4: [0, 0, 0.33, 1],
  left6: [0, 0, 0.5, 1],
  left8: [0, 0, 0.66, 1],
  right4: [0.66, 0, 0.33, 1],
  right6: [0.5, 0, 0.5, 1],
  right8: [0.33, 0, 0.66, 1],
};

// Remember hotkey bindings.
var keys = [];
function bind(key, mods, callback, always) {
  var binding = api.bind(key, mods, callback);
  if (!always) {
    keys.push(binding);
  }
}

// ############################################################################
// Helpers
// ############################################################################

// Cycle args for the function, if called repeatedly
// cycleCalls(fn, [ [args1...], [args2...], ... ])
var lastCall = null;
function cycleCalls(fn, argsList) {
  var argIndex = 0, identifier = {};
  return function () {
  if (lastCall !== identifier || ++argIndex >= argsList.length) {
    argIndex = 0;
  }
  lastCall = identifier;
  fn.apply(this, argsList[argIndex]);
  };
}

function bindMulti(keyBindingsList, callback) {
  keyBindingsList.forEach(function(item) {
    if (item.length !== 2) {
      api.alert(item, 0.5);
    }
    bind(item[0], item[1], callback);
  });
}

// Disables all remembered keys.
function disableKeys(notShowTips) {
  active = false;
  _(keys).each(function(key) {
    key.disable();
  });
  if (!notShowTips) {
    api.alert("keys off", 0.5);
  }
}

// Enables all remembered keys.
function enableKeys() {
  active = true;
  _(keys).each(function(key) {
    key.enable();
  });
  api.alert("keys on", 0.5);
}

function switchToApp(key, mods, title) {
  var _switchToApp = function() {
    App.focusOrStart(title);

    disableKeys(true);
  };

  bind(key, mods, _switchToApp);
  bind(key, mAlt, _switchToApp, true);
}

function getScreenIndex(win) {
  var idx = 0;
  var s = win.screen();
  while (!!s.previousScreen()) {
    idx += 1;
    s = s.previousScreen();
  }
  return idx;
}

function setLayout(keyBindingsList, appLayoutList) {
  var _setLayout = function() {
    appLayoutList.forEach(function(item) {
      var apps = App.allWithTitle(item[0]);

      if (_.isEmpty(apps)) {
        return;
      }

      var grid = item[1];
      var screen_idx = item[2];

      var windows = _.chain(apps)
        .map(function(x) { return x.allWindows(); })
        .flatten()
        .value();

      if (_.isEmpty(windows)) {
        return;
      }

      var activeWindows = _(windows).reject(function(win) { return win.isWindowMinimized();});

      if (_.isEmpty(activeWindows)) {
        return;
      }

      activeWindows.forEach(function(win) {
        if (!!win.screen()) {
          // if (screen_idx != getScreenIndex(win)) {
          //  api.alert("need to change window here", 0.5);
          //}
          windowToGrid(win, grid[0], grid[1], grid[2], grid[3], true);
        }
      });
    });
  };

  keyBindingsList.forEach(function(item) {
    if (item.length !== 2) {
      api.alert(item, 0.5);
    }
    bind(item[0], item[1], _setLayout, true);
  });

  disableKeys(true);
}
// ### Helper methods `Window`
//
// #### Window#toGrid()
//
// This method can be used to push a window to a certain position and size on
// the screen by using four floats instead of pixel sizes.  Examples:
//
//     // Window position: top-left; width: 25%, height: 50%
//     someWindow.toGrid( 0, 0, 0.25, 0.5 );
//
//     // Window position: 30% top, 20% left; width: 50%, height: 35%
//     someWindow.toGrid( 0.3, 0.2, 0.5, 0.35 );
//
// The window will be automatically focussed.  Returns the window instance.
function windowToGrid(window, x, y, width, height, dontFocusWindow) {
  var screen = window.screen().frameWithoutDockOrMenu();

  window.setFrame({
    x: Math.round( x * screen.width ) + padding + screen.x,
    y: Math.round( y * screen.height ) + padding + screen.y,
    width: Math.round( width * screen.width ) - ( 2 * padding ),
    height: Math.round( height * screen.height ) - ( 2 * padding )
  });

  if (!dontFocusWindow) {
    window.focusWindow();
  }

  return window;
}

function toGrid(x, y, width, height) {
  windowToGrid(Window.focusedWindow(), x, y, width, height);
}

Window.prototype.toGrid = function(x, y, width, height) {
  windowToGrid(this, x, y, width, height);
};

// Convenience method, doing exactly what it says.  Returns the window
// instance.
Window.prototype.toFullScreen = function() {
  return this.toGrid( 0, 0, 1, 1 );
};


// Convenience method, pushing the window to the top half of the screen.
// Returns the window instance.
Window.prototype.toN = function() {
  return this.toGrid( 0, 0, 1, 0.5 );
};

// Convenience method, pushing the window to the right half of the screen.
// Returns the window instance.
Window.prototype.toE = function() {
  return this.toGrid( 0.5, 0, 0.5, 1 );
};

// Convenience method, pushing the window to the bottom half of the screen.
// Returns the window instance.
Window.prototype.toS = function() {
  return this.toGrid( 0, 0.5, 1, 0.5 );
};

// Convenience method, pushing the window to the left half of the screen.
// Returns the window instance.
Window.prototype.toW = function() {
  return this.toGrid( 0, 0, 0.5, 1 );
};


// Stores the window position and size, then makes the window full screen.
// Should the window be full screen already, its original position and size
// is restored.  Returns the window instance.
Window.prototype.toggleFullscreen = function() {
  if ( previousSizes[ this ] ) {
  this.setFrame( previousSizes[ this ] );
  delete previousSizes[ this ];
  }
  else {
  previousSizes[ this ] = this.frame();
  this.toFullScreen();
  }

  return this;
};

// Move the currently focussed window left by [`nudgePixel`] pixels.
Window.prototype.nudgeLeft = function( factor ) {
  var win = this,
  frame = win.frame(),
  pixels = nudgePixels * ( factor || 1 );

  if (frame.x >= pixels) {
  frame.x -= pixels;
  } else {
  frame.x = 0;
  }
  win.setFrame( frame );
};

// Move the currently focussed window right by [`nudgePixel`] pixels.
Window.prototype.nudgeRight = function( factor ) {
  var win = this,
  frame = win.frame(),
  maxLeft = win.screen().frameIncludingDockAndMenu().width - frame.width,
  pixels = nudgePixels * ( factor || 1 );

  if (frame.x < maxLeft - pixels) {
  frame.x += pixels;
  } else {
  frame.x = maxLeft;
  }
  win.setFrame( frame );
};

// Move the currently focussed window left by [`nudgePixel`] pixels.
Window.prototype.nudgeUp = function( factor ) {
  var win = this,
  frame = win.frame(),
  pixels = nudgePixels * ( factor || 1 );

  if (frame.y >= pixels) {
  frame.y -= pixels;
  } else {
  frame.y = 0;
  }
  win.setFrame( frame );
};

// Move the currently focussed window right by [`nudgePixel`] pixels.
Window.prototype.nudgeDown = function( factor ) {
  var win = this,
  frame = win.frame(),
  maxTop = win.screen().frameIncludingDockAndMenu().height - frame.height,
  pixels = nudgePixels * ( factor || 1 );

  if (frame.y < maxTop - pixels) {
  frame.y += pixels;
  } else {
  frame.y = maxTop;
  }
  win.setFrame( frame );
};

// #### Functions for growing / shrinking the focussed window.

Window.prototype.growWidth = function() {
  this.nudgeLeft(3);

  var win = this,
  frame = win.frame(),
  screenFrame = win.screen().frameIncludingDockAndMenu(),
  pixels = nudgePixels * 6;

  if (frame.width < screenFrame.width - pixels) {
  frame.width += pixels;
  } else {
  frame.width = screenFrame.width;
  }

  win.setFrame(frame);
};

Window.prototype.growHeight = function() {
  this.nudgeUp(3);

  var win = this,
  frame = win.frame(),
  screenFrame = win.screen().frameIncludingDockAndMenu(),
  pixels = nudgePixels * 6;

  if (frame.height < screenFrame.height - pixels) {
  frame.height += pixels;
  } else {
  frame.height = screenFrame.height;
  }

  win.setFrame(frame);
};

Window.prototype.shrinkWidth = function() {
  var win = this,
  frame = win.frame(),
  screenFrame = win.screen().frameIncludingDockAndMenu(),
  pixels = nudgePixels * 6;

  if (frame.width >= pixels * 2) {
  frame.width -= pixels;
  } else {
  frame.width = pixels;
  }

  win.setFrame(frame);

  this.nudgeRight(3);
};

Window.prototype.shrinkHeight = function() {
  var win = this,
  frame = win.frame(),
  screenFrame = win.screen().frameWithoutDockOrMenu(),
  pixels = nudgePixels * 6;

  if (frame.height >= pixels * 2) {
  frame.height -= pixels;
  } else {
  frame.height = pixels;
  }

  win.setFrame(frame);

  this.nudgeDown(3);
};

// ### Helper methods `App`
//
// Finds the window with a certain title.  Expects a string, returns a window
// instance or `undefined`.  If there are several windows with the same title,
// the first found instance is returned.
App.findByTitle = function( title ) {
  return _( this.runningApps() ).find( function( app ) {
  if ( app.title() === title ) {
    app.show();
    return true;
  }
  });
};


// Finds the window whose title matches a regex pattern.  Expects a string
// (the pattern), returns a window instance or `undefined`.  If there are
// several matching windows, the first found instance is returned.
App.prototype.findWindowMatchingTitle = function( title ) {
  var regexp = new RegExp( title );

  return _( this.visibleWindows() ).find( function( win ) {
  return regexp.test( win.title() );
  });
};


// Finds the window whose title doesn't match a regex pattern.  Expects a
// string (the pattern), returns a window instance or `undefined`.  If there
// are several matching windows, the first found instance is returned.
App.prototype.findWindowNotMatchingTitle = function( title ) {
  var regexp = new RegExp( title );

  return _( this.visibleWindows() ).find( function( win ) {
  return !regexp.test( win.title() );
  });
};


// Returns the first visible window of the app or `undefined`.
App.prototype.firstWindow = function() {
  return this.visibleWindows()[ 0 ];
};

// Start/select apps
App.allWithTitle = function( title ) {
  return _(this.runningApps()).filter( function( app ) {
    if (app.title() === title) {
      return true;
    }
  });
};

App.focusOrStart = function ( title ) {
  var apps = App.allWithTitle( title );
  if (_.isEmpty(apps)) {
    api.alert("启动" + title);
    api.launch(title);
    return;
  }

  var windows = _.chain(apps)
    .map(function(x) { return x.allWindows(); })
    .flatten()
    .value();

  activeWindows = _(windows).reject(function(win) { return win.isWindowMinimized();});
  if (_.isEmpty(activeWindows)) {
    return;
  }

  activeWindows.forEach(function(win) {
    win.focusWindow();
  });
};

// ############################################################################
// Modal activation
// ############################################################################

// Modal activator
// This hotkey enables/disables all other hotkeys.
var active = false;
api.bind('a', mShiftCmd, function() {
  if (!active) {
    enableKeys();
  } else {
    disableKeys();
  }
});
api.bind('a', mShiftAlt, function() {
  if (!active) {
    enableKeys();
  } else {
    disableKeys();
  }
});

// These keys end Phoenix mode.
bind('escape', [], function() {
  disableKeys();
});
bind('return', [], function() {
  disableKeys();
});

// ############################################################################
// Bindings
// ############################################################################

// ### General key configurations
//
// Space toggles the focussed between full screen and its initial size and position.
bind( 'space', mNone, function() {
  Window.focusedWindow().toggleFullscreen();
  disableKeys();
});

// The cursor keys together with cmd make any window occupy any
// half of the screen.
bindMulti([
  ['right', mCmd],
  ['l', mCmd],
], cycleCalls(
  toGrid,
  [
    [0.5, 0, 0.5, 1], 
    [0.75, 0, 0.25, 1]
  ]
));

bindMulti([
  ['left', mCmd],
  ['h', mCmd],
], cycleCalls(
  toGrid,
  [
    [0, 0, 0.5, 1],
    [0, 0, 0.25, 1]
  ]
));

bindMulti([
  ['down', mCmd],
  ['j', mCmd],
], function() {
  Window.focusedWindow().toGrid(0, 0.7, 1, 0.3);
});

bindMulti([
  ['up', mCmd],
  ['k', mCmd],
], function() {
  Window.focusedWindow().toGrid(0, 0, 1, 0.3);
});

var changeLayout = function(x, y, width, height) {
  return function() {
    Window.focusedWindow().toGrid(x, y, width, height);
    disableKeys();
  };
};

bind('`', mShiftCmd, function() {
  Window.focusedWindow().toggleFullscreen();
  disableKeys();
}, true);
bind('1', mShiftCmd, changeLayout(0, 0, 0.5, 1), true);
bind('2', mShiftCmd, changeLayout(0.5, 0, 0.5, 1), true);
bind('3', mShiftCmd, changeLayout(0, 0, 0.5, 0.5), true);
bind('4', mShiftCmd, changeLayout(0, 0.5, 0.5, 0.5), true);
bind('5', mShiftCmd, changeLayout(0.5, 0, 0.5, 0.5), true);
bind('6', mShiftCmd, changeLayout(0.5, 0.5, 0.5, 0.5), true);

// The cursor keys move the focussed window.
// hjkl / ← ↑ → ↓
bindMulti([
  ['up', mNone], 
  ['k', mNone],
], function() {
  Window.focusedWindow().nudgeUp( 5 );
});

bindMulti([
  ['down', mNone], 
  ['j', mNone],
], function() {
  Window.focusedWindow().nudgeDown( 5 );
});

bindMulti([
  ['left', mNone], 
  ['h', mNone],
], function() {
  Window.focusedWindow().nudgeLeft( 5 );
});

bindMulti([
  ['right', mNone], 
  ['l', mNone],
], function() {
  Window.focusedWindow().nudgeRight( 5 );
});

// <SHIFT> + cursor keys grows/shrinks the focussed window.
bindMulti([
  ['right', mShift],
  ['l', mShift],
], function() {
  Window.focusedWindow().growWidth();
});

bindMulti([
  ['left', mShift],
  ['h', mShift],
], function() {
  Window.focusedWindow().shrinkWidth();
});

bindMulti([
  ['up', mShift],
  ['k', mShift],
], function() {
  Window.focusedWindow().shrinkHeight();
});

bindMulti([
  ['down', mShift],
  ['j', mShift],
], function() {
  Window.focusedWindow().growHeight();
});

// ############################################################################
// Bindings for specific apps
// ############################################################################

switchToApp('c', mNone, APPNAMES.Browser);
switchToApp('f', mNone, APPNAMES.FileManager);
switchToApp('t', mNone, APPNAMES.Term);
switchToApp('v', mNone, APPNAMES.TextEditor);
switchToApp('s', mNone, APPNAMES.Chat);
switchToApp('m', mNone, APPNAMES.Mail);
switchToApp('p', mNone, APPNAMES.Preview);

// ############################################################################
// Bindings for layouts
// ############################################################################
// external monitor connected
setLayout([
  ['1', mShiftAlt],
], [
  [APPNAMES.Term, LAYOUTS.left, 0],
  [APPNAMES.Browser, LAYOUTS.right, 0],
  [APPNAMES.Chat, LAYOUTS.full, 1],
]);
// laptop only
setLayout([
  ['2', mShiftAlt],
], [
  [APPNAMES.Term, LAYOUTS.left, 0],
  [APPNAMES.Browser, LAYOUTS.right, 0],
  [APPNAMES.Chat, LAYOUTS.right4, 0],
]);

// ############################################################################
// Init
// ############################################################################

disableKeys();
