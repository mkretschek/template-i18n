# template-i18n

> **NOTE**: you may be interested in [`gulp-template-i18n`](https://github.com/mkretschek/gulp-template-i18n),
> a wrapper for `template-i18n` for `gulp`.

A tool for creating internationalized template strings.
It receives a template string containing i18n placeholders and replaces
them with the appropriate translated strings. E.g.:

> **IMPORTANT:** by default we use a doT template processor. But
> `template-i18n` also supports `ejs`, `underscore` and `lodash` templates,
> and also allows you to set a custom processor for other template
> engines. See [`options.processor`](#template-i18n-options-processor).

```html
<article>
  <h1>{{:i18n(title)}}: {{=it.title}}</h1>
  <p>{{:i18n(date)}}: {{=it.date}}</p>
</article>
```

Becomes the following doT template:

```html
<article>
  <h1>Title: {{=it.title}}</h1>
  <p>Date: {{=it.date}}</p>
</article>
```

Which you may then save as `template.en.dot` or just compile it to
an already internationalized template function.


## Usage

```bash
npm install --save template-i18n
```

Then, for translating a single string:

```js
var i18n = require('template-i18n');

var template = '<div>{{:i18n(foo)}}</div>';

var translated = i18n(template, '/path/to/strings.json');
// => <div>Translated Foo</div>
```

For multiple strings, use a processor instead. This avoids reloading
the strings file everytime:

```js
var i18n = require('template-i18n');
var processor = i18n.getProcessor('/path/to/strings.json');
var translated1 = processor.translate(template1);
var translated2 = processor.translate(template2);
```


### Multiple locales

When internationalizing you probably need to handle more than one
locale. As you've probably noticed, a `processor` is bound to a specific
locale, meaning you must create one processor for every locale:

```js
var i18n = require('template-i18n');

var locales = ['en', 'de', 'pt'];

var processor = {};

locales.forEach(function (locale) {
  processor[locale] = i18n.getProcessor('/path/to/strings/' + locale + '.json');
});

var translatedEN = processor.en.translate(template);
var translatedDE = processor.de.translate(template);
var translatedPT = processor.pt.translate(template);
```


### I18n placeholders

I18n strings in templates are replaced with an i18n placeholder.

```
{{:i18n(string.id, data):}}
```

Where `string.id` is the path to the string inside the JSON tree:

```json
{
    "foo": {
        "bar": "Foobar!"
    },
    "baz": "Foobarbaz?"
}
```

```
{{:i18n(foo.bar)}} // => "Foobar!"
{{:i18n(baz)}} // => "Foobarbaz?"
```

The `data` parameter is optional and defines an object that maps variables
to placeholders inside the translated string.

```json
{
    "greeting": "Hello, {name}!"
}
```

Greets whoever is stored in `it.name`:

```
{{:i18n(greeting, {name: 'it.name'})}}
// => Hello, {{=it.name}}!
```

> **NOTE**: the `:` (collon) before the closing curling brackets `}}` is
> optional.
>
>     // This works fine
>     {{:i18n(string.id, data):}}
>
>     // So does this
>     {{:i18n(string.id, data)}}

You can change the placeholder format using [`options.pattern`](#template-i18n-options-pattern).

#### Placeholders in strings

Translation strings may contain placeholders which are in turn replaced
with a string interpolation tag for the selected template engine
(processor).

Let's assume the following string file:

```json
{
  "name": "My name is {name}",
  "today": "Today is {date}"
}
```

And the template:

```html
<div>
  <p>{{:i18n(name, {name: 'it.name'}:}}</p>
  <p>{{:i18n(date, {date: 'it.datetime'}:}}</p>
</div>
```

The result will be:

```html
<div>
  <p>My name is {{=it.name}}</p>
  <p>Today is {{=it.date}}</p>
</div>
```

Or, if you are using `ejs`:

```html
<div>
  <p>{{:i18n(name, {name: 'name'}:}}</p>
  <p>{{:i18n(date, {date: 'datetime'}:}}</p>
</div>
```

Resulting in:

```html
<div>
  <p>My name is <%=name%></p>
  <p>Today is <%=date%></p>
</div>
```

#### Plurals

Pluralized rules are identified by passing the `n` parameter to the
i18n placeholder:

```js
{{:i18n(foo, {n: 'it.count'}):}}
// or simply
{{:i18n(foo, 'it.count'):}}
```

In your string files, the `_plural` string is considered special
because it's where we'll look for plural rules for the locale:

```json
{
    "_plural": {
        "1": "{n} == 1"
        "few": "{n} < 5"
    },

    "orange": {
        "1": "One orange",
        "few": "A few oranges",
        "else": "{n} oranges"
    },

    "grape": {
        "1": "A grape",
        "else": "{n} grapes"
    }
}
```

Template:

```html
<div>
    <p>{{:i18n(orange, {n: 'it.count'):}}</p>
</div>
```

Resulting in (line breaks added for improving readability):

```html
<div>
    <p>
        {{? it.count == 1}}One orange
        {{?? it.count < 5}}A few oranges
        {{??}}{{=it.count}} oranges
        {{?}}
    </p>
</div>
```

Notice the `else` case in the pluralized string object in the JSON file. It
defines the string to be used if none of the plural rules apply to the value in
the variable passed as `n`.

And also, all pluralization rules are optional. You could, for example, ignore
`few` rule:

```html
<div>
    <p>{{:i18n(grape, {n: 'it.count')}}</p>
</div>
```

Results in:
```html
<div>
    <p>
        {{? it.count == 1}}A grape
        {{??}}{{=it.count}} grapes
        {{?}}
    </p>
</div>
```