/*
* ImgPaste.js   v0.1 *
示例:
$('.contenteditableDiv').imgpaste();
 */
;(function(){
    $.fn.imgpaste = function(){
        $this = $(this);
        var agent = navigator.userAgent.toLocaleLowerCase();
		if(agent.indexOf("firefox")>0){
			return;
		}
        //绑定粘贴事件
        $this.on('paste',function(e){
            var clipboardData = e.originalEvent.clipboardData,
                i = 0,
                items, item, types;
            if(clipboardData){
                items = clipboardData.items;
                if(!items){
                    return;
                }
                item = items[0];
                types = clipboardData.types || [];
                for( ; i < types.length; i++ ){
                    if( types[i] === 'Files' ){
                        item = items[i];
                        break;
                    }
                }
                if(item && item.kind === 'file' && item.type.match(/^image\//i)){
                    //图片插入
                    imgReader(item);
                }
            }
        });
        var imgReader = function( item){
            var blob = item.getAsFile(),
                reader = new FileReader();
            reader.onload = function(e){
                var img = new Image();
                img.src = e.target.result;
                //获取光标对象
                var selection = getSelection();
                var ERange = selection.getRangeAt(0);
                //插入图片
                ERange.insertNode(img);
                //插入图片后光标调整
                var textNode = ERange.endContainer;
                var rangoffset = ERange.endOffset;
                ERange.setStart(textNode,rangoffset);
                ERange.collapse(true);
                //点击图片光标调整事件
                $this.children('img').click(function(){
                    var nselection = getSelection();
                    var range = document.createRange();
                    range.selectNode(this);
                    nselection.removeAllRanges();
                    nselection.addRange(range);
                });
            };
            reader.readAsDataURL(blob);
        };
        return this;    
    }
})(jQuery);