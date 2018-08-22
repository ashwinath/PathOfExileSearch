# POE Search 
[![Build Status](https://travis-ci.org/ashwinath/poe-search-discord.svg?branch=master)](https://travis-ci.org/ashwinath/poe-search-discord)

## Intentions

Search for keywords throughout the item database. Anything you wanna search for. Name it and ye shall receive. It should also be able to search fast. Local development takes about 5ms ish per character typed. On my resourced starved cloud server (1 core 2gb ram, a lot of it going into elasticsearch) it takes about 20ms which is still not bad!

## Motivations

Sometimes people forget what the name of the item is, but they might remeber certain properties of the item. Be it flavour text like "A merchant seeks to trade misfitting gifts. Five for one, but what is the one?". Pretty catchy eh? But not many people remember the prophecy that gives that. Type that in the search bar and the server is smart enough to know what you are looing for! Of course you dont need to type the full thing; Bits and pieces of it should be sufficient for the search to function.

## Examples of this search

* Minus spell damage -> Void battery (Correction to "Reduces spell damage")
* Has 0 sockets -> Kaom's Heart (Correction to "Has no sockets")
* Tary -> Autocompletes to Taryn's Shiver.
* Shocked enemies explode -> Inpulsa's Broken Heart (Correction to "Shocked Enemies you Kill Explode, dealing (5-10)% of their Maximum Life as Lightning Damage which cannot Shock")
* Today im wise -> Rumi's Concoction
* and much more!

## Other goodies (Mainly stuff from poe.ninja)

They show current prices, and how the price moved the past 7 days. A link to the POE wiki and poe.trade.

## Requirements

You need an instance of Elasticsearch running to run this.

## Acknowledgements

Thanks [exljbris Font Foundry](https://www.exljbris.com/fontin.html) for the fonts.

Thanks [PoeNinja](http://poe.ninja) for the API.

## License

The MIT License (MIT)

Copyright (c) 2018 Ashwin Nath Chatterji

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
