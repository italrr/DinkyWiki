# DinkyWiky

It's a tiny library that offers a couple features that allow the user to create a very simple Wiki without the need of a full fledged hosting server. Articles are defined on JavaScript with a special language formatting called `dinky`.

[Demo](https://htmlpreview.github.io/?https://raw.githubusercontent.com/italrr/DinkyWiky/master/index.html)

## Features
- All functionality is client side. Only requires the HTML + JS code to be delivered
- Can be hosted Git services that allow HTML preview
- Wide range of text formatting (font size, text color, justify, bold, etc.)
- Support for images
- Support for video
- Search Feature
- Article tags/keywords that make search easier
- Article linking
- Article Hierarchy, for better organization
- Powerful layout functionability based in Flex Boxes
- Tables are possible but have to be built manually

## TODO:
- Proper interface for tables
- SVG support
- Graph support
- Improved search functionality
- Documentation

## Quick Run-down
DinkyWiky's language is based on the usage brackets ([]) to organize the content. A single Bracket is a called a block, and it automatically uses the entire line that breaks down to the next line when there's an overflow. 
So, ideally, each parragraph should go in brackets.

### Styling Tokens
Styling is achieved through `Styling Tokens`. For example `!b BOLD TEXT` will render a bolded text that takes the entire line. If you wanted this text centerd, you can `!b !ct CENTERED BOLD TEXT`.

Styling Tokens can receive parameters through the following syntax `!<TOKEN>=<VALUE>`. For example: `!m=2 TEXT` will add 2 units of horizontal margin to `TEXT`. Not all tokens can receive parameters.

Some Tokens:
- `!b`: Bold
- `!i`: Italics
- `!i`: Italics
- `!c=<COLOR>`: It colors the text within this block. `<COLOR>` has to be hexadecimal, or a typical CSS key color. See more [here](https://www.unm.edu/~tbeach/IT145/color.html)
- `!bc=<COLOR>`: It colors this block's background color. It follows the same format as `!c`.
- `!tn=<SIZE>`: Changes the block text size in the amount of units by `<SIZE>`.

Tricky Tokens:
- `!f`: It tells the block to automatically occupy a certain amount of empty space within the block. For example: `[!f][HELLO][!f]` will have `HELLO` perfectly centered.
Another example: `[!f]`.
- `!v`: It lays the items within this block on a vertical matter, essentially breaking the "one block, one line" convention. This token can be tricky at the beginning, but it does follow a logic can be learned quickly.

All tokens will be properly documented.

### Helpers/Actuators
Helpers are tools defined within the library that facilitate adding certain types of content. Such as images or video. They follow the next syntax `%<HELPER> PARAMETER:VALUE%`. They act more like inline commands.

Some Helpers:
- `%title ...%` and `%subtitle%`: They both define a special type heading that also helps DinkyWiky organization articles with the Table of Contents and Search. Params: `label:'VALUE'`.
- `%img ...%`: It allows showing an image inline. Params `src:<IMAGE_URL>`.
- `%video ...%`: It allows showing a video inline. Params `src:<IMAGE_URL>`.
- `%card-video ...%` and `%card-img ...%`: Both work similar to `%img ...%` and `%video ...%`, but adds a label and frame to the content.
- `%link ..%`: It allows linking other articles. Params: `label:'<LABEL>' link:'<LINK_OR_ID>'`


# Screenshots
![Alt text](/img/article_table_of_contents.png?raw=true "Standalone")
![Alt text](/img/search.png?raw=true "Standalone")
![Alt text](/img/simple_article.png?raw=true "Standalone")
![Alt text](/img/style_examples.png?raw=true "Standalone")
![Alt text](/img/children_articles.png?raw=true "Standalone")