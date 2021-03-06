var grafs = document.getElementsByTagName('p')
var phrases = {
  notSoMuch: 'In start-up land, the young (..) makes a lot of cool apps. But great technology? Not so much.',
  sext: 'sexting app',
  tech: 'technology driven',
  time: 'this is our time',
}

var quotes = {
  sext: [],
  tech: [],
  time: [],
  notSoMuch: []
}

var quoteGrafMap = {
  sext: {grafNum: 0, quoteIdx: 0},
  tech: {grafNum: 0, quoteIdx: 0},
  time: {grafNum: 0, quoteIdx: 0},
  notSoMuch: {grafNum: 0, quoteIdx: 0}
}

$.getJSON('data', function (data) {
  var statuses = data.statuses

  for (var i = 0; i < statuses.length; i++) {
    var tweet = statuses[i]
    var tweetText = tweet.text

    if (tweetText.toLowerCase().indexOf(phrases.sext) != -1) {
      quotes.sext.push(tweet)
    } else if (tweetText.toLowerCase().indexOf(phrases.tech) != -1) {
      quotes.tech.push(tweet)
    } else if (tweetText.toLowerCase().indexOf(phrases.notSoMuch) != -1) {
      quotes.notSoMuch.push(tweet)
    } else if (tweetText.toLowerCase().indexOf(phrases.time) != -1) {
      quotes.time.push(tweet)
    }
  }

  // build the map of quotes to grafs
  for (var i = 0; i < grafs.length; i++) {
    var graf = grafs[i].textContent
    for (key in quotes) {
      var quoteIdx = graf.toLowerCase().indexOf(phrases[key])
      if (quoteIdx != -1) {
        quoteGrafMap[key].grafNum = i
        quoteGrafMap[key].quoteIdx = quoteIdx
      }
    }
  }

  for (key in quoteGrafMap) {
    var grafNum = quoteGrafMap[key].grafNum
    var quoteIdx = quoteGrafMap[key].quoteIdx
    var grafNode = grafs[grafNum]
    var grafText = grafNode.innerHTML

    // highlight quote
    var highlight = "<span data-phrase='" + key + "' class='highlight user'>" + phrases[key] + "</span>"
    var newGraf = replaceBetween(quoteIdx, quoteIdx + phrases[key].length, grafText, highlight)
    grafNode.innerHTML = newGraf

  }

  for (key in quoteGrafMap) {
    paintFaces(key)
  }
})


var template = $("aside.rail");
var paintFaces = function (key) {
  console.log('paint faces')
  console.log('bah')
    // paint faces

    var highlights = $('.highlight')
    console.log(highlights);
    for (var i = 0; i < highlights.length; i++) {
      if (highlights[i].dataset.phrase == key) {
        toAppend = template.clone();
        $(highlights[i]).parent().after(toAppend);
        $(toAppend).offset({ top: $(highlights[i]).offset().top - 50 })
                  .addClass(key);

        var $profiles = $('.rail .profiles .faces');
        $profiles.each(function (index, profile) {
          if (quotes[key][index]) {
            $(profile).css("background-image","url(" + quotes[key][index].user.profile_image_url+")")
                      .attr("href",quotes[key][index].user.url);
          }
        })

        var $names = $('.rail .names .name')
        $names.each(function (index, name) {
          if (quotes[key][index]) {
            name.innerHTML = quotes[key][index].user.name
          }
        })

        var $countWrap = $('.rail .names .count-wrap')
        var $count =  $('.rail .names .count')
        $count.each(function (index, count) {
          if (quotes[key].length - 3 > 0) {
            $($countWrap[index]).show()
            count.innerHTML = quotes[key].length
          } else {
            $countWrap[index].innerHTML = 'tweeted about this.'
            $($countWrap[index]).show()
          }
        })
      }
    }
}

var replaceBetween = function (start, end, initText, newText) {
  return initText.substring(0, start) + newText + initText.substring(end)
}
