CHANGELOG
=========

Version 0.3.4 - Alpha
---------------------
-   Info: Official support for IE >= 9 starts now :(
-   Add: New `clone()` helper function as Fallback for IE >= 9.
-   Add: New `.IE` helper variable for Fallback use for IE >= 9.
-   Bugfix: Almost complete IE >= 9 support.

Version 0.3.3 - Alpha
---------------------
-   Add: A new internal translate / string function called `__()`.
-   Add: New `reload()` method, which calls `remove()` and re-inits the DateTime Calendar.
-   Update: Use `this` to call the main DateTime IIFE function.
-   Update: Update the selected date when the input field has been filled out manually.
-   BugFix: Fix Typo and wrong attribute name in `remove()` method.
-   BugFix: `Enter` / `Return` executes all events, even if just one field is in focus.
-   Removed: The `dateRange` fallback option has been removed, to clean the source up for the next major version.

Version 0.3.2 - Alpha
---------------------
-   Info: npmJS Version Fix.
-   Add: Spanish translation

Version 0.3.1 - Alpha
---------------------
-   BugFix: Position Absolute doesn't recalculate [#2](https://github.com/pytesNET/tail.DateTime/issues/2)
-   BugFix: Today on every Year! [#1](https://github.com/pytesNET/tail.DateTime/issues/1)

Version 0.3.0 - Alpha
---------------------
-   Info: Uses now some Vectors from GitHubs [Octicons](https://octicons.github.com/).
-   Add: A minified version, minified with [jsCompress](https://jscompress.com/).
-   Add: A new "white" design, used with `tail.datetime.white.css` (together with the main style sheet).
-   Add: A new `span` HTML element wraps each single day number.
-   Add: Events for `open`, `close` and `select` (used with `tail.DateTime::` prefix).
-   Add: New helper methos `trigger` to trigger tail.DateTime specific CustomEvents.
-   Add: New Option `static`, which allows a selector or an element as wrapper for a static view.
-   Add: New option `classNames`, which adds additional class names to the DateTime container.
-   Add: New option `startOpen`, which opens the picker after init.
-   Add: New option `stayOpen`, which disables some auto-closing events.
-   Add: New option `zeroSeconds`, which sets the seconds to 0 on init.
-   Add: New method `remove()` to remove the DateTime Picker.
-   Add: Current selected date class name and color.
-   Add: A colon between hours, minutes and seconds (That was really important!).
-   Add: The language strings für `de` (German) and `de_AT` (Austrian German)
-   Update: The SVG arrows on the default theme has been changed into angle images (Octicon).
-   Update: All SVG images has been changed into the Octicon vector graphics.
-   Update: The constructor allows now `NodeList`s and `HTMLCollection`s and uses `querySelectorAll` on strings.
-   Update: Renamed any `data-fox-*` attribute names into `data-tail-*`.
-   Update: The internal `element` input variable has renamed into `e`.
-   Update: The internal `calendar` DateTime Picker variable has renamed into `dt`.
-   Update: The internal `options` configuration variable has renamed into `con`.
-   Update: The internal `view` / `current` variables has been merged under `view`.
-   Update: The internal `select` variable holds the last (current) selected Date and Time as Date object.
-   Update: The option `dateRange` has renamed into `dateRanges` and allows multiple arrays with Date Objects, Date Values (YYYY-mm-dd) and Week-Day names.
-   BugFix: Current Date object has been shared between each prototype instance.

Version 0.2.0 - Alpha
---------------------
-   Info: Project has been renamed to `tail.DateTime` and adapted to the tail implementation.

Version 0.1.2 - Alpha
---------------------
-   Add: Use the `data-fox-value` attribute for pre-defined dates, before trying to parse the input value.
-   Add: Helper Methods `Fox.hasClass`, `Fox.addClass`, `Fox.removeClass`.
-   Add: Calendar Class Names `calendar-close`, `calendar-idle`, `calendar-open`.
-   Update: Changed '\&lsaquo;' and '\&rsaquo;' into SVG background images.
-   Update: Stores now a (current) Date Object instead of the year / month number.
-   Update: Some minimalistic style and script changes.
-   BugFix: Double Use of the `data-fox-calendar` attribute.
-   BugFix: Calendar closes after selecting a month.
-   BugFix: The `switchYear()` method doesn't supported a year argument.

Version 0.1.1 - Alpha
---------------------
-   Update: Change Calendar Counter Calculation (CCCC)
-   Update: Return `this` on the public methods

Version 0.1.0 - Alpha
---------------------
-   Initial Release (Fork of Pure JS Calendar](https://github.com/MrGuiseppe/pureJSCalendar))
