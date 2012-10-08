/*
 * jQuery.filterTable
 * 
 * Adds a row after the first row with input boxes for searching the values within that column
 * dynamically.  It currently does not provide 
 * 
 * @version 1.0
 * @author David Parker [davidwparker(at)gmail(dot)com]
 * @copyright Copyright (c) 2009 David Parker
 * @license MIT
 * @demo: http://davidwparker.com/
 *
 * @function filterTable(options)
 * @param    options object
 *  @options:           default:    description
 *   ajax:              false:      Determines if this table search should use ajax (currently not implemented)
 *   classClear:        clear:      Class used for the clear link (jQuery selector)
 *   classClearAdd:     ""          Class used for the clear link (not a selector, can be used for padding, etc)
 *   classFilterBy:     filterBy    Class used for hidden input
 *   classFilterCol:    filterCol   Class used to apply to all td elements and value for hidden input
 *   classFilterInput:  filterInput Class used for input type=text for the filter
 *   classFilterRow:    filterRow   Class used for 
 *   classFiltered:     highlight   Class used for filtered objects
 *   classFilteredOut:  hide        Class used for filtered out objects
 *   classRowToFilter:  rowToFilter Class used for rows that can be filtered
 *   filter:            filter      filter|filterOut - Determines if filter or filter out objects
 *   filteredRow:       tr:first    jQuery Selector for the row to filter and insert filter row after (generally the first row)
 *   styleFiltered:     {display:none} Style used for filtered objects
 *   styleUnfiltered:   {display:""}   Style used for unfiltered objects
 *   styleFilteredOut   {display:none} Style used for filtered out objects
 *   styleUnfilteredOut {display:""}   Style used for unfiltered out objects
 *   textClear:         clear          Text to be used for the clear link
 * @return   jQuery  object
 *
 * @note: ensure that element (div) surrounding the table has the following styles:
 *    overflow-y:scroll;
 *    height:XXXpx;
 *  to get the desired effect.
 */
(function($){
$.fn.extend({
filterTable: function(opts){
  //setup the defaults for the filter, add the insert row, and add removeClass to all td elements
  var defaults = {
    ajax:false,
    classClear:"clear",
    classClearAdd:"",
    classFilterBy:"filterBy",
    classFilterCol:"filterCol",
    classFilterInput:"filterInput",
    classFilterRow:"filterRow",
    classFiltered:"highlight",
    classFilteredOut:"hide",
    classRowToFilter:"rowToFilter",
    filter:"filter",
    filteredRow:"tr:first",
    filterStyleClass:"style",
    styleFiltered:{"display":"none"},
    styleUnfiltered:{"display":""},
    styleFilteredOut:{"display":"none"},
    styleUnfilteredOut:{"display":""},
    textClear:"clear"
  }, o = $.extend({}, defaults, opts),
    $this = $(this), length = $this.find(o.filteredRow+" th, "+o.filteredRow+" td").length;

  //create insertRow
  var insertRow = "<tr class='"+o.classFilterRow+"'>";
  for (var i = 0; i < length; i++){
    var filterval=o.classFilterCol+i;
    insertRow += "<th><input type='hidden' class='"+o.classFilterBy
      +"' value='"+filterval+"' /><input type='text' class='"+o.classFilterInput
      +"' /><a href='#' class='"+o.classClear+" "+o.classClearAdd+"'>"+o.textClear+"</a></th>";
    
    //attach filterval to each row
    $this.find("tr:not("+o.filteredRow+",."+o.classFilterRow+")").each(function(){
      $(this).find("td").each(function(j){
        if (i === j)
          $(this).addClass(filterval);
      })
    }).addClass(o.classRowToFilter);
  }
  insertRow += "</tr>";
  
  //insert
  $this.find(o.filteredRow).after(insertRow);

  //return
  return this.each(function(){
    var $this = $(this);
    $this.find("."+o.classFilterRow+" ."+o.classFilterInput).keyup(function(){
      filterValues();
    });

    //click
    $("a."+o.classClear).click(function(){
      $(this).parent().find("."+o.classFilterInput).val("");
      filterValues();
      return false;
    });

    //function
    function filterValues(){
      var vals = {};
      //get all the current values and store them by filterby:value
      $this.find("."+o.classFilterInput).each(function(){
        var $finput = $(this), val = $finput.val(), filterval = $finput.parent().find("."+o.classFilterBy).val();
        vals[filterval] = val;
      });
      if (o.ajax){
        //ajax will return the latest data from the database and replace our values
        alert('ajax');
        //this will probably just replace all the rows first then apply css/styles
      }

      //reveal all hidden rows, then re-apply the hide
      var $classRowToFilter = $this.find("."+o.classRowToFilter);
      if (o.filter == "filter"){
        if (o.filterStyleClass === "class"){
          $classRowToFilter.removeClass(o.classFiltered);
        } else if (o.filterStyleClass === "style"){
          $classRowToFilter.css(o.styleUnfiltered);
        }
      }
      else if (o.filter == "filterOut"){
        if (o.filterStyleClass === "class"){
          $classRowToFilter.removeClass(o.classFilteredOut);
        } else if (o.filterStyleClass === "style"){
          $classRowToFilter.css(o.styleUnfilteredOut);
        }
      }

      for (var filterval in vals){
        var theVal = vals[filterval];
        //this appears to work fine for the filterOut, but not for filter
        $this.find("."+o.classRowToFilter+" td."+filterval).each(function(){
          var $cur = $(this), $curRow = $cur.parents("."+o.classRowToFilter);
          //filter - finds matches
          if (o.filter === "filter"){
            if (theVal !== "" && ($cur.html().search(theVal) !== -1)){
              if (o.filterStyleClass === "class")
                $curRow.addClass(o.classFiltered);
              else if (o.filterStyleClass === "style")
                $curRow.css(o.styleFiltered);
            }
          }
          else if (o.filter === "filterOut"){
            //filter out - finds non-matches
            if (theVal !== "" && ($cur.html().search(theVal) === -1)){
              if (o.filterStyleClass === "class")
                $curRow.addClass(o.classFilteredOut);
              else if (o.filterStyleClass === "style")
                $curRow.css(o.styleFilteredOut);
            }
          }
        });
      }
    }
  });
}
});
})(jQuery);
