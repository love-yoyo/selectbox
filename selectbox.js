;(function($){
    var PLUGIN_NAME = "selectbox";
    var Selectbox = function(){
        this._defaults = {
            idPrefix    :"sbHolder",
        };
    };
    Selectbox.prototype._initSelectbox = function(target,options){
        var _$target = $(target),
            self = this,
            _inst = self._getInst(target) || self._newInst(target);
        console.log("prev--"+_inst.settings.classFocus);
        $.extend(_inst.settings,self._defaults,options);
        console.log("next--"+_inst.settings.classFocus);
        
        var wrapDiv = $('<div/>',{
            'id'    :_inst.settings.idPrefix+"_"+_inst.uid,
            'class'    :_inst.settings.classWraper
        });
        var _$ul = $('<ul/>',{
            'id'    : _inst.id+"_"+_inst.uid,
            'class'    : _inst.settings.classUl
        });
        
        /**
         * construct element li and append to element ul
         */
        var _tbIndex = 1;
        _$target.children().each(function(){
            var _option = $(this);
            var _$li = $("<li>");
            _$li.data("value",_option.val()).attr("tabindex",_tbIndex);
            _option.prop("selected") && _$li.addClass(_inst.settings.classFocus);
            _$li.html(_option.html());
            _$ul.append(_$li);
        });
        
        
        /**
         * wrap original selectbox with wrapDiv
         */
        var _selectbox = "";
        var _findUl = _$target.next();
        if(_findUl.length>0){
            if(_findUl.attr("id")== (_inst.id+"_"+_inst.uid)){
                _findUl.remove();
                _selectbox = _$target.parent();
            }else{
                _selectbox = _$target.hide().wrap(wrapDiv).parent();
            }
        }else{
            _selectbox = _$target.hide().wrap(wrapDiv).parent();
        }
        _selectbox.append(_$ul);

        /**
         * attach click event for each element li,
         * use event entrust
         */
        _$ul.delegate("li","click",function(){
            var _li = $(this);
            var _findLi = _$ul.find("li."+_inst.settings.classFocus);
            console.log("Click < li index='"+_findLi.index()+"'>");
            if(_findLi.length>0){
                _findLi.removeClass(_inst.settings.classFocus) && (_findLi.attr("class") == "" && _findLi.removeAttr("class"));
            }
            _li.focus();
            _li.addClass(_inst.settings.classFocus);
            _$target.val(_li.data("value"));
            _inst.selected = _li.index();
        });
        
        
        _$ul.keydown(function(event){
            var key = event.keyCode || event.which;
            switch(key){
                case 38 : //Arrow up
                    var _curLi = $(document.activeElement);
                    var _prevLi = "";
                    if(_curLi.length>0 && (_prevLi=_curLi.prev()) && _prevLi.length>0){
                        var _classFocus = _inst.settings.classFocus;
                        _curLi.removeClass(_classFocus) && (_curLi.attr("class") == "" && _curLi.removeAttr("class"));
                        _prevLi.addClass(_classFocus);
                        _$target.val(_prevLi.data("value"));
                        _inst.selected = _prevLi.index();
                        _prevLi.focus();
                    }
                    break;
                case 40 : //Arrow down
                    var _curLi = $(document.activeElement);
                    var _nextLi = "";
                    if(_curLi.length>0 && (_nextLi=_curLi.next()) && _nextLi.length>0){
                        var _classFocus = _inst.settings.classFocus;
                        _curLi.removeClass(_classFocus) && (_curLi.attr("class") == "" && _curLi.removeAttr("class"));
                        _nextLi.addClass(_classFocus);
                        _$target.val(_nextLi.data("value"));
                        _inst.selected = _nextLi.index();
                        _nextLi.focus();
                    }
                    break;
            }
            event.preventDefault();
        });
        $.data(target[0], PLUGIN_NAME, _inst);
    };
    Selectbox.prototype._newInst = function(target){
        var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1');
        return {
            id: id,
            uid: Math.floor(Math.random() * 99999999),
            isOpen: false,
            isDisabled: false,
            settings: {
                classWraper    :"sbWraper",
                classFocus    :"sbFocus",
                classUl        :"sbUl",
            }
        };
    };
    Selectbox.prototype._getInst = function(target){
        try {
            return $.data(target[0], PLUGIN_NAME);
        }
        catch (err) {
            throw 'Missing instance data for this selectbox';
        }
    };
    
    $.fn.selectbox = function(options){
        if (typeof options == "object" || !options) {
            return $.selectbox._initSelectbox(this,options);
        }
    };
    
    $.selectbox = new Selectbox(); // singleton instance
    $.selectbox.version = "0.2";
})(jQuery);

/**
 * change option position
 */
moveColumn = function(id,action){
    var _sltLi = $("#"+id).find("option:selected");
    if(_sltLi.length<=0){
        return
    }
    var _val = _sltLi.val();
    var _html = _sltLi.html();
    if(action.toUpperCase() == 'U'){
        var _prev = _sltLi.prev();
        if(_prev.length<=0){
            return
        }
        
        _sltLi.val(_prev.val());
        _sltLi.html(_prev.html());
        
        _prev.val(_val);
        _prev.html(_html);
        
        $("#"+id).val(_prev.val());
        $("#"+id).selectbox();
    }else if(action.toUpperCase() == 'D'){
        var _next = _sltLi.next();
        if(_next.length<=0){
            return
        }
        
        _sltLi.val(_next.val());
        _sltLi.html(_next.html());
        
        _next.val(_val);
        _next.html(_html);
        $("#"+id).val(_next.val());
        $("#"+id).selectbox();
    }
};

/**
 * move option to other selectbox
 */
movePosition = function(from,to){
    var _from = $("#"+from);
    
    var sltli = _from.find("option:selected");
    if(!sltli[0]){
        return
    }
    var value = sltli.val();
    var text = sltli.text();
    sltli.remove() && $("#"+to).append("<option value='"+value+"'>"+text+"</option>");
    
    _from.selectbox();
    $("#"+to).selectbox();
    
};