
/* ASSIGNMENT */
Coding "Homework"

Create a software prototype that presents a stream of haiku and conveys their experience.

Constraints:

1.Haiku are poems consisting of seventeen syllables broken into three lines. The first and last lines contain five syllables each; the middle line contains seven. https://en.wikipedia.org/wiki/Haiku

2.Please provide all source code and detail the steps needed to install and run the prototype on computers at IDEO (or provide installation/run scripts).  You can assume that the computers will have a package manager, such as Homebrew and can install needed 3rd party libraries, and that the reviewers will have some technical knowledge.  

3.I can provide a Dropbox location for you to place your source code or you can send using GitHub or some other version control system if you prefer, just let me know.

4.You can optionally send links to a working implementation of your prototype in addition to your source code.


/* HAIKU PROJECT OUTLINE */

- single haiku block
- block lines built
  - either go word-by-word and find a syllable combo that matches pattern
  - OR break all words in to syllable and type categories and mix/match as needed 
    - this allows for more combinations per source, less page calls and less loops through the text
      - loop through once and create an object for each word that contains atrributes for the text, syllables, and word type
      - create a series of pattern objects that contain acceptable word type combinations
      - select a word-type combo, find the words to fit, erase a line, insert new line via animation
- words drawn as paths
- updated at a given frequency
  - X! words swapped out based on their type
  - X! OR phrases swapped out
- when swapped out, word is first 'erased' by reversing the path draw
  - transition out is to "erase" from beginning to end. 

- documentation should show how conceptual choices led to technical choices

NOTES ON HAIKUS
---------------
The essence of haiku is "cutting" (kiru).[1] This is often represented by the juxtaposition of two images or ideas and a kireji ("cutting word") between them,[2] a kind of verbal punctuation mark which signals the moment of separation and colours the manner in which the juxtaposed elements are related.

A kireji, or cutting word, typically appears at the end of one of the verse's three phrases. A kireji fills a role somewhat analogous to a caesura in classical western poetry or to a volta in sonnets. Depending on which cutting word is chosen, and its position within the verse, it may briefly cut the stream of thought, suggesting a parallel between the preceding and following phrases, or it may provide a dignified ending, concluding the verse with a heightened sense of closure.

The fundamental aesthetic quality of both hokku and haiku is that it is internally sufficient, independent of context, and will bear consideration as a complete work. The kireji lends the verse structural support,[7] allowing it to stand as an independent poem.

n English, since kireji have no direct equivalent, poets sometimes use punctuation such as a dash or ellipsis, or an implied break to create a juxtaposition intended to prompt the reader to reflect on the relationship between the two parts.

Traditional haiku consist of 17 on (also known as morae though often loosely translated as "syllables"), in three phrases of 5, 7, and 5 on, respectively.

A kigo (seasonal reference), usually drawn from a saijiki, an extensive but defined list of such terms.

A haiku traditionally contains a kigo, a word or phrase that symbolizes or implies the season of the poem and which is drawn from a saijiki, an extensive but prescriptive list of such words. -- ! polticial seasons?

There is a common, although relatively recent, perception that the images juxtaposed must be directly observed everyday objects or occurrences. -- ! missed connections, car descriptions, want ads + political ads. 

SOURCES
- political advertisements
- craigslist
- Kigo lists
