tail.DateTime
=============
[![npm](https://img.shields.io/npm/v/tail.datetime.svg?style=flat-square)](https://www.npmjs.com/package/tail.datetime)
[![npm](https://img.shields.io/npm/dt/tail.datetime.svg?style=flat-square)](https://www.npmjs.com/package/tail.datetime)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Author](https://img.shields.io/badge/Author-SamBrishes@pytesNET-lightgrey.svg?style=flat-square)](https://www.github.com/pytesNET)

**The tail.DateTime script is a fork of the [Pure JS Calendar](https://github.com/MrGuiseppe/pureJSCalendar), written by [MrGuiseppe](https://github.com/MrGuiseppe).** It is specially designed for the new, yet unpublished, backend theme for the FoxCMS. The tail.DateTime script offers the following changes compared to the Pure JS Calendar:

-   A Time Picker (Hours, Minutes, Seconds)
-   A Month-Based browse view
-   A slightly different date/time output format
-   A slightly different HTML class/id layout
-   A different JS structure / implementation / constructur (Prototyping)
-   Key Listener for 'Escape' (Close) and 'Enter' (Use Today / First Day of the month)
-   Auto-Close on click outside of the calendar popup / input element
-   Instance Caching + Calendar Caching with the first day in the week
-   Default value depending on the input field
-   "Translatable" Strings through the global variable
-   And many more... Check out the Changelog for details.

[Demonstration](https://github.pytes.net/tail.DateTime)

Work in Progress
----------------
The script is still **Work in Progress** and hasn't been tested much!

Thanks to [MrGuiseppe](https://github.com/MrGuiseppe) and to [Octicons](https://octicons.github.com/) for the Vector Graphics.

Options
-------
```javascript
    tail.DateTime(document.getElementById("my-input-field"), {
        static:         null,
        position:       "bottom",
        classNames:     "",
        dateFormat:     "YYYY-mm-dd",
        timeFormat:     "HH:ii:ss",
        dateRanges:     [],
        weekStart:      "SUN",
        startOpen:      false,
        stayOpen:       false,
        zeroSeconds:    false
    });
```

### static
`string`<br />
Pass an valid selector of an element where the Calendar Popup should be append to, leave it on
null to use the absolute position calculation.

### position
`string`<br />
Sets the position of the DateTime popup field to `"top"`, `"left"`, `"right"` or `"bottom"`. This
option **does not** work if you pass an valid selector on `static`!

### classNames
`string` or `array`<br />
Adds custom class names to the main DateTime container element, pass and array or an space-separated
list!

### dateFormat
`string` or `false`<br />
Pass an valid Date/Time Format (see below) or pass `false` to disable the Date picker.

### timeFormat
`string` or `false`<br />
Pass an valid Date/Time Format (see below) or pass `false` to disable the Time picker.

### dateRanges
`array`<br />
This option allows you to create one or more selectable periods of time. Each period defines itself
through an array, where the first value if the start-point and the last one the end-point (which is
also optional).  You can use a `Date` object as value, a string as `YYYY-MM-DD` or the (translated)
name of a weekday (See `tailDateTime.strings.shorts`).

#### Example:
The following Example limits the selectable area to:

-   From 2018-10-12 up to 2018-10-26
-   From 2018-11-04 up to 2018-11-30
-   From 2018-12-01 up to 2018-12-31
-   **In all cases only from Monday up to Friday** (Sunday and Saturday are not selectable)

The last array `["MON", "FRI"]` limits **only** all selections before! If you want to just use a
selection between Monday and Friday in general, add a third parameters with `true`.

```javascript
tail.DateTime("#datetime", {
    dateRanges: [
        [new Date(2018, 9, 12), new Date(2018, 9, 26)],
        ["2018-11-4", "2018-11-30"],
        [new Date(2018, 11, 1), new Date(2018, 11, 31)],
        ["MON", "FRI"]
    ]
});
```

### weekStart
`string`<br />
Pass the (translated) string of the global variable `tailDateTime.strings.shorts` to change the
shown first day in the week. (If no translation has been made, you can choose between: "SUN", "MON",
"TUE", "WED", "THU", "FRI" and "SAT")

### startOpen
`boolean`<br />
Use true to show the DateTime Picker directly after the initialization.

### stayOpen
`boolean`<br />
Use true to keep the DateTime Picker open, even if an selection has been made or any other closing
event has been triggered! (You can still close the DateTime Picker with the `close()` method!)

### zeroSeconds
`boolean`<br />
Use true to set the seconds to `00`. This would be happen once, during the initialization.

Date/Time Format
----------------
<table>
    <tr>
        <th>Code</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>H</th>
        <td>24-hour format of an hour, use `HH` for leading zeros!</td>
    </tr>
    <tr>
        <th>G</th>
        <td>12-hour format of an hour, use `GG` for leading zeros!</td>
    </tr>
    <tr>
        <th>A</th>
        <td>Uppercase Ante meridiem and Post meridiem (AM or PM).</td>
    </tr>
    <tr>
        <th>a</th>
        <td>Lowercase Ante meridiem and Post meridiem (am or om).</td>
    </tr>
    <tr>
        <th>i</th>
        <td>Minutes, use `ii` for leading zeros.</td>
    </tr>
    <tr>
        <th>s</th>
        <td>Seconds, use `ss` for leading zeros.</td>
    </tr>
    <tr>
        <th>Y</th>
        <td>A (4-digit) numeric representation of a year, used as `YY` or `YYYY`.</td>
    </tr>
    <tr>
        <th>y</th>
        <td>A (2-digit) numeric representation of a year, used as `yy`.</td>
    </tr>
    <tr>
        <th>m</th>
        <td>Numeric representation of a month, use `mm` for leading zeros.</td>
    </tr>
    <tr>
        <th>M</th>
        <td>A short textual representation of a month, three letters.</td>
    </tr>
    <tr>
        <th>F</th>
        <td>A full textual representation of a month, such as March.</td>
    </tr>
    <tr>
        <th>d</th>
        <td>Day of the month, use `dd` for leading zeros.</td>
    </tr>
    <tr>
        <th>D</th>
        <td>A textual representation of a day, three letters.</td>
    </tr>
    <tr>
        <th>l</th>
        <td>(Lower `L`) A full textual representation of the day of the week.</td>
    </tr>
</table>

Methods
-------
```
    var calendar = tail.DateTime(document.getElementById("my-input-field"));
    calendar.<method>();
```

### on(event, callback)
This method hooks an event with an respective callback function to the DateTime object. Available
Events:

-   `tail.DateTime::open`, when the DateTime Picker opens.
-   `tail.DateTime::close`, when the DateTime Picker closes.
-   `tail.DateTime::select`, the a selection has been made.

### open()
This method opens the calendar popup, if it isn't already open!

### close()
This method closes the calendar popup, if it is still open!

### toggle()
This method toggles the open/close option of the calendar popup.

### remove()
This method removes the DateTime Picker elments and destroys the tail.DateTime picker instance.

### switchMonth(monthNum, year)
This method changes the shown month (monthNum starts with 0). You can also use "prev" or "next" to just browse forward and back.

### switchYear(year)
This method changes the year within the month view. You can also use "prev" or "next" to just browse forward and back.

### selectDate(Y, M, D, H, i, s)
Select a date with year, month, day, hours, minutes and seconds.

### selectTime(H, i, s)
Select a time (alias for `selectDate`) with hours, minutes and seconds.
