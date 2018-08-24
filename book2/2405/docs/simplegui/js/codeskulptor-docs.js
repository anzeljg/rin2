jQuery(function($) {
  ///////////////////////////////////////////////////////////////////
  // Turn on tabs and accordions

  var $tabs = $("#tabs");
  var $accordions = $(".accordion");

  // Turn on the jQuery tabs.
  $tabs.tabs({event: false});

  // Turn on the jQuery collapsible accordions.
  $accordions.accordion({collapsible: true, heightStyle: "content",
                         event: false, active: false});

  ///////////////////////////////////////////////////////////////////
  // Code formatting

  // Format code examples with CodeMirror run mode.
  mode = {name:"python",version:2,singleLineStringErrors:!1};

  function format_cm(elements) {
    var len = elements.length
    for (var i = 0; i < len; i++) {
      element = elements[i];
      text = element.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
      element.innerHTML = "";

      CodeMirror.runMode(text, mode, element);

      element.classList.add("cm-s-default");
    }
  }

  format_cm(document.getElementsByClassName("cm"));
  format_cm(document.getElementsByTagName("code"));


  ///////////////////////////////////////////////////////////////////
  // Display page after all reflow-causing events are done

  $(".hideload").removeClass("hideload");

  ///////////////////////////////////////////////////////////////////
  // Navigation

  function isAccClosed($here) {
    return $here.attr("aria-selected") == "false";
  }

  function enclosingTabID($here) {
    return $here.closest("div.ui-tabs-panel").attr("id");
  }

  function enclosingAccHeaderID($here) {
    return $here.closest(".ui-accordion-content").prev().attr("id");
  }

  // Navigation helper.
  // Opens specified accordion.
  // Assumes any parents are already open.
  function openTab(tabID) {
    var index = $tabs.find('a[href="#' + tabID + '"]').parent().index();
    $tabs.tabs('option', 'active', index);
  }
  function openAccordion($accObject, accHeaderID) {
    var $accHeader = $("#"+accHeaderID);
    $accObject.accordion('option', 'active', $accHeader.index() / 2);
  }
  function toggleAccordion($accObject, accHeaderID) {
    var $accHeader = $("#"+accHeaderID);
    if (isAccClosed($accHeader)) {
      $accObject.accordion('option', 'active', $accHeader.index() / 2);
    }
    else {
      $accObject.accordion('option', 'active', false);
    }
  }

  ///////////////////////////////////////////////////////////////////
  // Hashtag history

  var currentLocationID = "";
  var $navtabs = $(".ui-tabs-nav").find("a");
  var $accheaders = $(".ui-accordion-header");

  function clickTab() {
    var selector = $(this).attr("href");
    currentLocationID = selector.substr(1);
    openTab(currentLocationID);
    return false;  // prevent tab link's default behavior
  }
  function clickAcc() {
    var $here = $(this);
    var clickedID = $here.attr("id");
    if (isAccClosed($here)) {
      currentLocationID = clickedID;
    }
    else {
      parentAccHeaderID = enclosingAccHeaderID($here);
      if (parentAccHeaderID != undefined) {
        currentLocationID = parentAccHeaderID;
      }
      else {
        currentLocationID = enclosingTabID($here);
      }
    }
    toggleAccordion($here.parent(), clickedID);
    return false;  // prevent accordion link's default behavior
  }

  function openDefault() {
    // Avoid window.location.origin, since not supported by all browsers.
    window.location.replace(window.location.protocol + "//" +
     	                    window.location.host +
                            window.location.pathname +
                            $navtabs.attr("href"));
  }

  // If page URL had a hashtag, use that to open the documentation
  // to that ID.
  function openHash() {
    if (window.location.hash == undefined ||
        window.location.hash.length === 0) {
      // Replace no hash with default hash, for better history behavior.
      openDefault();
    }
    else {
      var $here = $(window.location.hash);

      if ($here.length == 0) {
        // Hash isn't a valid ID location.
        // Replace bad hash with default hash, so that it has correct behavior.
        openDefault();
      }
      else {
        var accHeaderID;
        var accArray = [];

        // Find closest accordion.
        if ($here.hasClass("ui-accordion-header")) {
          accHeaderID = window.location.hash.substr(1);
        }
        else {
          accHeaderID = enclosingAccHeaderID($here);
        }
        // Find all enclosing accordions.
        while (accHeaderID != undefined) {
          $here = $("#"+accHeaderID).parent();
          accArray.push([$here,accHeaderID]);

          accHeaderID = enclosingAccHeaderID($here);
        }
        // Find enclosing tab.
        var tabID = enclosingTabID($here);

        // Open enclosing tab.
        openTab(tabID);
        // Open top-level accordion, if any.
        if (accArray.length) {
          var last = accArray.length-1;
          openAccordion(accArray[last][0], accArray[last][1]);

          // Open all nested accordions.
          for (var i = last-1; i>=0; i--) {
            openAccordion(accArray[i][0], accArray[i][1]);
          }
        }
      }
    }
  }

  function useInternalLink() {
    $(window).off('hashchange', openHash);
    window.location.hash = "#"+currentLocationID;
    currentLocationID = "";
    $(window).on('hashchange', openHash);
    window.location.hash = "#"+$(this).attr("data-dest");
    return false;  // prevent tab link's default behavior
  }

  $('a.internal').on('click',useInternalLink);
  $navtabs.on('click',clickTab);
  $accheaders.on('click',clickAcc);
  $(window).on('hashchange', openHash);

  // Have accordions automatically scroll to the top of the window.
  // Desirable to maximize the amount of the accordion that is displayed
  // when it is opened.
  $accordions.on('accordionactivate', function(event, ui) {
    if (ui.newHeader.length) {
      $('html, body').animate({scrollTop: $(ui.newHeader).offset().top}, 1);
    }
  });

  $(window).trigger('hashchange');


  ///////////////////////////////////////////////////////////////////
  // Search

  // Formats link text.
  function makeInternalLink(linkto, linkhtml) {
    return "<a href='#' class='internal' data-dest='" +
           linkto + "'>" + linkhtml + "</a>";
  }

  // Define a case-insensitive version, for use in text searching.
  jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };  

  // Helper for search.
  // Adds a link to a tab.
  function addTabLink(tabID, linkhtml, linkIDsArray, linksArray) {
    // Make sure not a duplicate link.
    if (jQuery.inArray(tabID, linkIDsArray) == -1) {
      linkIDsArray.push(tabID);
      linksArray.push("<li>" + makeInternalLink(tabID, linkhtml) + "</li>\n");
    }
  }

  // Helper for search.
  // Adds a link to an accordion.
  function addAccLink($thisAccHeader, linkIDsArray, linksArray) {
    var thisAccID = $thisAccHeader.attr("id");

    // Make sure not a duplicate link.
    if (jQuery.inArray(thisAccID, linkIDsArray) == -1) {
      linkIDsArray.push(thisAccID);
      linksArray.push("<li>" + 
                      makeInternalLink(thisAccID, $thisAccHeader.find("a").html()) +
                      "</li>\n");
    }
  }

  // Speed up search by defining the following search locations once.
  var $searchresults = $("#searchresults");
  var $tabcontent = $(".ui-tabs-panel").children().not(".accordion");
  var $acccontent = $(".ui-accordion-content").children().not(".accordion");
  var $searchtab = $(".searchtab");
  var $searchbox = $("#searchbox");
  var searchtabid = "tabs-Search";
  var searchtabindex = $tabs.find('a[href="#' + searchtabid + '"]').parent().index();

  // Only search if input is long enough.
  // Avoids too many hits
  var minSearchLength = 2;

  // Search for all instances of the search text that occur in the docs.
  // Assumes tab-accordion-accordion structure.
  $searchbox.keyup(function() {
    // Erase any previous search results.
    $searchresults.html("");

    var searchtext = $(this).val();

    if (searchtext.length < minSearchLength) {
      $searchtab.addClass("hide");
    }
    else {
      $searchtab.removeClass("hide");

      // If Search Tab not open, open it and add it to history.
      // Changing hash will lose the searchbox focus, so put focus back.
      var currenttabindex = $tabs.tabs('option', 'active');
      if (currenttabindex != searchtabindex) {
        $tabs.tabs('option', 'active', searchtabindex);
        currentLocationID = searchtabid;
        $searchbox.focus();
      }

      // Array of IDs of hits.
      // Used to make sure we don't include duplicate hits.
      var linkIDsArray = [];

      // Array of HTML strings for all the hits to display.
      var linksArray = [];

      // JQuery search criteria for finding the search text.
      var wordsArray = searchtext.split(/\s+/).filter(function(word)
                                                      {return word.length > 0;});
      var containsArray = wordsArray.map(function(word)
                                         {return ":Contains(" + word +")";});
      var contains = containsArray.join("");

      // Search navigation tabs
      $navtabs.filter(contains).each(function() {
        var tabID = $(this).attr("href").substr(1);
        var linkhtml = $(this).html();
        addTabLink(tabID, linkhtml, linkIDsArray, linksArray);
      });

      // Search tab content not in accordion
      $tabcontent.filter(contains).each(function() {
        var $tab = $(this).parent();
        var tabID = $tab.attr("id");
        var linkhtml = $navtabs.filter("[href='#" + tabID + "']").html();
        addTabLink(tabID, linkhtml, linkIDsArray, linksArray);
      });

      // Search accordion header
      $accheaders.filter(contains).each(function() {
        var $thisAccHeader = $(this);
        addAccLink($thisAccHeader, linkIDsArray, linksArray);
      });

      // Search accordion content not in a nested accordion
      $acccontent.filter(contains).each(function() {
        var $thisAccHeader = $(this).parent().prev();
        addAccLink($thisAccHeader, linkIDsArray, linksArray);
      });

      // Display search results.
      var resultsText = "<h2>Found " + linksArray.length + 
                        " results for <strong>" + searchtext +
	                "</strong>:</h2> <ul>" +
                        linksArray.join(" ") + "</ul>";
      searchresults.innerHTML = resultsText;

      $searchresults.find("a.internal").on('click',useInternalLink);
    }
  });
});
