# DinkyWiki

It's a tiny library that offers a couple features that allow the user to create a very simple Wiki without the need of a full fledged hosting server. Articles are defined on JavaScript with a special language formatting called `dinky`.

[Demo](https://htmlpreview.github.io/?https://raw.githubusercontent.com/italrr/DinkyWiki/master/index.html)

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
- Powerful layout functionability based on Flex Boxes
- Tables are possible but have to be built manually

## TODO:
- Fix routing when it's being delivered through Github
- Proper table support
- SVG support
- Graph support
- Improve search functionality
- Documentation

## Quick Rundown
DinkyWiki's language is based on the usage brackets ([]) to organize the content. A single Bracket is a called a block, and it automatically uses the entire line that breaks down to the next line when there's an overflow. 
So, ideally, each parragraph should go in brackets.

### Styling Tokens
Styling is achieved through `Styling Tokens`. For example `!b BOLD TEXT` will render a bolded text that takes the entire line. If you wanted this text centerd, you can `!b !ct CENTERED BOLD TEXT`.

Styling Tokens can receive parameters through the following syntax `!<TOKEN>=<VALUE>`. For example: `!m=2 TEXT` will add 2 units of horizontal margin to `TEXT`. Not all tokens can receive parameters.

Some Tokens:
- `!b`: Bold
- `!i`: Italics
- `!ul`: Underline
- `!c=<COLOR>`: It colors the text within this block. `<COLOR>` has to be hexadecimal, or a typical CSS key color. See more [here](https://www.unm.edu/~tbeach/IT145/color.html)
- `!bc=<COLOR>`: It colors this block's background color. It follows the same format as `!c`.
- `!tn=<SIZE>`: Changes the block text size in the amount of units by `<SIZE>`.

Tricky Tokens:
- `!f`: It tells the block to automatically occupy a certain amount of empty space within the block. For example: `[!f][HELLO][!f]` will have `HELLO` perfectly centered.
- `!v`: It lays the items within this block on a vertical matter, essentially breaking the "one block, one line" convention. This token can be tricky at the beginning, but it does follow a logic can be learned quickly.

All tokens will be properly documented.

### Helpers/Actuators
Helpers are tools defined within the library that facilitate adding certain types of content. Such as images or video. They follow the next syntax `%<HELPER> PARAMETER:VALUE%`. They act more like inline commands.

Some Helpers:
- `%title ...%` and `%subtitle%`: They both define a special type heading that also helps DW organize articles with the Table of Contents and Search. Params: `label:'VALUE'`.
- `%img ...%`: It allows showing an image inline. Params `src:<IMAGE_URL>`.
- `%video ...%`: It allows showing a video inline. Params `src:<IMAGE_URL>`.
- `%card-video ...%` and `%card-img ...%`: Both work similar to `%img ...%` and `%video ...%`, but adds a label and frame to the content.
- `%link ..%`: It allows linking other articles. Params: `label:'<LABEL>' link:'<LINK_OR_ID>'`

## Example of an article:
```
dinkywiki.registerArticle("Bear Story", `

        %title label:'Bear Story'%
        [!tn=1.5 !s=2 !j
            [!m=1
                [!s=2 Bartholomew the bear loved his routine. Every morning, the sun would peek over the mountain, and Bartholomew would lumber down to the crystal-clear stream. The water would be alive with something even more exciting than the sunrise - salmon!]
                [!s=2 These fish were Bartholomew's favorite. He'd stand on his hind legs, dip a giant paw in the water, and scoop up a slippery fish. He'd gobble it down with a happy chomp, the pink flesh a delicious treat. "Another perfect breakfast," he'd declare, his belly full and heart content.]
                [!s=2 One day, as Bartholomew went fishing his usual way, a tiny trout poked its head out from behind a rock. "Excuse me, Mr. Bear," it squeaked. "Why do you only eat salmon?"]
                [!s=2 Bartholomew paused, a fish halfway to his mouth. "Well, little trout," he boomed, "salmon is the best! They're big, they're tasty, and there's always plenty in the stream."]
                [!s=2 The trout wiggled closer. "But the stream has so much more! There are juicy berries hidden by the bushes, crunchy nuts on the forest floor, and sweet honey hidden in the trees."]
                [!s=2 Bartholomew's eyes widened. He'd never considered anything besides his beloved salmon routine. The little trout was right, the forest was full of possibilities!]
                [!s=2 The next morning, Bartholomew set out for his breakfast with a curious heart. He followed the trout's advice, munching on a handful of plump blueberries before reaching the stream. To his surprise, the salmon still tasted delicious, but the berries added a sweet, tangy burst of flavor.]
                [!s=2 As the days went by, Bartholomew explored the forest feast. He cracked open hazelnuts with his strong teeth, the sweet crunch a delightful change. He even discovered a beehive (from a safe distance!), enjoying the golden honey dripping on his fur.]
                [!s=2 Bartholomew never gave up his love for salmon, but now, his meals were an exciting adventure. He learned that a varied diet kept him strong and healthy, and every day brought a new delicious surprise. From then on, Bartholomew the bear, with a happy belly and a curious spirit, continued to explore the wonderful flavors his forest home had to offer.]
            ]
            [!s=2 [%card-img title:'Bear' width:'20' src:articles/img/bear.png%]]
        ]

    `,
    [
        "bear"
    ],
    "home",
    "bear"
);
```

# Screenshots
![Alt text](/img/article_table_of_contents.png?raw=true "Standalone")
![Alt text](/img/search.png?raw=true "Standalone")
![Alt text](/img/simple_article.png?raw=true "Standalone")
![Alt text](/img/style_examples.png?raw=true "Standalone")
![Alt text](/img/children_articles.png?raw=true "Standalone")