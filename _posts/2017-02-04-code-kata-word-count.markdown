---
layout: post
title: "Code Kata: Word Count"
date: 2017-02-04 18:00:00 +0700
category: code-kata
tags:
  - python
  - tdd
---
Today I decided to start my own [code kata](https://en.wikipedia.org/wiki/Kata_(programming)){:target="_blank"} and hopefully I can be consistent enough to keep it going.
To give a little context, code kata is way for programmer to practice their programming skill. Sometimes the same problem is done multiple times and the purpose is to find a better approach to solve the problem.
This is also a good way to learn new technology, programming language, or even new methodology.
This time I'm going to start slow by solving the **Word Count** problem and I'm going to write it in **python**.

Imagine that I have this sentences:

> Hello world! Today I'm going to learn new skill and that is programming.
> I don't know whether I'm going to make it or not, but I'll try as hard as possible.

What I want to do is **put the sentences into a program** and the program will produce this output:

{% highlight sh %}
going: 2
to: 2
as: 2
hello: 1
..... # and so on
{% endhighlight %}

### Let's Start

The first thing that I did was **writing the test**. Yes! I did it in [TDD (Test Driven Development)](https://en.wikipedia.org/wiki/Test-driven_development){:target="_blank"}.
Here's the first test that I needed to have:

{% highlight python %}
import unittest
from word_count import WordCount

class TestWordCount(unittest.TestCase):
    def test_count_words(self):
        sentences = "Hello world for hello world"
        expected_result = {
            'hello': 2,
            'world': 2,
            'for': 1
        }

        counter = WordCount(sentences)
        result = counter.count_words()
        assert len(result) == len(expected_result)
        assert result == expected_result
{% endhighlight %}

I saved it into a folder called `tests`. And later, the folder structure would be like this:

{% highlight sh %}
.
└── tests
    ├── __init__.py
    └── test_word_count.py
{% endhighlight %}

Next, I ran the test file with [nose](http://nose.readthedocs.io/en/latest/){:target="_blank"}. The full command to run the test is shown by this command:

{% highlight sh %}
nosetests --rednose tests/test_word_count.py
{% endhighlight %}

This was the result that I got:

{% highlight sh %}
E
======================================================================
1) ERROR: Failure: ImportError (No module named 'word_count')
----------------------------------------------------------------------
   Traceback (most recent call last):
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/site-packages/nose/failure.py line 39 in runTest
      raise self.exc_val.with_traceback(self.tb)
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/site-packages/nose/loader.py line 418 in loadTestsFromName
      addr.filename, addr.module)
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/site-packages/nose/importer.py line 47 in importFromPath
      return self.importFromDir(dir_path, fqname)
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/site-packages/nose/importer.py line 94 in importFromDir
      mod = load_module(part_fqname, fh, filename, desc)
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/imp.py line 234 in load_module
      return load_source(name, filename, file)
    /Users/hafizbadrie/pyvirtualenv/hubble/lib/python3.5/imp.py line 172 in load_source
      module = _load(spec)
    <frozen importlib._bootstrap> line 693 in _load
      
    <frozen importlib._bootstrap> line 673 in _load_unlocked
      
    <frozen importlib._bootstrap_external> line 662 in exec_module
      
    <frozen importlib._bootstrap> line 222 in _call_with_frames_removed
      
    test_word_count.py line 18 in <module>
      from word_count import WordCount
   ImportError: No module named 'word_count'

-----------------------------------------------------------------------------
1 test run in 0.004 seconds. 
1 error (0 tests passed)
{% endhighlight %}

As I expected, the test failed and it was the time to write the production code. Here's the code that I wrote:

{% highlight python %}
class WordCount(object):
    def __init__(self, sentences):
        self.sentences = sentences.lower()

    def count_words(self):
        words = {}
        exploded = self.sentences.split(' ')
        for word in exploded:
            keys = words.keys()
            if word in keys:
                words[word] += 1
            else:
                words[word] = 1

        return words
{% endhighlight %}

I saved the file and named it with `word_count.py`. Hence, the folder structure was modified to be like this:

{% highlight sh %}
.
├── word_count.py
└── tests
    ├── __init__.py
    └── test_word_count.py
{% endhighlight %}

Again, I ran the test to ensure what I did was correct according to the test. Here's the result of the test:

{% highlight sh %}
.

-----------------------------------------------------------------------------
1 test run in 0.002 seconds (1 test passed)
{% endhighlight %}

Yeay! It passed!

Wait hold on! The job is not over yet. One task in 1 TDD cycle is to do [refactoring](https://en.wikipedia.org/wiki/Code_refactoring){:target="_blank"} to the code. So, I looked back to the code and thought about possible way to refactor the code.
I found it and then I made some changes to the code, so it looked like this:

{% highlight python %}
from collections import Counter

class WordCount(object):
    def __init__(self, sentences):
        self.sentences = sentences.lower()

    def count_words(self):
        words = self.sentences.split(' ')

        return Counter(words)
{% endhighlight %}

Apparently the changes reduced a significant number of line of code. The counter logic has been handled by `Counter` that I imported from `collections`.

Looking at the tests, apparently there was one more test case that I should add to the test file. One thing that I realised was I hadn't handled punctuations.
That will lead to a case where `hello` is different with `hello!`, but it shouldn't. So, here's the additional test case that I added to the test file.

{% highlight python %}
def test_count_words_with_punctuation(self):
    sentences = "Hello world I'm a hello that will rock your world. Anyway I like the way you say hello to me. Thanks!"
    expected_result = {
        'hello': 3,
        'world': 2,
        'i\'m': 1,
        'a': 1,
        'that': 1,
        'will': 1,
        'rock': 1,
        'your': 1,
        'anyway': 1,
        'i': 1,
        'like': 1,
        'the': 1,
        'way': 1,
        'you': 1,
        'say': 1,
        'to': 1,
        'me': 1,
        'thanks': 1
    }

    counter = WordCount(sentences)
    result = counter.count_words()
    assert len(result) == len(expected_result)
{% endhighlight %}

When I ran the test, I got this message:

{% highlight sh %}
.F
======================================================================
1) FAIL: test_count_words_with_punctuation (tests.test_word_count_dup.TestWordCount)
----------------------------------------------------------------------
   Traceback (most recent call last):
    tests/test_word_count_dup.py line 68 in test_count_words_with_punctuation
      assert len(result) == len(expected_result)


-----------------------------------------------------------------------------
2 tests run in 0.002 seconds. 
1 FAILED (1 test passed)
{% endhighlight %}

Awesome! That was expected. So I proceeded to the production code and changed it. This is the result of the changes.

{% highlight python %}
import re
from collections import Counter

class WordCount(object):

    def __init__(self, sentences):
        self.sentences = sentences.lower()

    def count_words(self):
        sentences = re.sub(r'[.!?,:;]', '', self.sentences).strip()
        words = sentences.split(' ')

        return Counter(words)
{% endhighlight %}

I just added a regex search to replace any unwanted punctuations and also stripped all the trailing whitespaces.
When I re-ran the test, the result was like this.

{% highlight python %}
..

-----------------------------------------------------------------------------
2 tests run in 0.001 seconds (2 tests passed)
{% endhighlight %}

OK! Is it done? At that time, I didn't think it was done. Remember, I should spend some time to look back at the code and see for any possibility of refactoring.

My thought about this was to give a clear job description that this class suppose to have. In general, this class should have these tasks:

1. Receive sentences  
2. Clean up the sentences  
3. Count the words

Therefore, I thought I should write the code better so the task **clean up the sentences** can be expressed more obvious.
Here's the test case that I added to the test file to fulfill my design.

{% highlight python %}
def test_cleanup_sentences(self):
    sentences = "Hello world I'm a hello that will rock your world. Anyway I like the way you say hello to me. Thanks!"
    expected_sentences = "hello world i'm a hello that will rock your world anyway i like the way you say hello to me thanks"
    counter = WordCount(sentences)
    prepared_sentences = counter.cleanup_sentences()

    assert prepared_sentences == expected_sentences
{% endhighlight %}

As usual, I ran the test first and got **1 failed test** which is the test that I just added.
This is the production code looked alike after I made some changes to fulfill the test case.

{% highlight python %}
import re
from collections import Counter

class WordCount(object):

    def __init__(self, sentences):
        self.sentences = sentences

    def cleanup_sentences(self):
        lowered_sentences = self.sentences.lower()
        sentences = re.sub(r'[.!?,:;]', '', lowered_sentences)
        return sentences.strip()

    def count_words(self):
        sentences = self.cleanup_sentences()
        words = sentences.split(' ')

        return Counter(words)
{% endhighlight %}

This time when I re-ran the test I got **3 tests passed**!
And that was it, the `WordCount` class that I should have to fulfill my requirement.

Next, I just needed to add some codes to print out the result to the console, and this is the additional code.

{% highlight python %}
if __name__ == '__main__':
    sentences = "Hello world I am a hello that will rock your world. Anyway I like the way you say hello to me. Thanks!"
    counter = WordCount(sentences)
    result = counter.count_words()

    for word, count in result.items():
        print("%s: %d" % (word, count))
{% endhighlight %}

When I ran the whole code, here's what I got:

{% highlight sh %}
the: 1
a: 1
world: 2
me: 1
way: 1
hello: 3
thanks: 1
your: 1
will: 1
am: 1
like: 1
say: 1
i: 2
you: 1
to: 1
anyway: 1
that: 1
rock: 1
{% endhighlight %}

### Lesson Learnt

1. **Setting up tests**  
  It is easy to use **nose** because the setup is very simple and the guidelines in its website is very clear and helpful.
So, if you need to have tests in python, I highly suggest this tool.

2. **`Counter` class**  
  When I did this code kata, that was the first time I knew about `Counter` class. 
All the logic that I implemented was easily replaced with this class. Very handy!

3. **Wrap it up**  
  Apparently, it's fun to have a code kata like this. I know this is way too easy for most people, but I do think this is a very good case to try for the first code kata.
I will certainly do this again in the future with various problem complexity. Hopefully, you guys too!
